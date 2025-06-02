import { sections } from "./sectionsData";

interface PrevNextNavigationProps {
  currentIndex: number;
  setActiveIndex: (index: number) => void;
}

export default function PrevNextNavigation({ currentIndex, setActiveIndex }: PrevNextNavigationProps) {
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === sections.length - 1;

  const goToSection = (index: number) => {
    if (index >= 0 && index < sections.length) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="flex justify-between pt-8 mt-16 border-t border-gray-200 dark:border-gray-700">
      {/* Previous */}
      <button
        onClick={() => goToSection(currentIndex - 1)}
        disabled={isFirst}
        className={`px-6 py-2 rounded-full font-semibold ${
          isFirst
            ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-400 dark:hover:bg-gray-500"
        }`}
      >
        Previous
      </button>

      {/* Next */}
      <button
        onClick={() => goToSection(currentIndex + 1)}
        disabled={isLast}
        className={`px-6 py-2 rounded-full font-semibold ${
          isLast
            ? "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {isLast ? "Finish" : `Next: ${sections[currentIndex + 1].label}`}
      </button>
    </div>
  );
}