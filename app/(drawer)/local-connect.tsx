import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, FlatList, Alert, Image, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Search, Phone, MapPin, Star, Heart, Plus, X, Upload, Camera, ChevronDown } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GradientHeader from '../../components/GradientHeader';
import OpenDrawerButton from '../../components/OpenDrawerButton';
import { useUserContext } from '../../context/UserContext';

export default function LocalConnectScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1', '3', '8']));
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState<boolean>(false);
  const [isOtherProfession, setIsOtherProfession] = useState<boolean>(false);
  const [customProfession, setCustomProfession] = useState<string>('');
  
  // Form fields
  const [formName, setFormName] = useState<string>('');
  const [formProfession, setFormProfession] = useState<string>('');
  const [formRole, setFormRole] = useState<string>('');
  const [formFlatNo, setFormFlatNo] = useState<string>('');
  const [formImage, setFormImage] = useState<string | null>(null);
  
  const router = useRouter();
  const userContext = useUserContext();
  const profileData = userContext?.profileData || {
    name: '',
    address: '',
    profilePhoto: null,
  };
  
  // Enhanced sample data for neighbors
  type Neighbor = {
    id: string;
    name: string;
    profession: string;
    contactNumber: string;
    flatNumber: string;
    availability: string;
    rating: number;
    specialization: string;
    isOnline: boolean;
    image?: string;
  };

  const [neighbors, setNeighbors] = useState<Neighbor[]>([
    { id: '1', name: 'Dr. Rajesh Kumar', profession: 'Doctor', contactNumber: '+91 98765 43210', flatNumber: 'A-101', availability: 'Available', rating: 4.8, specialization: 'General Medicine', isOnline: true },
    { id: '2', name: 'Adv. Sunita Verma', profession: 'Lawyer', contactNumber: '+91 43210 98765', flatNumber: 'C-201', availability: 'Busy', rating: 4.9, specialization: 'Family Law', isOnline: false },
    { id: '3', name: 'Chef Rahul Mehta', profession: 'Chef', contactNumber: '+91 09876 54321', flatNumber: 'A-403', availability: 'Available', rating: 4.7, specialization: 'Indian Cuisine', isOnline: true },
    { id: '4', name: 'Kiran Joshi', profession: 'Crafts', contactNumber: '+91 10987 65432', flatNumber: 'C-102', availability: 'Available', rating: 4.5, specialization: 'Handmade Items', isOnline: true },
    { id: '5', name: 'Mrs. Neha Singh', profession: 'Teacher', contactNumber: '+91 65432 10987', flatNumber: 'A-202', availability: 'Available', rating: 4.6, specialization: 'Mathematics', isOnline: false },
    { id: '6', name: 'Priya Sharma', profession: 'Designer', contactNumber: '+91 87654 32109', flatNumber: 'B-205', availability: 'Available', rating: 4.8, specialization: 'Interior Design', isOnline: true },
    { id: '7', name: 'Amit Patel', profession: 'Tailor', contactNumber: '+91 76543 21098', flatNumber: 'C-304', availability: 'Busy', rating: 4.4, specialization: 'Custom Tailoring', isOnline: false },
    { id: '8', name: 'Dr. Ananya Reddy', profession: 'Doctor', contactNumber: '+91 21098 76543', flatNumber: 'B-404', availability: 'Available', rating: 4.9, specialization: 'Pediatrics', isOnline: true },
  ]);

  // Load saved posts from AsyncStorage on mount
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('localConnectUserPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        setNeighbors(prev => [...posts, ...prev]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const savePosts = async (userPosts: Neighbor[]) => {
    try {
      await AsyncStorage.setItem('localConnectUserPosts', JSON.stringify(userPosts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  // Predefined profession categories
  const professions = [
    { id: 'doctor', name: 'Doctor', icon: '🏥', color: '#EF4444' },
    { id: 'lawyer', name: 'Lawyer', icon: '⚖️', color: '#3B82F6' },
    { id: 'chef', name: 'Chef', icon: '👨‍🍳', color: '#F59E0B' },
    { id: 'crafts', name: 'Crafts', icon: '🔨', color: '#10B981' },
    { id: 'teacher', name: 'Teacher', icon: '📚', color: '#8B5CF6' },
    { id: 'designer', name: 'Designer', icon: '🎨', color: '#EC4899' },
    { id: 'tailor', name: 'Tailor', icon: '✂️', color: '#6366F1' },
    { id: 'other', name: 'Other', icon: '✏️', color: '#6B7280' },
  ];

  // Filter neighbors based on search and category
  const filteredNeighbors = useMemo(() => {
    return neighbors.filter(neighbor => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = searchQuery === '' || (
        neighbor.name.toLowerCase().includes(searchLower) ||
        neighbor.profession.toLowerCase().includes(searchLower) ||
        neighbor.flatNumber.toLowerCase().includes(searchLower) ||
        neighbor.specialization.toLowerCase().includes(searchLower)
      );
      const matchesCategory = selectedCategory === '' || neighbor.profession === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [neighbors, searchQuery, selectedCategory]);

  const handleCall = (neighbor: Neighbor) => {
    Alert.alert(
      `Call ${neighbor.name}?`,
      `${neighbor.profession} • ${neighbor.specialization}\nFlat ${neighbor.flatNumber} • ${neighbor.contactNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => {
            Alert.alert('Calling...', `Connecting to ${neighbor.name}`);
          }
        }
      ]
    );
  };

  const toggleFavorite = (neighborId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(neighborId)) {
        newFavorites.delete(neighborId);
      } else {
        newFavorites.add(neighborId);
      }
      return newFavorites;
    });
  };

  const handleCategorySelect = (profession: string) => {
    setSelectedCategory(profession);
    setSearchQuery('');
  };

  // Helper function to extract flat number from address
  const extractFlatNumber = (address: string): string => {
    // Address format: "Unit A-101, SecureIn Community"
    // Extract the flat number part (e.g., "A-101")
    const match = address.match(/Unit\s+([^,]+)/i);
    return match ? match[1].trim() : '';
  };

  const handleAddNew = () => {
    // Auto-populate form with profile data
    setFormName(profileData?.name || '');
    const flatNumber = profileData?.address ? extractFlatNumber(profileData.address) : '';
    setFormFlatNo(flatNumber);
    setFormImage(profileData?.profilePhoto || null);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowProfessionDropdown(false);
    setIsOtherProfession(false);
    setCustomProfession('');
    // Reset form fields
    setFormName('');
    setFormProfession('');
    setFormRole('');
    setFormFlatNo('');
    setFormImage(null);
  };

  const handleSelectProfession = (profession: string) => {
    if (profession === 'Other') {
      setIsOtherProfession(true);
      setFormProfession('');
      setCustomProfession('');
    } else {
      setIsOtherProfession(false);
      setFormProfession(profession);
      setCustomProfession('');
    }
    setShowProfessionDropdown(false);
  };

  const handleCustomProfessionChange = (text: string) => {
    setCustomProfession(text);
    setFormProfession(text);
  };

  const handleImageUpload = async () => {
    // Request permission to access media library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormImage(result.assets[0].uri);
    }
  };

  const handleSubmitForm = () => {
    // Validate form
    if (!formName.trim()) {
      Alert.alert('Error', 'Please enter the name');
      return;
    }
    if (!formProfession.trim()) {
      Alert.alert('Error', 'Please enter the profession');
      return;
    }
    if (!formFlatNo.trim()) {
      Alert.alert('Error', 'Please enter the flat number');
      return;
    }

    // Create new post
    const newContact: Neighbor = {
      id: `user-${Date.now()}`, // Use timestamp-based ID to identify user posts
      name: formName,
      profession: formProfession,
      contactNumber: '+91 00000 00000', // Default contact number
      flatNumber: formFlatNo,
      availability: 'Available',
      rating: 5.0,
      specialization: formRole || formProfession,
      isOnline: true,
      image: formImage || undefined,
    };

    // Add to neighbors list
    const updatedNeighbors = [newContact, ...neighbors];
    setNeighbors(updatedNeighbors);

    // Save only user-created posts to AsyncStorage
    const userCreatedPosts = updatedNeighbors.filter(n => n.id.startsWith('user-'));
    savePosts(userCreatedPosts);

    // Show success message and close modal
    Alert.alert(
      'Success',
      `Post created successfully!\n\nName: ${formName}\nProfession: ${formProfession}\nRole: ${formRole || 'N/A'}\nFlat No: ${formFlatNo}`,
      [
        {
          text: 'OK',
          onPress: handleCloseModal
        }
      ]
    );
  };

  const renderNeighborCard = ({ item }: { item: Neighbor }) => {
    const neighbor = item;
    const isFavorite = favorites.has(neighbor.id);
    const isAvailable = neighbor.availability === 'Available';

    return (
      <View style={styles.neighborCard}>
        <View style={styles.neighborHeader}>
          {neighbor.image && (
            <Image source={{ uri: neighbor.image }} style={styles.neighborImage} />
          )}
          <View style={styles.neighborInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.neighborName}>{neighbor.name}</Text>
              {neighbor.isOnline && <View style={styles.onlineIndicator} />}
            </View>
            <Text style={styles.neighborProfession}>{neighbor.profession}</Text>
            <Text style={styles.neighborSpecialization}>{neighbor.specialization}</Text>
          </View>
          
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => toggleFavorite(neighbor.id)}
          >
            <Heart 
              size={20} 
              color={isFavorite ? '#EF4444' : '#9CA3AF'} 
              fill={isFavorite ? '#EF4444' : 'none'}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.neighborDetails}>
          <View style={styles.detailRow}>
            <MapPin size={14} color="#6B7280" />
            <Text style={styles.detailText}>Flat {neighbor.flatNumber}</Text>
          </View>
          
          <View style={[styles.availabilityBadge, { 
            backgroundColor: isAvailable ? '#DCFCE7' : '#FEF3C7' 
          }]}>
            <Text style={[styles.availabilityText, { 
              color: isAvailable ? '#16A34A' : '#D97706' 
            }]}>
              {neighbor.availability}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.callButton, { 
            backgroundColor: isAvailable ? '#10B981' : '#9CA3AF' 
          }]}
          onPress={() => handleCall(neighbor)}
          disabled={!isAvailable}
        >
          <Phone size={16} color="white" />
          <Text style={styles.callButtonText}>Call Now</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: 0 }]} edges={['left', 'right', 'bottom']}>
      <GradientHeader
        title="Local Connect"
        leftAction={<OpenDrawerButton />}
      />
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search neighbors, professions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
        </View>
      </View>

      {/* Category Filter */}
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        
        <TouchableOpacity
          style={[styles.categoryButton, selectedCategory === '' && styles.categoryButtonActive]}
          onPress={() => setSelectedCategory('')}
        >
          <Text style={[styles.categoryButtonText, selectedCategory === '' && styles.categoryButtonTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        
        {professions.map((profession) => (
          <TouchableOpacity
            key={profession.id}
            style={[
              styles.categoryButton,
              selectedCategory === profession.name && styles.categoryButtonActive,
              { borderColor: profession.color }
            ]}
            onPress={() => handleCategorySelect(profession.name)}
          >
            <Text style={styles.categoryIcon}>{profession.icon}</Text>
            <Text style={[
              styles.categoryButtonText,
              selectedCategory === profession.name && styles.categoryButtonTextActive
            ]}>
              {profession.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {filteredNeighbors.length} {filteredNeighbors.length === 1 ? 'neighbor' : 'neighbors'} found
        </Text>
      </View>

      {/* Neighbors List */}
      <FlatList
        data={filteredNeighbors}
        renderItem={renderNeighborCard}
        keyExtractor={(item) => item.id}
        style={styles.neighborsList}
        contentContainerStyle={styles.neighborsListContent}
        showsVerticalScrollIndicator={false}
      />

      {/* Floating Plus Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleAddNew}
        activeOpacity={0.8}
      >
        <Plus size={28} color="#FFFFFF" strokeWidth={2.5} />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create Post</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {/* Image Upload Section */}
              <View style={styles.imageUploadSection}>
                <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
                  {formImage ? (
                    <Image source={{ uri: formImage }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Camera size={32} color="#9CA3AF" />
                      <Text style={styles.uploadText}>Upload Picture</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Name Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Name * (from profile)</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputReadOnly]}
                  placeholder="Enter full name"
                  value={formName}
                  onChangeText={setFormName}
                  placeholderTextColor="#9CA3AF"
                  editable={false}
                />
              </View>

              {/* Profession Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Profession *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowProfessionDropdown(!showProfessionDropdown)}
                >
                  <Text style={[styles.dropdownButtonText, !formProfession && !isOtherProfession && styles.dropdownPlaceholder]}>
                    {isOtherProfession ? (customProfession || 'Other (type below)') : (formProfession || 'Select profession')}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
                
                {showProfessionDropdown && (
                  <View style={styles.dropdownList}>
                    <ScrollView style={styles.dropdownScrollView} nestedScrollEnabled={true}>
                      {professions.map((profession) => (
                        <TouchableOpacity
                          key={profession.id}
                          style={styles.dropdownItem}
                          onPress={() => handleSelectProfession(profession.name)}
                        >
                          <Text style={styles.dropdownItemIcon}>{profession.icon}</Text>
                          <Text style={styles.dropdownItemText}>{profession.name}</Text>
                          {(formProfession === profession.name || (isOtherProfession && profession.name === 'Other')) && (
                            <Text style={styles.dropdownItemCheck}>✓</Text>
                          )}
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                )}
                
                {/* Custom Profession Input - shown when "Other" is selected */}
                {isOtherProfession && (
                  <TextInput
                    style={[styles.formInput, { marginTop: 8 }]}
                    placeholder="Enter your profession"
                    value={customProfession}
                    onChangeText={handleCustomProfessionChange}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              </View>

              {/* Role Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Role / Specialization</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., General Medicine, Family Law"
                  value={formRole}
                  onChangeText={setFormRole}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Flat Number Field */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Flat Number * (from profile)</Text>
                <TextInput
                  style={[styles.formInput, styles.formInputReadOnly]}
                  placeholder="e.g., A-101"
                  value={formFlatNo}
                  onChangeText={setFormFlatNo}
                  editable={false}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              {/* Cancel Button */}
              <TouchableOpacity style={styles.cancelButton} onPress={handleCloseModal}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 0,
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: '#FFFFFF',
    marginBottom: 0,
    marginTop: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#1F2937',
  },
categoryContainer: {
  backgroundColor: '#FFFFFF',
  borderBottomWidth: 0,
  borderBottomColor: '#E5E7EB',
  paddingVertical: 0,
  marginBottom: 0,
  flexGrow: 0, 
  flexShrink: 1,
},

  categoryContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    gap: 6,
    height: 36,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryIcon: {
    fontSize: 14,
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  resultsHeader: {
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 0,
    marginVertical: 0,
    marginTop: 0,
  },
  resultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  neighborsList: {
    flex: 1,
  },
  neighborsListContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0,
    marginTop: 0,
  },
  neighborCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  neighborHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  neighborImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    backgroundColor: '#F3F4F6',
  },
  neighborInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  neighborName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginRight: 8,
  },
  onlineIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  neighborProfession: {
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 2,
  },
  neighborSpecialization: {
    fontSize: 12,
    color: '#6B7280',
  },
  favoriteButton: {
    padding: 4,
  },
  neighborDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  availabilityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },
  callButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  imageUploadSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  imageUploadButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 60,
  },
  uploadText: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1F2937',
  },
  formInputReadOnly: {
    backgroundColor: '#E5E7EB',
    color: '#6B7280',
  },
  dropdownButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#1F2937',
  },
  dropdownPlaceholder: {
    color: '#9CA3AF',
  },
  dropdownList: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 8,
    maxHeight: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownScrollView: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemIcon: {
    fontSize: 18,
    marginRight: 12,
  },
  dropdownItemText: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  dropdownItemCheck: {
    fontSize: 18,
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 20,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});
