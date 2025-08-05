import clsx from 'clsx';

interface TabHeaderProps<T extends string> {
  tabs: readonly T[];
  activeTab: T;
  setActiveTab: (tab: T) => void;
}

function TabHeader<T extends string>({
  tabs,
  activeTab,
  setActiveTab,
}: TabHeaderProps<T>) {
  return (
    <div className="flex border-b mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={clsx(
            'px-4 py-2 border-b-2 font-medium transition',
            activeTab === tab
              ? 'border-blue-600 text-blue-600 dark:text-blue-400'
              : 'border-transparent text-gray-600 dark:text-gray-300 hover:text-blue-600'
          )}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default TabHeader;