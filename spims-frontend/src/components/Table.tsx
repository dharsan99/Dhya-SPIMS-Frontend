import { JSX } from "react";

interface TableProps {
    headers: string[];
    rows: (string | number | JSX.Element)[][];
  }
  
  const Table = ({ headers, rows }: TableProps) => {
    return (
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="py-2 px-4 border-b text-left text-sm font-semibold text-gray-700">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-gray-50">
              {row.map((cell, cIdx) => (
                <td key={cIdx} className="py-2 px-4 border-b text-sm text-gray-800">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
  export default Table;