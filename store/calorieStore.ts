import { create } from 'zustand';
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

interface CalorieState {
  dailyGoal: number;
  meals: Meal[];
  isDarkMode: boolean;
  setDailyGoal: (goal: number) => void;
  addMeal: (meal: Meal) => void;
  editMeal: (id: string, meal: Meal) => void;
  deleteMeal: (id: string) => void;
  toggleDarkMode: () => void;
}

export interface Meal {
  id: string;
  name: string;
  calories: number;
  timestamp: number;
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
}

const STORAGE_KEY = 'calorie-tracker-state';

const saveToStorage = async (state: Partial<CalorieState>) => {
  if (Platform.OS === 'web') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(state));
  }
};

const loadFromStorage = async (): Promise<Partial<CalorieState> | null> => {
  try {
    let data;
    if (Platform.OS === 'web') {
      data = localStorage.getItem(STORAGE_KEY);
    } else {
      data = await SecureStore.getItemAsync(STORAGE_KEY);
    }
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

export const useCalorieStore = create<CalorieState>((set) => ({
  dailyGoal: 2000,
  meals: [],
  isDarkMode: false,
  setDailyGoal: (goal) => set({ dailyGoal: goal }),
  addMeal: (meal) =>
    set((state) => {
      const newMeals = [...state.meals, meal];
      saveToStorage({ meals: newMeals });
      return { meals: newMeals };
    }),
  editMeal: (id, updatedMeal) =>
    set((state) => {
      const newMeals = state.meals.map((meal) =>
        meal.id === id ? updatedMeal : meal
      );
      saveToStorage({ meals: newMeals });
      return { meals: newMeals };
    }),
  deleteMeal: (id) =>
    set((state) => {
      const newMeals = state.meals.filter((meal) => meal.id !== id);
      saveToStorage({ meals: newMeals });
      return { meals: newMeals };
    }),
  toggleDarkMode: () =>
    set((state) => {
      const newDarkMode = !state.isDarkMode;
      saveToStorage({ isDarkMode: newDarkMode });
      return { isDarkMode: newDarkMode };
    }),
}));

// Initialize state from storage
loadFromStorage().then((savedState) => {
  if (savedState) {
    useCalorieStore.setState(savedState);
  }
});