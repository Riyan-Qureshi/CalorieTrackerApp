import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { useCalorieStore } from '../../../store/calorieStore';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const { dailyGoal, meals } = useCalorieStore();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const totalCalories = meals
    .filter((meal) => {
      const mealDate = new Date(meal.timestamp);
      const today = new Date();
      return (
        mealDate.getDate() === today.getDate() &&
        mealDate.getMonth() === today.getMonth() &&
        mealDate.getFullYear() === today.getFullYear()
      );
    })
    .reduce((sum, meal) => sum + meal.calories, 0);

  const remainingCalories = dailyGoal - totalCalories;

  return (
    <ScrollView className='h-full' style={[styles.container, {backgroundColor: isDark ? '#000' : '#f5f5f5'}]}>
      {/* Title */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: isDark ? '#fff' : '#000'}]}>Today</Text>
      </View>

      {/* Calorie Card */}
      <View style={[styles.calorieCard, {backgroundColor: isDark ? '#1a1a1a' : '#fff'}]}>
        <Text style={[styles.cardTitle, {color: isDark ? '#fff' : '#000'}]}>Calories</Text>
        <Text style={styles.subtitle}>Remaining = Goal - Food</Text>
        
        <View style={styles.circleContainer}>
          <View style={styles.circle}>
            <Text style={[styles.remainingCalories, {color: isDark ? '#fff' : '#000'}]}>{remainingCalories}</Text>
            <Text style={styles.remainingLabel}>Remaining</Text>
          </View>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="flag" size={20} color="#666" />
              <Text style={styles.statLabel}>Base Goal</Text>
              <Text style={[styles.statValue, {color: isDark ? '#fff' : '#000'}]}>{dailyGoal}</Text>
            </View>
            
            <View style={styles.statItem}>
              <Ionicons name="restaurant" size={20} color="#0066EE" />
              <Text style={styles.statLabel}>Food</Text>
              <Text style={[styles.statValue, {color: isDark ? '#fff' : '#000'}]}>{totalCalories}</Text>
            </View>
          </View>
        </View>

        {/* Feature Card Navigation Dot Indicator */}
        {/* <View style={styles.dotsContainer}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View> */}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  editButton: {
    fontSize: 16,
    color: '#0066EE',
  },
  calorieCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  circleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 8,
    borderColor: '#0066EE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  remainingCalories: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  remainingLabel: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ddd',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#0066EE',
  },
});