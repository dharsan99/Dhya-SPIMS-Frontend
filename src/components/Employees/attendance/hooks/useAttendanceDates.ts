import { useMemo } from 'react';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';

import { parseISO } from 'date-fns/parseISO';
import { eachDayOfInterval } from 'date-fns/eachDayOfInterval';

export const useAttendanceDates = (rangeMode: 'day' | 'week' | 'month', date: string) => {
  const currentDate = parseISO(date);

  const weekDates = useMemo(() => {
    return eachDayOfInterval({
      start: startOfWeek(currentDate),
      end: endOfWeek(currentDate),
    }).map((d) => format(d, 'yyyy-MM-dd'));
  }, [currentDate]);

  const monthDates = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate),
    }).map((d) => format(d, 'yyyy-MM-dd'));
  }, [currentDate]);

  const dates = useMemo(() => {
    if (rangeMode === 'week') return weekDates;
    if (rangeMode === 'month') return monthDates;
    return [date];
  }, [rangeMode, weekDates, monthDates, date]);

  return { dates, weekDates, monthDates };
};
