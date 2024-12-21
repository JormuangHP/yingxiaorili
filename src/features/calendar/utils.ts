import Lunar from 'lunar-javascript';

export function getLunarDate(dateString: string): string {
  try {
    const [year, month, day] = dateString.split('-').map(Number);
    if (!year || !month || !day) return '';

    const lunar = Lunar.Solar.fromYmd(year, month, day).getLunar();
    const monthStr = lunar.getMonthInChinese();
    const dayStr = lunar.getDayInChinese();
    
    if (dayStr === '初一') {
      return `${monthStr}月`;
    }
    return dayStr;
  } catch (error) {
    console.log('getLunarDate error:', error);
    return '';
  }
}