import { sql, query } from '@/services/postgres';
import { Video, VideoDb, VideoDbInsert, parseVideoFromDb } from '@/video';
import { SHOULD_DEBUG_SQL } from '@/site/config';

const createVideosTable = () =>
  sql`
    CREATE TABLE IF NOT EXISTS videos (
      id VARCHAR(8) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      youtube_id VARCHAR(255) NOT NULL,
      thumbnail_url VARCHAR(255) NOT NULL,
      priority_order REAL,
      hidden BOOLEAN DEFAULT FALSE,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    )
  `;

const safelyQueryVideos = async <T>(
  callback: () => Promise<T>,
  debugMessage: string,
): Promise<T> => {
  let result: T;
  const start = new Date();

  try {
    result = await callback();
  } catch (e: any) {
    if (/relation "videos" does not exist/i.test(e.message)) {
      // 如果表不存在，创建它
      console.log('Creating videos table ...');
      await createVideosTable();
      result = await callback();
    } else {
      console.log(`sql get error: ${e.message} `);
      throw e;
    }
  }

  if (SHOULD_DEBUG_SQL && debugMessage) {
    const time = (((new Date()).getTime() - start.getTime()) / 1000).toFixed(2);
    console.log(`Executing sql query: ${debugMessage} (${time} seconds)`);
  }

  return result;
};

export type GetVideosOptions = {
  sortBy?: 'createdAt' | 'createdAtAsc' | 'priority'
  limit?: number
  offset?: number
  hidden?: 'exclude' | 'include' | 'only'
};

const getWheresFromOptions = (options: GetVideosOptions) => {
  const wheres: string[] = [];
  const wheresValues: (string | number)[] = [];

  if (options.hidden === 'exclude') {
    wheres.push('hidden IS NOT TRUE');
  } else if (options.hidden === 'only') {
    wheres.push('hidden IS TRUE');
  }

  return {
    wheres: wheres.length > 0 ? `WHERE ${wheres.join(' AND ')}` : '',
    wheresValues,
    lastValuesIndex: wheresValues.length,
  };
};

const getOrderByFromOptions = (options: GetVideosOptions) => {
  switch (options.sortBy) {
    case 'createdAtAsc':
      return 'ORDER BY created_at ASC';
    case 'priority':
      return 'ORDER BY priority_order ASC NULLS LAST, created_at DESC';
    case 'createdAt':
    default:
      return 'ORDER BY created_at DESC';
  }
};

const getLimitAndOffsetFromOptions = (
  options: GetVideosOptions,
  lastValuesIndex: number,
) => {
  const values: number[] = [];
  const sql: string[] = [];
  let valuesIndex = lastValuesIndex + 1;

  if (options.limit) {
    sql.push(`LIMIT $${valuesIndex++}`);
    values.push(options.limit);
  }

  if (options.offset) {
    sql.push(`OFFSET $${valuesIndex++}`);
    values.push(options.offset);
  }

  return {
    limitAndOffset: sql.join(' '),
    limitAndOffsetValues: values,
  };
};

export const getVideos = async (options: GetVideosOptions = {}): Promise<Video[]> =>
  safelyQueryVideos(async () => {
    const sql = ['SELECT * FROM videos'];
    const values = [] as (string | number)[];

    const {
      wheres,
      wheresValues,
      lastValuesIndex,
    } = getWheresFromOptions(options);
    
    if (wheres) {
      sql.push(wheres);
      values.push(...wheresValues);
    }

    sql.push(getOrderByFromOptions(options));

    const {
      limitAndOffset,
      limitAndOffsetValues,
    } = getLimitAndOffsetFromOptions(options, lastValuesIndex);

    sql.push(limitAndOffset);
    values.push(...limitAndOffsetValues);

    return query<VideoDb>(sql.join(' '), values)
      .then(({ rows }) => rows.map(parseVideoFromDb));
  }, 'getVideos');

export const getVideo = async (
  id: string,
  includeHidden?: boolean,
): Promise<Video | undefined> =>
  safelyQueryVideos(async () => {
    return (includeHidden
      ? sql<VideoDb>`SELECT * FROM videos WHERE id=${id} LIMIT 1`
      : sql<VideoDb>`SELECT * FROM videos WHERE id=${id} AND hidden IS NOT TRUE LIMIT 1`)
      .then(({ rows }) => rows.map(parseVideoFromDb))
      .then(videos => videos.length > 0 ? videos[0] : undefined);
  }, 'getVideo');

export const getVideosMeta = (options: GetVideosOptions = {}) =>
  safelyQueryVideos(async () => {
    let sql = 'SELECT COUNT(*) FROM videos';
    const { wheres, wheresValues } = getWheresFromOptions(options);
    if (wheres) { sql += ` ${wheres}`; }
    return query(sql, wheresValues)
      .then(({ rows }) => ({
        count: parseInt(rows[0].count, 10),
      }));
  }, 'getVideosMeta');

export const insertVideo = (video: VideoDbInsert) =>
  safelyQueryVideos(() => sql`
    INSERT INTO videos (
      id,
      title,
      description,
      youtube_id,
      thumbnail_url,
      priority_order,
      hidden,
      created_at,
      updated_at
    ) VALUES (
      ${video.id},
      ${video.title},
      ${video.description},
      ${video.youtubeId},
      ${video.thumbnailUrl},
      ${video.priorityOrder || null},
      ${video.hidden},
      ${video.createdAt},
      ${video.updatedAt}
    )
  `, 'insertVideo');

export const updateVideo = (video: VideoDbInsert) =>
  safelyQueryVideos(() => sql`
    UPDATE videos SET
    title=${video.title},
    description=${video.description},
    youtube_id=${video.youtubeId},
    thumbnail_url=${video.thumbnailUrl},
    priority_order=${video.priorityOrder || null},
    hidden=${video.hidden},
    updated_at=${video.updatedAt}
    WHERE id=${video.id}
  `, 'updateVideo');

export const deleteVideo = (id: string) =>
  safelyQueryVideos(() => sql`
    DELETE FROM videos WHERE id=${id}
  `, 'deleteVideo'); 
