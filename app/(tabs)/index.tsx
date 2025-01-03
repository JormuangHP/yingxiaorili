// 修改：添加了 ComponentType 的导入和更详细的类型定义
import * as React from 'react';
import type { ComponentType } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  View as RNView,
  ScrollView,
  ViewStyle,
} from 'react-native';
import { Text, View } from '../../components/Themed';
import { getHolidayInfo, HolidayInfo } from '../../src/utils/holidayUtil';

// 新增：接口定义
interface GroupedHolidays {
  [key: string]: (HolidayInfo & { date: string })[];
}

interface ExtendedHolidayInfo extends HolidayInfo {
  date: string;
}

// 新增：组件类型定义
type ScrollViewComponentType = ComponentType<{
  style?: ViewStyle;
  children: React.ReactNode;
}>;

type TouchableOpacityComponentType = ComponentType<{
  style?: ViewStyle;
  onPress?: () => void;
  children: React.ReactNode;
}>;

type ModalComponentType = ComponentType<{
  visible: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  onRequestClose?: () => void;
  children: React.ReactNode;
}>;

// 新增：组件转换
const ScrollViewComponent = ScrollView as ScrollViewComponentType;
const TouchableOpacityComponent = TouchableOpacity as TouchableOpacityComponentType;
const ModalComponent = Modal as ModalComponentType;
const RNViewComponent = RNView as ComponentType<{ style?: ViewStyle; children: React.ReactNode }>;

export default function TabOneScreen() {
  const [selectedHoliday, setSelectedHoliday] = React.useState<HolidayInfo | null>(null);
  const [today, setToday] = React.useState('');
  const [todayHoliday, setTodayHoliday] = React.useState<HolidayInfo | null>(null);

  React.useEffect(() => {
    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString('zh-CN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    }).replace(/\//g, '-');
    setToday(formattedDate);
    const holidayInfo = getHolidayInfo(formattedDate);
    setTodayHoliday(holidayInfo);
  }, []);

  const upcomingHolidays = React.useMemo(() => {
    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);
    const results: GroupedHolidays = {};
    
    for (let d = new Date(); d <= nextMonth; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      const holiday = getHolidayInfo(dateStr);
      if (holiday) {
        const monthKey = `${d.getFullYear()}年${d.getMonth() + 1}月`;
        if (!results[monthKey]) {
          results[monthKey] = [];
        }
        if (results[monthKey].length < 10) {
          results[monthKey].push({
            ...holiday,
            date: dateStr
          });
        }
      }
    }
    
    return results;
  }, [today]);

  // 修改：使用新的组件类型
  return (
    <ScrollViewComponent style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* 今日节日提醒 */}
        <View style={styles.todayContainer}>
          <Text style={styles.todayTitle}>今日节日</Text>
          <Text style={styles.todayContent}>{today}</Text>
          {todayHoliday ? (
            <>
              <Text style={styles.holidayText}>
                {todayHoliday.name}
              </Text>
              <Text style={styles.holidayDescription}>
                {todayHoliday.description}
              </Text>
              {todayHoliday.marketingAdvice && (
                <View style={styles.todayAdviceContainer}>
                  <Text style={styles.adviceTitle}>营销建议</Text>
                  <View style={styles.adviceSection}>
                    <Text style={styles.adviceLabel}>适合推广：</Text>
                    <Text style={styles.adviceContent}>
                      {todayHoliday.marketingAdvice.suitable.join('、')}
                    </Text>
                  </View>
                  <View style={styles.adviceSection}>
                    <Text style={styles.adviceLabel}>不适合推广：</Text>
                    <Text style={styles.adviceContent}>
                      {todayHoliday.marketingAdvice.unsuitable.join('、')}
                    </Text>
                  </View>
                  <Text style={styles.adviceTitle}>活动建议</Text>
                  {todayHoliday.marketingAdvice.suggestions.map((suggestion: string, index: number) => (
                    <Text key={index} style={styles.suggestionItem}>• {suggestion}</Text>
                  ))}
                </View>
              )}
              <TouchableOpacityComponent 
                style={styles.moreButton}
                onPress={() => setSelectedHoliday(todayHoliday)}
              >
                <Text style={styles.buttonText}>查看详情</Text>
              </TouchableOpacityComponent>
            </>
          ) : (
            <Text style={styles.holidayText}>今天没有特殊节日</Text>
          )}
        </View>

        {/* 近期节日列表 */}
        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>近期节日（近30天内）</Text>
          {Object.entries(upcomingHolidays).map(([month, holidays]) => (
            <View key={month} style={styles.monthContainer}>
              <Text style={styles.monthTitle}>{month}</Text>
              {holidays.map((holiday: ExtendedHolidayInfo, index: number) => (
                <TouchableOpacityComponent 
                  key={index} 
                  style={styles.holidayItem}
                  onPress={() => setSelectedHoliday(holiday)}
                >
                  <Text>{new Date(holiday.date).getDate()}日 - {holiday.name}</Text>
                  <View style={[
                    styles.holidayDot,
                    { backgroundColor: holiday.type === 'traditional' ? '#FF4D4F' : 
                                     holiday.type === 'international' ? '#52C41A' : 
                                     '#1890FF' }
                  ]} />
                </TouchableOpacityComponent>
              ))}
            </View>
          ))}
        </View>
      </View>

      {/* 节日详情弹窗 */}
      <ModalComponent
        visible={!!selectedHoliday}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedHoliday(null)}
      >
        <RNViewComponent style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedHoliday && (
              <>
                <Text style={styles.modalTitle}>{selectedHoliday.name}</Text>
                <Text style={styles.modalDescription}>{selectedHoliday.description}</Text>
                
                {selectedHoliday.marketingAdvice && (
                  <>
                    <Text style={styles.modalSubtitle}>营销建议</Text>
                    <Text>适合推广：{selectedHoliday.marketingAdvice.suitable.join('、')}</Text>
                    <Text>不适合推广：{selectedHoliday.marketingAdvice.unsuitable.join('、')}</Text>
                    <Text style={styles.modalSubtitle}>活动建议</Text>
                    {selectedHoliday.marketingAdvice.suggestions.map((suggestion: string, index: number) => (
                      <Text key={index}>• {suggestion}</Text>
                    ))}
                  </>
                )}
                
                <TouchableOpacityComponent 
                  style={styles.closeButton}
                  onPress={() => setSelectedHoliday(null)}
                >
                  <Text style={styles.closeButtonText}>关闭</Text>
                </TouchableOpacityComponent>
              </>
            )}
          </View>
        </RNViewComponent>
      </ModalComponent>
    </ScrollViewComponent>
  );
}


const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  container: {
    padding: 20,
  },
  todayContainer: {
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 8,
  },
  todayTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  todayContent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  holidayText: {
    fontSize: 14,
    marginBottom: 5,
  },
  upcomingContainer: {
    marginBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  holidayItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center' as const,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 5,
  },
  noHolidayText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  holidayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  monthContainer: {
    marginBottom: 15,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center' as const,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxHeight: '80%',
    overflow: 'scroll',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 15,
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 5,
    alignItems: 'center' as const,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  holidayDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  todayAdviceContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  adviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  adviceSection: {
    marginBottom: 8,
  },
  adviceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  adviceContent: {
    fontSize: 14,
    color: '#333',
  },
  suggestionItem: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
    paddingLeft: 8,
  },
  moreButton: {
    marginTop: 12,
    padding: 8,
    backgroundColor: '#007AFF',
    borderRadius: 4,
    alignItems: 'center' as const,
  },
  moreButtonText: {
    color: '#fff',
    fontSize: 14,
  },
}); 