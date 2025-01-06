import React from 'react';
import type { ComponentType } from 'react';
import { Modal, View as RNView, Text, TouchableOpacity, ScrollView, ViewStyle } from 'react-native';
import { HolidayInfo } from '../../../utils/holidayUtil';
import { styles } from '../styles';

// 组件类型定义
type ModalComponentType = ComponentType<{
  visible: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  onRequestClose?: () => void;
  children: React.ReactNode;
}>;

type ViewComponentType = ComponentType<{
  style?: ViewStyle;
  children: React.ReactNode;
}>;

type ScrollViewComponentType = ComponentType<{
  style?: ViewStyle;
  children: React.ReactNode;
}>;

type TouchableOpacityComponentType = ComponentType<{
  style?: ViewStyle;
  onPress?: () => void;
  children: React.ReactNode;
}>;

type TextComponentType = ComponentType<{
  style?: ViewStyle;
  children: React.ReactNode;
}>;

// 组件转换
const ModalComponent = Modal as ModalComponentType;
const ViewComponent = RNView as ViewComponentType;
const ScrollViewComponent = ScrollView as ScrollViewComponentType;
const TouchableOpacityComponent = TouchableOpacity as TouchableOpacityComponentType;
const TextComponent = Text as TextComponentType;

interface HolidayModalProps {
  holiday: HolidayInfo | null;
  visible: boolean;
  onClose: () => void;
}

export default function HolidayModal({ holiday, visible, onClose }: HolidayModalProps) {
  if (!holiday) return null;

  return (
    <ModalComponent
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <ViewComponent style={styles.modalContainer}>
        <ViewComponent style={styles.modalContent}>
          <ScrollViewComponent>
            <TextComponent style={styles.modalTitle}>{holiday.name}</TextComponent>
            <TextComponent style={styles.modalDescription}>{holiday.description}</TextComponent>
            
            {holiday.marketingAdvice && (
              <>
                <TextComponent style={styles.sectionTitle}>营销建议</TextComponent>
                {holiday.marketingAdvice.suggestions.map((suggestion, index) => (
                  <TextComponent key={index} style={styles.suggestionText}>• {suggestion}</TextComponent>
                ))}
                
                <TextComponent style={styles.sectionTitle}>适合品类</TextComponent>
                <TextComponent style={styles.categoryText}>
                  {holiday.marketingAdvice.suitable.join('、')}
                </TextComponent>
                
                <TextComponent style={styles.sectionTitle}>不适合品类</TextComponent>
                <TextComponent style={styles.categoryText}>
                  {holiday.marketingAdvice.unsuitable.join('、')}
                </TextComponent>
              </>
            )}
          </ScrollViewComponent>
          
          <TouchableOpacityComponent style={styles.closeButton} onPress={onClose}>
            <TextComponent style={styles.closeButtonText}>关闭</TextComponent>
          </TouchableOpacityComponent>
        </ViewComponent>
      </ViewComponent>
    </ModalComponent>
  );
}