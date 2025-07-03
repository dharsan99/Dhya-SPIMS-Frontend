export const formatValue = (val: any, fixed?: number) => {
  if (val === null || val === undefined || val === '') return '--';
  return typeof val === 'number' && fixed !== undefined ? val.toFixed(fixed) : val;
};