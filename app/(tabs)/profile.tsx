import * as React from 'react';
import { StyleSheet, TouchableOpacity, View, Alert } from 'react-native';
import { Text } from '../../components/Themed';
import { getHolidayInfo } from '../../src/utils/holidayUtil';

export default function MyScreen() {
  const generateCSV = React.useCallback(() => {
    try {
      // 生成节日数据
      const holidays = [];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);

      for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const holiday = getHolidayInfo(dateStr);
        if (holiday) {
          holidays.push({
            日期: dateStr,
            节日名称: holiday.name,
            类型: holiday.type,
            描述: holiday.description,
            适合推广: holiday.marketingAdvice?.suitable.join('、') || '',
            不适合推广: holiday.marketingAdvice?.unsuitable.join('、') || '',
            活动建议: holiday.marketingAdvice?.suggestions.join('\n') || '',
          });
        }
      }

      // 生成 CSV 内容
      const headers = ['日期', '节日名称', '类型', '描述', '适合推广', '不适合推广', '活动建议'];
      const csvContent = [
        headers.join(','),
        ...holidays.map(row => 
          headers.map(header => 
            `"${(row[header] || '').replace(/"/g, '""')}"`
          ).join(',')
        )
      ].join('\n');

      // 添加 BOM
      const BOM = '\uFEFF';
      const csvContentWithBOM = BOM + csvContent;

      // 创建 Blob 和下载链接
      const blob = new Blob([csvContentWithBOM], { type: 'text/csv;charset=utf-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = '营销日历（近一年）.csv';
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      Alert.alert('错误', '导出失败，请稍后重试');
      console.error(error);
    }
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>数据导出</Text>
        <Text style={styles.description}>
          导出未来一年的所有节日信息，包括节日描述和营销建议，生成CSV文件供下载使用。
        </Text>
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={generateCSV}
        >
          <Text style={styles.exportButtonText}>导出节日数据</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  content: {
    margin: 20,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    lineHeight: 22,
  },
  exportButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  exportButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 