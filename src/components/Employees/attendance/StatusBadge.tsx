
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
        return <span className="text-green-600 font-semibold">✅ Present</span>;
      case 'HALF_DAY':
        return <span className="text-yellow-500 font-semibold">⚠️ Half Day</span>;
      default:
        return <span className="text-red-500 font-semibold">❌ Absent</span>;
    }
  };