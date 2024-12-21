import { LocaleConfig } from 'react-native-calendars';
import { holidays } from '../../../data/holidays';

// 配置中文
LocaleConfig.locales['zh'] = {
  monthNames: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  dayNames: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'],
  dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
};

LocaleConfig.defaultLocale = 'zh';

// 处理节日标记
const markedDates = holidays.reduce((acc, holiday) => ({
  ...acc,
  [holiday.date]: {
    marked: true,
    dots: [
      {
        color: holiday.type === 'traditional' ? '#ff0000' : 
               holiday.type === 'international' ? '#00ff00' : '#0000ff',
      }
    ],
    selected: true,
    selectedColor: 'rgba(0, 0, 0, 0.1)',
  }
}), {});

export const calendarConfig = {
  markedDates,
  markingType: 'multi-dot',
  theme: {
    todayTextColor: '#2d4150',
    selectedDayBackgroundColor: '#e6e6e6',
    selectedDayTextColor: '#2d4150',
    arrowColor: '#2d4150',
    monthTextColor: '#2d4150',
    textDayFontSize: 14,
    textMonthFontSize: 16,
    textDayHeaderFontSize: 14,
    'stylesheet.calendar.header': {
      arrow: {
        padding: 10,
      },
    },
  },
  enableSwipeMonths: true,
};