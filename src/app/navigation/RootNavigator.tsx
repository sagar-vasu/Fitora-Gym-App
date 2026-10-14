import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { MainTabs } from './MainTabs';
import { RootStackParamList } from './types';
import { ExerciseDetailScreen } from '../../features/exercises/screens/ExerciseDetailScreen';
const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="ExerciseDetail"
          component={ExerciseDetailScreen}
          options={{
            headerShown: true,
            title: 'Exercise details',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
