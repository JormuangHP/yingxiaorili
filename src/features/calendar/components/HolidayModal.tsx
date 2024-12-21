import React from 'react';
import { Modal, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { HolidayInfo } from '../../../utils/holidayUtil';
import { styles } from '../styles';

interface HolidayModalProps {
  holiday: HolidayInfo | null;
  visible: boolean;
  onClose: () => void;
}

export default function HolidayModal({ holiday, visible, onClose }: HolidayModalProps) {
  if (!holiday) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <ScrollView>
            <Text style={styles.modalTitle}>{holiday.name}</Text>
            <Text style={styles.modalDescription}>{holiday.description}</Text>
            
            {holiday.marketingAdvice && (
              <>
                <Text style={styles.sectionTitle}>营销建议</Text>
                {holiday.marketingAdvice.suggestions.map((suggestion, index) => (
                  <Text key={index} style={styles.suggestionText}>• {suggestion}</Text>
                ))}
                
                <Text style={styles.sectionTitle}>适合品类</Text>
                <Text style={styles.categoryText}>
                  {holiday.marketingAdvice.suitable.join('、')}
                </Text>
                
                <Text style={styles.sectionTitle}>不适合品类</Text>
                <Text style={styles.categoryText}>
                  {holiday.marketingAdvice.unsuitable.join('、')}
                </Text>
              </>
            )}
          </ScrollView>
          
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>关闭</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 