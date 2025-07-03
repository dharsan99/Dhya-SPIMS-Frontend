import { FC } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportControlsProps {
  data: any[];
  fileName: string;
}

const ExportControls: FC<ExportControlsProps> = ({ data, fileName }) => {
  const handlePDFExport = () => {
    if (!data.length) return;

    const doc = new jsPDF();
    const tableHead = Object.keys(data[0]);
    const tableBody = data.map((row) => tableHead.map((key) => row[key]));

    autoTable(doc, {
      head: [tableHead],
      body: tableBody,
    });

    doc.save(`${fileName}.pdf`);
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
      <button
        onClick={handlePDFExport}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
      >
        Export PDF
      </button>
    </div>
  );
};

export default ExportControls;