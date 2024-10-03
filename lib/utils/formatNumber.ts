export function formatNumber(value: string | null): string {
  if (value === null || value === '') {
    return 'N/A';
  }
  return value;
}

export default formatNumber; // 使用默认导出
