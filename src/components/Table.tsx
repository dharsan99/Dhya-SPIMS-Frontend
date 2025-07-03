import { JSX } from "react";

interface TableProps {
  headers: string[];
  rows: (string | number | JSX.Element)[][];
}

const Table = ({ headers, rows }: TableProps) => {
  return (
    <div className="overflow-x-auto rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <table className="min-w-full table-auto border-collapse">
        <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                className="px-4 py-3 text-sm font-semibold text-gray-600 dark:text-gray-300 text-left border-b border-gray-300 dark:border-gray-700"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length > 0 ? (
            rows.map((row, rIdx) => (
              <tr
                key={rIdx}
                className={`transition-colors duration-150 hover:bg-blue-50 dark:hover:bg-gray-700 ${
                  rIdx % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                }`}
              >
                {row.map((cell, cIdx) => (
                  <td
                    key={cIdx}
                    className="px-4 py-3 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700"
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={headers.length}
                className="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
              >
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;