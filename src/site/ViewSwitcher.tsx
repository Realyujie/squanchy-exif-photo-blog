import { clsx } from 'clsx/lite';
import Link from 'next/link';
import { PATH_ADMIN, PATH_FEED, PATH_GRID, PATH_VIDEOS } from './paths';
import { BsGrid3X3 } from 'react-icons/bs';
import { HiOutlineViewList } from 'react-icons/hi';
import { BiCog } from 'react-icons/bi';
import { MdOutlineVideoLibrary } from 'react-icons/md';
import { useAppState } from '@/state/AppState';
import { GRID_HOMEPAGE_ENABLED } from './config';

export type SwitcherSelection = 'grid' | 'feed' | 'admin';

export default function ViewSwitcher({
  currentSelection,
  showAdmin,
}: {
  currentSelection?: SwitcherSelection
  showAdmin?: boolean
}) {
  const { setIsCommandKOpen } = useAppState();

  const buttonClass = (isSelected?: boolean) => clsx(
    'flex items-center justify-center',
    'w-10 h-10 rounded-lg',
    'hover:bg-gray-100 active:bg-gray-200',
    'hover:dark:bg-gray-800 active:dark:bg-gray-700',
    isSelected && 'bg-gray-100 dark:bg-gray-800',
  );

  return (
    <div className="flex gap-0.5">
      <Link
        href={PATH_GRID}
        className={buttonClass(currentSelection === 'grid')}
        aria-label="Grid View"
      >
        <BsGrid3X3 size={20} />
      </Link>
      <Link
        href={PATH_FEED}
        className={buttonClass(currentSelection === 'feed')}
        aria-label="Feed View"
      >
        <HiOutlineViewList size={24} />
      </Link>
      <Link
        href={PATH_VIDEOS}
        className={buttonClass()}
        aria-label="Videos"
      >
        <MdOutlineVideoLibrary size={22} />
      </Link>
      {showAdmin &&
        <Link
          href={PATH_ADMIN}
          className={buttonClass(currentSelection === 'admin')}
          aria-label="Admin"
        >
          <BiCog size={22} />
        </Link>}
    </div>
  );
}
