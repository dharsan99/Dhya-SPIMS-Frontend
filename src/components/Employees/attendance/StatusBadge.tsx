import { CheckCircle, AlertTriangle, XCircle } from 'lucide-react';

export const getStatusBadge = (status?: string) => {
  const normalized = status?.toUpperCase?.();

  switch (normalized) {
    case 'PRESENT':
      return <span className="text-green-600">✅</span>;
    case 'HALF_DAY':
      return <span className="text-yellow-500">½</span>;
    case 'LEAVE':
      return <span className="text-blue-500">📘</span>;
    case 'ABSENT':
      return <span className="text-red-500">❌</span>;
    default:
      return <span className="text-gray-400">–</span>;
  }
};


export const getAttendenceStatusBadge = (status?: string) => {
  switch (status) {
    case 'PRESENT':
      return (
        <span className="flex items-center gap-1 text-green-600 font-semibold justify-center">
          <CheckCircle className="w-4 h-4" /> Present
        </span>
      );
    case 'HALF_DAY':
      return (
        <span className="flex items-center gap-1 text-yellow-500 font-semibold justify-center">
          <AlertTriangle className="w-4 h-4" /> Half Day
        </span>
      );
    default:
      return (
        <span className="flex items-center gap-1 text-red-500 font-semibold justify-center">
          <XCircle className="w-4 h-4" /> Absent
        </span>
      );
  }
};