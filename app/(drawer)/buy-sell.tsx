import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Plus, Filter, Heart, MapPin, Clock, DollarSign, Tag, User, Phone, MessageCircle, X, Upload, ChevronDown, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { useLocalization } from '../../context/LocalizationContext';
import GradientHeader from '../../components/GradientHeader';
import OpenDrawerButton from '../../components/OpenDrawerButton';
import { useUserContext } from '../../context/UserContext';

export default function BuySellScreen() {
  const { t } = useLocalization();
  const userContext = useUserContext();
  const profileData = userContext?.profileData || {
    name: '',
    address: '',
    profilePhoto: null,
  };

  const [activeTab, setActiveTab] = useState('buy');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Modal and form states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isOtherCategory, setIsOtherCategory] = useState(false);
  
  // Form fields
  const [formImage, setFormImage] = useState<string | null>(null);
  const [formCategory, setFormCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [formItemName, setFormItemName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formFlatNo, setFormFlatNo] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formSellerName, setFormSellerName] = useState('');

  // User's listings
  const [myListings, setMyListings] = useState<any[]>([]);

  // Sample data for listings
  const sampleListings = [
    {
      id: 1,
      title: 'iPhone 13 Pro Max',
      price: 45000,
      category: 'electronics',
      image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'John Doe',
      location: 'Block A, Apt 101',
      timePosted: '2 hours ago',
      description: 'Excellent condition, barely used. All accessories included.',
      isFavorite: false,
    },
    {
      id: 2,
      title: 'Dining Table Set',
      price: 15000,
      category: 'furniture',
      image: 'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Sarah Wilson',
      location: 'Block B, Apt 205',
      timePosted: '1 day ago',
      description: '6-seater wooden dining table with chairs. Good condition.',
      isFavorite: true,
    },
    {
      id: 3,
      title: 'Mountain Bike',
      price: 8000,
      category: 'sports',
      image: 'https://images.pexels.com/photos/100582/pexels-photo-100582.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Mike Johnson',
      location: 'Block C, Apt 302',
      timePosted: '3 days ago',
      description: 'Well-maintained mountain bike, perfect for trails.',
      isFavorite: false,
    },
    {
      id: 4,
      title: 'Kids Study Desk',
      price: 3500,
      category: 'furniture',
      image: 'https://images.pexels.com/photos/667838/pexels-photo-667838.jpeg?auto=compress&cs=tinysrgb&w=300',
      seller: 'Lisa Chen',
      location: 'Block A, Apt 405',
      timePosted: '5 days ago',
      description: 'Compact study desk perfect for children. Includes chair.',
      isFavorite: false,
    },
  ];

  const categories = [
    { id: 'all', name: t('common.all'), icon: Tag },
    { id: 'electronics', name: t('buySell.electronics'), icon: DollarSign },
    { id: 'furniture', name: t('buySell.furniture'), icon: Tag },
    { id: 'sports', name: t('buySell.sports'), icon: Tag },
    { id: 'books', name: t('buySell.books'), icon: Tag },
    { id: 'clothing', name: t('buySell.clothing'), icon: Tag },
  ];

  const filteredListings = sampleListings.filter(listing => {
    const matchesSearch = listing.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || listing.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleContactSeller = (seller: string) => {
    Alert.alert(
      t('buySell.contactSeller'),
      `Would you like to contact ${seller}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: 'Call', onPress: () => Alert.alert('Calling...', `Calling ${seller}`) },
        { text: 'Message', onPress: () => Alert.alert('Messaging...', `Opening chat with ${seller}`) },
      ]
    );
  };

  // Helper function to extract flat number from address
  const extractFlatNumber = (address: string): string => {
    const match = address.match(/Unit\s+([^,]+)/i);
    return match ? match[1].trim() : '';
  };

  const handlePostItem = () => {
    // Auto-populate form with profile data
    setFormSellerName(profileData?.name || '');
    const flatNumber = profileData?.address ? extractFlatNumber(profileData.address) : '';
    setFormFlatNo(flatNumber);
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowCategoryDropdown(false);
    setIsOtherCategory(false);
    // Reset form fields
    setFormImage(null);
    setFormCategory('');
    setCustomCategory('');
    setFormItemName('');
    setFormPrice('');
    setFormFlatNo('');
    setFormDescription('');
    setFormSellerName('');
  };

  const handleSelectCategory = (category: string) => {
    if (category === 'Other') {
      setIsOtherCategory(true);
      setFormCategory('');
      setCustomCategory('');
    } else {
      setIsOtherCategory(false);
      setFormCategory(category);
      setCustomCategory('');
    }
    setShowCategoryDropdown(false);
  };

  const handleCustomCategoryChange = (text: string) => {
    setCustomCategory(text);
    setFormCategory(text);
  };

  const handleImageUpload = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Permission to access gallery is required!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setFormImage(result.assets[0].uri);
    }
  };

  const handleSubmitForm = () => {
    // Validate form
    if (!formItemName.trim()) {
      Alert.alert('Error', 'Please enter the item name');
      return;
    }
    if (!formCategory.trim()) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!formPrice.trim()) {
      Alert.alert('Error', 'Please enter the price');
      return;
    }
    if (!formFlatNo.trim()) {
      Alert.alert('Error', 'Please enter the flat number');
      return;
    }
    if (!formSellerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    // Create new listing object
    const newListing = {
      id: Date.now(), // Use timestamp as unique ID
      title: formItemName,
      price: parseFloat(formPrice),
      category: formCategory.toLowerCase(),
      image: formImage || 'https://via.placeholder.com/300x200?text=No+Image',
      seller: formSellerName,
      location: `Flat ${formFlatNo}`,
      timePosted: 'Just now',
      description: formDescription || 'No description provided',
      isFavorite: false,
    };

    // Add to my listings
    setMyListings(prevListings => [newListing, ...prevListings]);

    // Show success message
    Alert.alert(
      'Success',
      `Item posted successfully!\n\nItem: ${formItemName}\nCategory: ${formCategory}\nPrice: ₹${formPrice}\nFlat No: ${formFlatNo}`,
      [
        {
          text: 'OK',
          onPress: handleCloseModal
        }
      ]
    );
  };

  const renderListingCard = (listing: any) => (
    <View key={listing.id} style={styles.listingCard}>
      <Image source={{ uri: listing.image }} style={styles.listingImage} />
      <TouchableOpacity style={styles.favoriteButton}>
        <Heart 
          size={20} 
          color={listing.isFavorite ? '#EF4444' : '#9CA3AF'} 
          fill={listing.isFavorite ? '#EF4444' : 'none'}
        />
      </TouchableOpacity>
      
      <View style={styles.listingContent}>
        <Text style={styles.listingTitle}>{listing.title}</Text>
        <Text style={styles.listingPrice}>₹{listing.price.toLocaleString()}</Text>
        
        <View style={styles.listingMeta}>
          <View style={styles.metaItem}>
            <MapPin size={12} color="#6B7280" />
            <Text style={styles.metaText}>{listing.location}</Text>
          </View>
          <View style={styles.metaItem}>
            <Clock size={12} color="#6B7280" />
            <Text style={styles.metaText}>{listing.timePosted}</Text>
          </View>
        </View>
        
        <Text style={styles.listingDescription} numberOfLines={2}>
          {listing.description}
        </Text>
        
        <View style={styles.listingFooter}>
          <View style={styles.sellerInfo}>
            <User size={14} color="#6B7280" />
            <Text style={styles.sellerName}>{listing.seller}</Text>
          </View>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => handleContactSeller(listing.seller)}
          >
            <MessageCircle size={16} color="#FFFFFF" />
            <Text style={styles.contactButtonText}>{t('buySell.contact')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <GradientHeader
        title={t('buySell.title')}
        subtitle={t('buySell.marketplace')}
        leftAction={<OpenDrawerButton />}
      />

      {/* Tab Switcher */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'buy' && styles.activeTab]}
          onPress={() => setActiveTab('buy')}
        >
          <Text style={[styles.tabText, activeTab === 'buy' && styles.activeTabText]}>
            {t('buySell.buyItems')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'sell' && styles.activeTab]}
          onPress={() => setActiveTab('sell')}
        >
          <Text style={[styles.tabText, activeTab === 'sell' && styles.activeTabText]}>
            {t('buySell.sellItems')}
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'buy' ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Search size={20} color="#6B7280" />
              <TextInput
                style={styles.searchInput}
                placeholder={t('buySell.searchPlaceholder')}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity style={styles.filterButton}>
              <Filter size={20} color="#4DD0E1" />
            </TouchableOpacity>
          </View>

          {/* Categories */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  selectedCategory === category.id && styles.activeCategoryChip
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <category.icon 
                  size={16} 
                  color={selectedCategory === category.id ? '#FFFFFF' : '#6B7280'} 
                />
                <Text style={[
                  styles.categoryText,
                  selectedCategory === category.id && styles.activeCategoryText
                ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Listings */}
          <View style={styles.listingsContainer}>
            <Text style={styles.sectionTitle}>
              Available Items ({filteredListings.length})
            </Text>
            {filteredListings.map(renderListingCard)}
          </View>
        </ScrollView>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Sell Tab Content */}
          <View style={styles.sellContainer}>
            <View style={styles.postItemCard}>
              <Text style={styles.postItemDescription}>
                Sell your items to neighbors in your community
              </Text>
              <TouchableOpacity style={styles.postButton} onPress={handlePostItem}>
                <Plus size={20} color="#FFFFFF" />
                <Text style={styles.postButtonText}>Add Items</Text>
              </TouchableOpacity>
            </View>

            {/* My Listings Section */}
            <View style={styles.myListingsSection}>
              <Text style={styles.sectionTitle}>{t('buySell.myListings')}</Text>
              {myListings.length === 0 ? (
                <View style={styles.emptyState}>
                  <Tag size={48} color="#D1D5DB" />
                  <Text style={styles.emptyStateTitle}>{t('buySell.noItems')}</Text>
                  <Text style={styles.emptyStateDescription}>
                    Start selling by posting your first item
                  </Text>
                </View>
              ) : (
                <View style={styles.listingsContainer}>
                  {myListings.map(renderListingCard)}
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Add Item Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Item</Text>
              <TouchableOpacity onPress={handleCloseModal} style={styles.closeButton}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {/* Image Upload */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Add Photo</Text>
                <TouchableOpacity style={styles.imageUploadButton} onPress={handleImageUpload}>
                  {formImage ? (
                    <Image source={{ uri: formImage }} style={styles.uploadedImage} />
                  ) : (
                    <View style={styles.uploadPlaceholder}>
                      <Camera size={32} color="#9CA3AF" />
                      <Text style={styles.uploadText}>Tap to upload photo</Text>
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Item Type Dropdown */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Item Type *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
                >
                  <Text style={[styles.dropdownText, !formCategory && styles.placeholderText]}>
                    {formCategory || 'Select category'}
                  </Text>
                  <ChevronDown size={20} color="#6B7280" />
                </TouchableOpacity>
                
                {showCategoryDropdown && (
                  <View style={styles.dropdownMenu}>
                    {categories.filter(c => c.id !== 'all').map((category) => (
                      <TouchableOpacity
                        key={category.id}
                        style={styles.dropdownItem}
                        onPress={() => handleSelectCategory(category.name)}
                      >
                        <Text style={styles.dropdownItemText}>{category.name}</Text>
                      </TouchableOpacity>
                    ))}
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => handleSelectCategory('Other')}
                    >
                      <Text style={styles.dropdownItemText}>Other</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {isOtherCategory && (
                  <TextInput
                    style={[styles.input, { marginTop: 8 }]}
                    placeholder="Enter custom category"
                    value={customCategory}
                    onChangeText={handleCustomCategoryChange}
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              </View>

              {/* Item Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name of the Item *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter item name"
                  value={formItemName}
                  onChangeText={setFormItemName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Price */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Price *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter price"
                  value={formPrice}
                  onChangeText={setFormPrice}
                  keyboardType="numeric"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Flat Number */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Flat Number *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter flat number"
                  value={formFlatNo}
                  onChangeText={setFormFlatNo}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* About Item */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>About Item</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Describe your item..."
                  value={formDescription}
                  onChangeText={setFormDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Seller Name */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your name"
                  value={formSellerName}
                  onChangeText={setFormSellerName}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Submit Button */}
              <TouchableOpacity style={styles.submitButton} onPress={handleSubmitForm}>
                <Text style={styles.submitButtonText}>Post Item</Text>
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
    backgroundColor: '#F5F9FF',
  },
  header: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#E3F2FD',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: -10,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#1E88E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activeCategoryChip: {
    backgroundColor: '#1E88E5',
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeCategoryText: {
    color: '#FFFFFF',
  },
  listingsContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 16,
  },
  listingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  listingImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 8,
    borderRadius: 20,
  },
  listingContent: {
    padding: 16,
  },
  listingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 0,
    lineHeight: 22,
    textAlign: 'left',
  },
  listingPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1E88E5',
    marginTop: 0,
    marginBottom: 8,
    lineHeight: 20,
    textAlign: 'left',
  },
  listingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
  },
  listingDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  listingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  contactButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  sellContainer: {
    flex: 1,
  },
  postItemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  postItemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  postItemDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  postButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E88E5',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  postButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  myListingsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  imageUploadButton: {
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  uploadPlaceholder: {
    alignItems: 'center',
    gap: 8,
  },
  uploadText: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
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
  dropdownText: {
    fontSize: 16,
    color: '#374151',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  dropdownMenu: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#374151',
  },
  submitButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
