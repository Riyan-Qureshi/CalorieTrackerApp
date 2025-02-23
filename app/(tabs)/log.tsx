import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  useColorScheme,
} from 'react-native';
import { useCalorieStore, Meal } from '../../store/calorieStore';
import { Ionicons } from '@expo/vector-icons';

type MealSection = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export default function LogScreen() {
  const { meals, addMeal, editMeal, deleteMeal } = useCalorieStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMeal, setEditingMeal] = useState<Meal | null>(null);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [selectedType, setSelectedType] = useState<MealSection>('breakfast');
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleSave = () => {
    if (!mealName || !calories) return;

    const newMeal: Meal = {
      id: editingMeal?.id || Date.now().toString(),
      name: mealName,
      calories: parseInt(calories, 10),
      timestamp: Date.now(),
      type: selectedType,
    };

    if (editingMeal) {
      editMeal(editingMeal.id, newMeal);
    } else {
      addMeal(newMeal);
    }

    setModalVisible(false);
    resetForm();
  };

  const resetForm = () => {
    setMealName('');
    setCalories('');
    setSelectedType('breakfast');
    setEditingMeal(null);
  };

  const handleEdit = (meal: Meal) => {
    setEditingMeal(meal);
    setMealName(meal.name);
    setCalories(meal.calories.toString());
    setSelectedType(meal.type);
    setModalVisible(true);
  };

  const getMealsByType = (type: MealSection) => {
    return meals.filter((meal) => meal.type === type);
  };

  const renderMealSection = (title: string, type: MealSection) => {
    const sectionMeals = getMealsByType(type);
    
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
            {title}
          </Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => {
              setSelectedType(type);
              setModalVisible(true);
            }}>
            <Ionicons name="add-circle" size={24} color="#0066EE" />
          </TouchableOpacity>
        </View>
        
        {sectionMeals.length === 0 ? (
          <Text style={[styles.emptyText, { color: isDark ? '#888' : '#666' }]}>
            No meals added yet
          </Text>
        ) : (
          sectionMeals.map((meal) => (
            <View
              key={meal.id}
              style={[
                styles.mealItem,
                { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
              ]}>
              <View style={styles.mealInfo}>
                <Text style={[styles.mealName, { color: isDark ? '#fff' : '#000' }]}>
                  {meal.name}
                </Text>
                <Text style={[styles.mealCalories, { color: isDark ? '#888' : '#666' }]}>
                  {meal.calories} calories
                </Text>
              </View>
              <View style={styles.mealActions}>
                <TouchableOpacity
                  onPress={() => handleEdit(meal)}
                  style={styles.actionButton}>
                  <Ionicons name="pencil" size={20} color="#0066EE" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteMeal(meal.id)}
                  style={styles.actionButton}>
                  <Ionicons name="trash" size={20} color="#dc2626" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#f5f5f5' }]}>
      <ScrollView style={styles.scrollView}>
        {renderMealSection('Breakfast', 'breakfast')}
        {renderMealSection('Lunch', 'lunch')}
        {renderMealSection('Dinner', 'dinner')}
        {renderMealSection('Snacks', 'snack')}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}>
        <View style={styles.modalContainer}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#ffffff' },
            ]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>
              {editingMeal ? 'Edit Meal' : 'Add Meal'}
            </Text>
            
            <View style={styles.mealTypeSelector}>
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealSection[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    selectedType === type && styles.selectedType,
                  ]}
                  onPress={() => setSelectedType(type)}>
                  <Text
                    style={[
                      styles.typeText,
                      selectedType === type && styles.selectedTypeText,
                    ]}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                },
              ]}
              placeholder="Meal name"
              placeholderTextColor={isDark ? '#888' : '#666'}
              value={mealName}
              onChangeText={setMealName}
            />
            
            <TextInput
              style={[
                styles.input,
                {
                  color: isDark ? '#fff' : '#000',
                  backgroundColor: isDark ? '#2a2a2a' : '#f3f4f6',
                },
              ]}
              placeholder="Calories"
              placeholderTextColor={isDark ? '#888' : '#666'}
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />
            
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => {
                  setModalVisible(false);
                  resetForm();
                }}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={handleSave}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  addButton: {
    padding: 4,
  },
  emptyText: {
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
  },
  mealItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  mealInfo: {
    flex: 1,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
  },
  mealCalories: {
    fontSize: 14,
    marginTop: 4,
  },
  mealActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mealTypeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
  },
  selectedType: {
    backgroundColor: '#0066EE',
  },
  typeText: {
    color: '#666',
    fontSize: 14,
  },
  selectedTypeText: {
    color: '#fff',
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    backgroundColor: '#dc2626',
  },
  saveButton: {
    backgroundColor: '#0066EE',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});