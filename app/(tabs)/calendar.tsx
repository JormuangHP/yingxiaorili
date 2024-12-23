// app/(tabs)/calendar.tsx
import * as React from 'react';
import type { ComponentType } from 'react';
import { ViewStyle } from 'react-native';
import { View } from '../../components/Themed';
import { Calendar } from 'react-native-calendars';
import { Holiday } from '../../types/holiday';
import { calendarConfig } from '../../src/features/calendar/config';
import { styles } from '../../src/features/calendar/styles';
import DayComponent from '../../src/features/calendar/components/DayComponent';
import HolidayModal from '../../src/features/calendar/components/HolidayModal';
import Legend from '../../src/features/calendar/components/Legend';

// 组件类型定义
type ViewComponentType = ComponentType<{
  style?: ViewStyle;
  children?: React.ReactNode;
}>;

// 组件转换
const ViewComponent = View as ViewComponentType;

export default function CalendarScreen() {
  const [selectedHoliday, setSelectedHoliday] = React.useState<Holiday | null>(null);
  const [modalVisible, setModalVisible] = React.useState(false);

  return (
    <ViewComponent style={styles.container}>
      <Calendar
        {...calendarConfig}
        dayComponent={({date, state}) => (
          <DayComponent 
            date={date}
            state={state}
            onHolidayPress={(holiday) => {
              setSelectedHoliday(holiday);
              setModalVisible(true);
            }}
          />
        )}
      />
      
      <Legend />

      <HolidayModal
        visible={modalVisible}
        holiday={selectedHoliday}
        onClose={() => setModalVisible(false)}
      />
    </ViewComponent>
  );
}