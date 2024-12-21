// app/(tabs)/calendar.tsx
import { View } from '../../components/Themed';
import { Calendar } from 'react-native-calendars';
import { useState } from 'react';
import { Holiday } from '../../types/holiday';
import { calendarConfig } from '../../src/features/calendar/config';
import { styles } from '../../src/features/calendar/styles';
import DayComponent from '../../src/features/calendar/components/DayComponent';
import HolidayModal from '../../src/features/calendar/components/HolidayModal';
import Legend from '../../src/features/calendar/components/Legend';

export default function CalendarScreen() {
  const [selectedHoliday, setSelectedHoliday] = useState<Holiday | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View style={styles.container}>
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
    </View>
  );
}