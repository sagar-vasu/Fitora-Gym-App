import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  House,
  Dumbbell,
  Utensils,
  ChartNoAxesColumn,
  UserRound,
} from 'lucide-react-native';

import { MainTabParamList } from './types';
import { colors } from '../../theme';
import { TodayScreen } from '../../features/dashboard/screens/TodayScreen';
import { FeaturePlaceholder } from '../../components/ui/FeaturePlaceholder';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TrainScreen = () => (
  <FeaturePlaceholder
    title="Train"
    description="Your workout library and training plans will live here."
  />
);

const NutritionScreen = () => (
  <FeaturePlaceholder
    title="Nutrition"
    description="Food logging, nutrition and meal planning."
  />
);

const ProgressScreen = () => (
  <FeaturePlaceholder
    title="Progress"
    description="Your strength, measurements and achievements."
  />
);

const YouScreen = () => (
  <FeaturePlaceholder
    title="You"
    description="Your profile, preferences and settings."
  />
);

const icons = {
  Today: House,
  Train: Dumbbell,
  Nutrition: Utensils,
  Progress: ChartNoAxesColumn,
  You: UserRound,
};

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarHideOnKeyboard: true,

        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 64,
          paddingTop: 7,
          paddingBottom: 7,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        tabBarIcon: ({ color, size }) => {
          const Icon = icons[route.name];

          return <Icon color={color} size={size} strokeWidth={2} />;
        },
      })}
    >
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Train" component={TrainScreen} />
      <Tab.Screen name="Nutrition" component={NutritionScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
      <Tab.Screen name="You" component={YouScreen} />
    </Tab.Navigator>
  );
}
