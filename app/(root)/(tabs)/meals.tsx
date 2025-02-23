import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { REACT_APP_API_KEY } from '@env';

const USDA_API_KEY = REACT_APP_API_KEY; // Replace with your actual USDA API key

export default function MealsScreen() {
  const isDark = useColorScheme() === 'dark';
  const [query, setQuery] = useState('');
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    loadCachedData();
  }, []);

  // Load cached data on app start
  const loadCachedData = async () => {
    try {
      const cachedData = await AsyncStorage.getItem('cachedFoods');
      if (cachedData) {
        setFoods(JSON.parse(cachedData));
      }
    } catch (error) {
      console.error('Error loading cache:', error);
    }
  };

  const searchFood = async () => {
    if (!query.trim()) return;

    try {
      // Check if data is cached
      const cachedResult = await AsyncStorage.getItem(`food_${query.toLowerCase()}`);
      if (cachedResult) {
        setFoods(JSON.parse(cachedResult));
        return;
      }

      // Fetch from USDA API
      const response = await axios.get(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${query}&api_key=${USDA_API_KEY}`
      );
      const fetchedFoods = response.data.foods || [];

      // Save results to cache
      await AsyncStorage.setItem(`food_${query.toLowerCase()}`, JSON.stringify(fetchedFoods));
      await AsyncStorage.setItem('cachedFoods', JSON.stringify(fetchedFoods)); // Store last results

      setFoods(fetchedFoods);
    } catch (error) {
      console.error('Error fetching food data:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: isDark ? '#1a1a1a' : '#fff' }]}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for a food"
            placeholderTextColor="#666"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={searchFood} // Trigger search on enter
          />
          <TouchableOpacity onPress={searchFood}>
            <Ionicons name="barcode" size={20} color="#0066EE" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Food List */}
      <FlatList
        data={foods}
        keyExtractor={(item) => item.fdcId.toString()}
        renderItem={({ item }) => <FoodCard food={item} />}
        contentContainerStyle={styles.foodList}
      />
    </View>
  );
}

// Food Card Component
const FoodCard = ({ food }) => {
  // Get calorie info
  const calories = food.foodNutrients.find(nutrient => nutrient.nutrientName === 'Energy')?.value || 'N/A';

  // Get serving size info (if available)
  const servingSize = food.foodMeasures?.[0]?.disseminationText || "Standard serving";

  return (
    <View style={styles.card}>
      <Text style={styles.foodName}>{food.description}</Text>
      <Text style={styles.servingSize}>{servingSize}</Text>
      <Text style={styles.calories}>{calories} kcal</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  foodList: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  servingSize: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  calories: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});