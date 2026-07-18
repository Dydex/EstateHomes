import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontAwesome } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="myproperties"
        options={{
          title: 'Properties',
          tabBarIcon: ({ color }) => <FontAwesome name="building-o" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="tenants"
        options={{
          title: 'Tenants',
          tabBarIcon: ({ color }) => <FontAwesome name="users" size={22} color={color} />,
        }}
      />
    </Tabs>
  );
}
