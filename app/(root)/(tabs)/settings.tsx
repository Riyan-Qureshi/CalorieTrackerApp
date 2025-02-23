import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import { useCalorieStore } from '../../../store/calorieStore';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen() {
  const { dailyGoal, setDailyGoal, isDarkMode, toggleDarkMode } =
    useCalorieStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000000' : '#f3f4f6' },
      ]}>
      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          Daily Calorie Goal
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              color: isDark ? '#ffffff' : '#000000',
              backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
            },
          ]}
          value={dailyGoal.toString()}
          onChangeText={(text) => setDailyGoal(parseInt(text) || 0)}
          keyboardType="numeric"
          placeholder="Enter daily calorie goal"
          placeholderTextColor={isDark ? '#888888' : '#666666'}
        />
      </View>

      <View
        style={[
          styles.section,
          { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
        ]}>
        <Text
          style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>
          App Settings
        </Text>
        <TouchableOpacity style={styles.settingItem} onPress={toggleDarkMode}>
          <View style={styles.settingContent}>
            <Ionicons
              name={isDarkMode ? 'moon' : 'sunny'}
              size={24}
              color={isDark ? '#ffffff' : '#000000'}
            />
            <Text
              style={[
                styles.settingText,
                { color: isDark ? '#ffffff' : '#000000' },
              ]}>
              Dark Mode
            </Text>
          </View>
          <View
            style={[
              styles.toggle,
              { backgroundColor: isDarkMode ? '#2563eb' : '#d1d5db' },
            ]}>
            <View
              style={[
                styles.toggleKnob,
                {
                  transform: [
                    {
                      translateX: isDarkMode ? 20 : 0,
                    },
                  ],
                },
              ]}
            />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    marginLeft: 12,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  toggleKnob: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
});