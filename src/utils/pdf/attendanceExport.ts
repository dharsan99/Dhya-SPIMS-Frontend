import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format as formatDate, addDays, isValid } from 'date-fns';
import type { Styles, HAlignType } from 'jspdf-autotable';
import { AttendanceRow } from '../../components/Employees/attendance/AttendanceTypes';
import { AttendanceRecord } from '@/types/attendance';

// Paste full base64 logo string here
const LOGO_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCADuAcQDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD36iiimIKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopO9AC0UUUAFFFFABRRRQAUUUUAFFFFABTWYKpYnAHc06vO/iP4sNhbf2VZSAX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';

const formatDateRange = (range?: string, mode: 'month' | 'week' | 'day' = 'month') => {
  if (!range) return 'Date Range';
  const start = new Date(range);
  if (!isValid(start)) return range;

  if (mode === 'month') return formatDate(start, 'MMMM yyyy');
  if (mode === 'week') return `${formatDate(start, 'dd MMM')} - ${formatDate(addDays(start, 6), 'dd MMM')}`;
  return formatDate(start, 'dd MMM yyyy');
};

const formatDepartment = (dept?: string) => dept || 'All Departments';

const getStatusLabel = (status?: string, mode: 'short' | 'full' = 'short') => {
  const s = status?.toUpperCase?.();

  if (mode === 'full') {
    return s === 'PRESENT' ? 'Present'
      : s === 'HALF_DAY' ? 'Half Day'
      : s === 'LEAVE' ? 'Leave'
      : s === 'ABSENT' ? 'Absent'
      : '-';
  }

  return s === 'PRESENT' ? 'P'
    : s === 'HALF_DAY' ? '½'
    : s === 'LEAVE' || s === 'ABSENT' ? 'x'
    : '-';
};

interface Summary {
  wd: number;
  ot: number;
  th: number;
  wages: number;
}

const computeSummaryMap = (
  employees: AttendanceRecord[],
  dates: string[],
  attendanceMap: Record<string, Record<string, AttendanceRow>>
): Record<string, Summary> => {
  const summaryMap: Record<string, Summary> = {};

  for (const emp of employees) {
    let wd = 0, ot = 0, th = 0;

    for (const date of dates) {
      const att = attendanceMap[date]?.[emp.employee_id];
      if (!att) continue;

      if (att.status === 'PRESENT') wd += 1;
      else if (att.status === 'HALF_DAY') wd += 0.5;

      th += att.total_hours || 0;
      ot += att.overtime_hours || 0;
    }

    // ✅ Rule enforcement
    if (wd === 0 && ot === 0) {
      th = 0;
    }

  

    const hourlyRate = (emp.shift_rate ?? 0) / 8;
    const wages = wd === 0 && ot === 0 ? 0 : parseFloat((hourlyRate * th).toFixed(2));

    summaryMap[emp.employee_id] = { wd, ot, th, wages };
  }

  return summaryMap;
};

export const generateAttendancePDF = (props: {
  employees: AttendanceRecord[];
  attendanceMap: Record<string, Record<string, AttendanceRow>>;
  dates: string[];
  departmentName?: string;
  dateRange?: string;
  displayMode?: 'short' | 'full';
    rangeMode?: 'day' | 'week' | 'month'; // ✅ Add this

}) => {
  const {
    employees,
    attendanceMap,
    dates,
    departmentName,
    dateRange,
    displayMode = 'short',
    rangeMode = 'month',
  } = props;

  const doc = new jsPDF('landscape', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();

  const summaryMap = computeSummaryMap(employees, dates, attendanceMap);

  // HEADER
  const drawHeader = () => {
    doc.addImage(LOGO_URL, 'JPEG', 10, 8, 30, 15); // logo
    doc.setFontSize(14);
    doc.text(
  `Attendance Report (${formatDateRange(dateRange, rangeMode)})`,
  pageWidth / 2,
  14,
  { align: 'center' }
);
    doc.setFontSize(10);
    doc.text(`Department: ${formatDepartment(departmentName)}`, pageWidth / 2, 20, { align: 'center' });
  };

  const body = employees.map(emp => {
    const summary = summaryMap[emp.employee_id] || { wd: 0, ot: 0, th: 0, wages: 0 };
    return [
      emp.employee.token_no ?? '',
      emp.name ?? '',
      ...dates.map(date => getStatusLabel(attendanceMap[date]?.[emp.employee_id]?.status, displayMode) ?? '-'),
      summary.wd,
      summary.ot,
      summary.th,
      `Rs.${summary.wages.toFixed(2)}`
    ];
  });

  const tableHead = [
    'T.No',
    'Employee',
    ...dates.map(d => String(new Date(d).getDate()).padStart(2, '0')),
    'WD', 'OT', 'TH', 'Wages'
  ];

  const leftMargin = 5;
  const rightMargin = 5;
  const usableWidth = pageWidth - leftMargin - rightMargin;

  const columnRatios: number[] = [
    0.06,   // T.No
    0.15,   // Employee
    ...Array(dates.length).fill(0.015), // Dates
    0.05, 0.05, 0.05, 0.06 // WD OT TH Wages
  ];

  const ratioSum = columnRatios.reduce((a, b) => a + b, 0);
  const columnStyles: { [key: number]: Partial<Styles> } = {};
  columnRatios.map(r => r / ratioSum).forEach((ratio, index) => {
    columnStyles[index] = {
      cellWidth: ratio * usableWidth,
      halign: 'center' as HAlignType
    };
  });

  drawHeader();
  autoTable(doc, {
    startY: 30,
    head: [tableHead],
    body,
    margin: { top: 10, left: leftMargin, right: rightMargin },
    styles: {
      fontSize: 6.5,
      halign: 'center',
      valign: 'middle',
      overflow: 'linebreak',
      cellPadding: 1.2,
    },
    headStyles: {
      fillColor: [22, 160, 133],
      fontSize: 6.8,
      fontStyle: 'bold',
      halign: 'center',
    },
    columnStyles,
    theme: 'grid'
  });

  const finalY = (doc as any).lastAutoTable.finalY ?? 30;
doc.setFontSize(10);

// Horizontal footer fields
doc.text('Prepared by: __________', 10, finalY + 15);
doc.text('Verified by: __________', pageWidth / 2 - 40, finalY + 15);
doc.text('Authorized Signatory: __________', pageWidth - 80, finalY + 15);

// Watermark aligned to bottom-right corner
const pageHeight = doc.internal.pageSize.getHeight();
const watermarkText = `Generated by NSC Spinning Mills | SPIMS | Dhya Innovations on ${new Date().toLocaleDateString('en-IN')}`;
doc.setFontSize(8);
doc.setTextColor(150); // Light grey
doc.text(watermarkText, pageWidth - doc.getTextWidth(watermarkText) - 10, pageHeight - 8);


  doc.save(`Attendance_Report_(${formatDateRange(dateRange, rangeMode)})`);
};