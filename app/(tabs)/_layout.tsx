import React from 'react';
import { Tabs } from 'expo-router';
import Colors from '@/constants/Colors';
import { AntDesign } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import type { ComponentProps } from 'react';

// 定义主题类型
type Theme = 'light' | 'dark';

// 定义图标属性类型
type IconProps = {
  name: ComponentProps<typeof AntDesign>['name'];
  color: string;
  size?: number;
};

// 创建类型安全的图标组件
const TabBarIcon = React.memo<IconProps>(({ name, color, size = 24 }) => {
  return React.createElement(AntDesign, {
    name,
    size,
    color,
  });
});

export default function TabLayout() {
  const theme: Theme = 'light';

  const [fontsLoaded] = useFonts({
    'SpaceMono': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'FontAwesome': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/FontAwesome.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[theme].tint,
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: '首页',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: '日历',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="calendar" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '我的',
          tabBarIcon: ({ color }: { color: string }) => (
            <TabBarIcon name="user" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}