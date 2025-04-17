interface Props {
    page: number;
    setPage: (p: number) => void;
    rowsPerPage: number;
    setRowsPerPage: (r: number) => void;
    total: number;
    options?: number[];
  }
  
  const Pagination = ({ page, setPage, rowsPerPage, setRowsPerPage, total, options = [3, 5, 10] }: Props) => {
    const totalPages = Math.ceil(total / rowsPerPage);
  
    return (
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          Rows per page:
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setPage(1);
            }}
            className="border rounded px-2 py-1"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>
  
        <div className="flex items-center gap-3">
        <button
  onClick={() => setPage(Math.max(page - 1, 1))}
  disabled={page === 1}
  className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
>
  Prev
</button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
  onClick={() => setPage(Math.min(page + 1, totalPages))}
  disabled={page === totalPages}
  className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
>
  Next
</button>
        </div>
      </div>
    );
  };
  
  export default Pagination;