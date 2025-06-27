import { CSVLink } from 'react-csv';
import Button from '../../ui/button'; // Adjust path based on your project

interface ExportButtonsProps {
  data: Record<string, any>[];
  fileName: string;
  includePrint?: boolean;
}

const ExportButtons = ({ data, fileName, includePrint = false }: ExportButtonsProps) => {
  const hasData = data.length > 0;

  const handlePDFExport = async () => {
    if (!hasData) return;

    const jsPDFModule = await import('jspdf');
    const autoTable = (await import('jspdf-autotable')).default;
    const doc = new jsPDFModule.default();
    autoTable(doc, {
      head: [Object.keys(data[0])],
      body: data.map((row) => Object.values(row)),
    });
    doc.save(`${fileName}.pdf`);
  };

  const handlePrint = () => {
    const printableWindow = window.open('', '', 'width=800,height=600');
    if (!printableWindow) return;

    const tableHtml = `
      <html>
        <head>
          <title>${fileName}</title>
          <style>
            table {
              width: 100%;
              border-collapse: collapse;
              font-family: sans-serif;
              font-size: 14px;
            }
            th, td {
              border: 1px solid #ccc;
              padding: 8px;
              text-align: left;
            }
            th {
              background: #f5f5f5;
            }
          </style>
        </head>
        <body>
          <h3>${fileName}</h3>
          <table>
            <thead>
              <tr>${Object.keys(data[0] || {}).map((key) => `<th>${key}</th>`).join('')}</tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (row) =>
                    `<tr>${Object.values(row)
                      .map((val) => `<td>${val}</td>`)
                      .join('')}</tr>`
                )
                .join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printableWindow.document.write(tableHtml);
    printableWindow.document.close();
    printableWindow.print();
  };

  return (
    <div className="flex gap-4 mt-4">
      <CSVLink
        data={data}
        filename={`${fileName}.csv`}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm"
      >
        Export CSV
      </CSVLink>

      <Button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        onClick={handlePDFExport}
        disabled={!hasData}
      >
        Export PDF
      </Button>

      {includePrint && (
        <Button
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded text-sm"
          onClick={handlePrint}
          disabled={!hasData}
        >
          Print View
        </Button>
      )}
    </div>
  );
};

export default ExportButtons;