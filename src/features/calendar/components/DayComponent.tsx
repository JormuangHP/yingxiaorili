import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { DateData } from 'react-native-calendars';
import { getHolidayInfo, HolidayInfo } from '../../../utils/holidayUtil';
import { styles } from '../styles';
import { getLunarDate } from '../utils';

interface DayComponentProps {
  date?: DateData;
  onHolidayPress: (holiday: HolidayInfo) => void;
  state?: string;
}

export default function DayComponent({ date, onHolidayPress, state }: DayComponentProps) {
  if (!date || !date.dateString) {
    return (
      <TouchableOpacity style={styles.dayContainer}>
        <Text style={styles.solarDay}>{date?.day || ''}</Text>
      </TouchableOpacity>
    );
  }

  const lunarDate = getLunarDate(date.dateString);
  const holiday = getHolidayInfo(date.dateString);
  const isDisabled = state === 'disabled';

  return (
    <TouchableOpacity 
      style={styles.dayContainer}
      onPress={() => holiday && onHolidayPress(holiday)}
    >
      <Text style={[
        styles.solarDay,
        isDisabled && styles.disabledText
      ]}>{date.day}</Text>
      
      {holiday ? (
        <Text 
          style={[
            styles.holidayName,
            isDisabled && styles.disabledText
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {holiday.name}
        </Text>
      ) : (
        <Text style={[
          styles.lunarDay,
          isDisabled && styles.disabledText
        ]}>{lunarDate}</Text>
      )}
      
      {holiday && (
        <View style={[
          styles.holidayDot,
          { backgroundColor: holiday.type === 'traditional' ? '#FF4D4F' : 
                           holiday.type === 'international' ? '#52C41A' : 
                           '#1890FF' }
        ]} />
      )}
    </TouchableOpacity>
  );
} 