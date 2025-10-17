// Local Connect Screen - Redesigned Post Cards Layout
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Dimensions, FlatList, Animated, Vibration, Alert, Image, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Search, Phone, Home, Briefcase, ChevronLeft, MapPin, Filter, Grid3X3, List, Star, Clock, Zap, Heart, Share2, MessageCircle, ThumbsUp, Plus, X } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useUserContext } from '../../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function LocalConnectScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [viewMode, setViewMode] = useState<'feed'>('feed'); // Changed to 'feed' for Facebook-style
  const [favorites, setFavorites] = useState<Set<string>>(new Set(['1', '3', '8'])); // Sample favorites
  const [recentCalls, setRecentCalls] = useState<string[]>(['2', '5', '1']); // Sample recent calls
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'profession', 'recent', 'favorites'
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [animatedValue] = useState(new Animated.Value(0));
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set()); // Track liked posts
  const [postLikes, setPostLikes] = useState<Record<string, number>>({}); // Track like counts
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [userPosts, setUserPosts] = useState<Neighbor[]>([]); // Store user-created posts
  const router = useRouter();
  const userContext = useUserContext();
  
  // Image System Configuration with Static Placeholders
  const imageConfig = {
    // Use static placeholder images (no external URLs)
    useStaticImages: true,
    
    // Profession category images - using emoji icons as static placeholders
    professionImages: {
      'doctor': null, // Will use emoji icon
      'lawyer': null,
      'chef': null,
      'crafts': null,
      'teacher': null,
      'designer': null,
      'tailor': null
    },
    
    // Individual profile pictures - all use static placeholders with colored backgrounds
    profileImages: {
      '1': null,
      '2': null,
      '3': null,
      '4': null,
      '5': null,
      '6': null,
      '7': null,
      '8': null,
      '9': null,
      '10': null,
      '11': null,
      '12': null,
      '13': null,
      '14': null
    },
    
    // Fallback options
    enableImages: false, // Disabled external images, using static placeholders
    showFallbackInitials: true, // Show initials as static placeholder
    showFallbackIcons: true // Show emoji icons for professions
  };

  // Helper function to get profession image (returns null for static mode)
  const getProfessionImage = (professionId?: string): string | null => {
    if (!imageConfig.useStaticImages) return null;
    if (!professionId) return null;
    const key = professionId.toLowerCase();
    return (imageConfig.professionImages as Record<string, string>)[key] || null;
  };

  // Helper function to get profile image (returns null for static mode)
  const getProfileImage = (userId?: string): string | null => {
    if (!imageConfig.useStaticImages) return null;
    if (!userId) return null;
    return (imageConfig.profileImages as Record<string, string>)[userId] || null;
  };

  // Generate consistent color for each user based on their ID
  const getAvatarColor = (userId: string): string => {
    const colors = [
      '#EF4444', // Red
      '#F59E0B', // Amber
      '#10B981', // Green
      '#3B82F6', // Blue
      '#8B5CF6', // Purple
      '#EC4899', // Pink
      '#6366F1', // Indigo
      '#14B8A6', // Teal
      '#F97316', // Orange
      '#06B6D4', // Cyan
    ];
    const index = parseInt(userId) % colors.length;
    return colors[index];
  };

  // Get initials from name
  const getInitials = (name: string): string => {
    return name.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // Generate random profile picture URL based on user ID
  const getRandomProfilePicture = (userId: string, name: string): string => {
    // Using a variety of placeholder image services for diversity
    const services = [
      `https://i.pravatar.cc/300?img=${userId}`,
      `https://randomuser.me/api/portraits/${parseInt(userId) % 2 === 0 ? 'men' : 'women'}/${parseInt(userId) % 50}.jpg`,
      `https://xsgames.co/randomusers/avatar.php?g=${parseInt(userId) % 2 === 0 ? 'male' : 'female'}&id=${userId}`,
    ];
    
    // Select service based on user ID for consistency
    const serviceIndex = parseInt(userId) % services.length;
    return services[serviceIndex];
  };
  
  // Enhanced sample data for neighbors with additional fields
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
    photos: string[]; // Array of photo URLs (up to 5)
    likes: number; // Number of likes
    postTime: string; // When the post was created
  };

  const [neighbors, setNeighbors] = useState<Neighbor[]>([
    { id: '1', name: 'Dr. Rajesh Kumar', profession: 'Doctor', contactNumber: '+91 98765 43210', flatNumber: 'A-101', availability: 'Available', rating: 4.8, specialization: 'General Medicine', isOnline: true, photos: [], likes: 24, postTime: '2h ago' },
    { id: '2', name: 'Adv. Sunita Verma', profession: 'Lawyer', contactNumber: '+91 43210 98765', flatNumber: 'C-201', availability: 'Busy', rating: 4.9, specialization: 'Family Law', isOnline: false, photos: [], likes: 18, postTime: '5h ago' },
    { id: '3', name: 'Chef Rahul Mehta', profession: 'Chef', contactNumber: '+91 09876 54321', flatNumber: 'A-403', availability: 'Available', rating: 4.7, specialization: 'Indian Cuisine', isOnline: true, photos: [], likes: 42, postTime: '1d ago' },
    { id: '4', name: 'Kiran Joshi', profession: 'Crafts', contactNumber: '+91 10987 65432', flatNumber: 'C-102', availability: 'Available', rating: 4.5, specialization: 'Handmade Items', isOnline: true, photos: [], likes: 31, postTime: '3h ago' },
    { id: '5', name: 'Mrs. Neha Singh', profession: 'Teacher', contactNumber: '+91 65432 10987', flatNumber: 'A-202', availability: 'Available', rating: 4.6, specialization: 'Mathematics', isOnline: false, photos: [], likes: 15, postTime: '6h ago' },
    { id: '6', name: 'Priya Sharma', profession: 'Designer', contactNumber: '+91 87654 32109', flatNumber: 'B-205', availability: 'Available', rating: 4.8, specialization: 'Interior Design', isOnline: true, photos: [], likes: 56, postTime: '4h ago' },
    { id: '7', name: 'Amit Patel', profession: 'Tailor', contactNumber: '+91 76543 21098', flatNumber: 'C-304', availability: 'Busy', rating: 4.4, specialization: 'Custom Tailoring', isOnline: false, photos: [], likes: 12, postTime: '8h ago' },
    { id: '8', name: 'Dr. Ananya Reddy', profession: 'Doctor', contactNumber: '+91 21098 76543', flatNumber: 'B-404', availability: 'Available', rating: 4.9, specialization: 'Pediatrics', isOnline: true, photos: [], likes: 38, postTime: '2h ago' },
    { id: '9', name: 'Adv. Deepak Gupta', profession: 'Lawyer', contactNumber: '+91 32109 87654', flatNumber: 'A-305', availability: 'Available', rating: 4.7, specialization: 'Corporate Law', isOnline: true, photos: [], likes: 22, postTime: '1d ago' },
    { id: '10', name: 'Maya Crafts', profession: 'Crafts', contactNumber: '+91 54321 09876', flatNumber: 'B-103', availability: 'Available', rating: 4.3, specialization: 'Pottery', isOnline: false, photos: [], likes: 27, postTime: '5h ago' },
    { id: '11', name: 'Chef Vikram Singh', profession: 'Chef', contactNumber: '+91 98765 12345', flatNumber: 'A-501', availability: 'Available', rating: 4.6, specialization: 'Continental', isOnline: true, photos: [], likes: 45, postTime: '3h ago' },
    { id: '12', name: 'Prof. Kavita Jain', profession: 'Teacher', contactNumber: '+91 87654 23456', flatNumber: 'B-302', availability: 'Busy', rating: 4.8, specialization: 'Physics', isOnline: false, photos: [], likes: 19, postTime: '7h ago' },
    { id: '13', name: 'Ravi Designer', profession: 'Designer', contactNumber: '+91 76543 34567', flatNumber: 'C-405', availability: 'Available', rating: 4.5, specialization: 'Graphic Design', isOnline: true, photos: [], likes: 33, postTime: '4h ago' },
    { id: '14', name: 'Master Tailor Ram', profession: 'Tailor', contactNumber: '+91 65432 45678', flatNumber: 'A-203', availability: 'Available', rating: 4.7, specialization: 'Traditional Wear', isOnline: true, photos: [], likes: 28, postTime: '6h ago' },
  ]);

  // Form state for creating new post
  const [newPost, setNewPost] = useState({
    profession: '',
    specialization: '',
    availability: 'Available',
  });

  // Extract flat number from user profile address
  const extractFlatNumber = (address: string): string => {
    // Try to extract flat number from address like "Unit A-101, SecureIn Community"
    const match = address.match(/Unit\s+([A-Z]-\d+)/i) || address.match(/([A-Z]-\d+)/i);
    return match ? match[1] : 'N/A';
  };

  // Load saved posts from AsyncStorage on mount
  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const savedPosts = await AsyncStorage.getItem('localConnectPosts');
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        setNeighbors(prev => [...posts, ...prev]);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const savePosts = async (posts: Neighbor[]) => {
    try {
      await AsyncStorage.setItem('localConnectPosts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts:', error);
    }
  };

  // Create new post
  const handleCreatePost = () => {
    if (!newPost.profession || !newPost.specialization) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const profileData = userContext?.profileData;
    if (!profileData) {
      Alert.alert('Error', 'Unable to fetch profile data');
      return;
    }

    const flatNumber = extractFlatNumber(profileData.address);
    
    const post: Neighbor = {
      id: `user-${Date.now()}`,
      name: profileData.name,
      profession: newPost.profession,
      contactNumber: profileData.phone,
      flatNumber: flatNumber,
      availability: newPost.availability,
      rating: 5.0,
      specialization: newPost.specialization,
      isOnline: true,
      photos: profileData.profilePhoto ? [profileData.profilePhoto] : [],
      likes: 0,
      postTime: 'Just now',
    };

    const updatedNeighbors = [post, ...neighbors];
    setNeighbors(updatedNeighbors);
    
    // Save only user-created posts
    const userCreatedPosts = updatedNeighbors.filter(n => n.id.startsWith('user-'));
    savePosts(userCreatedPosts);

    // Reset form
    setNewPost({
      profession: '',
      specialization: '',
      availability: 'Available',
    });
    
    setShowCreatePostModal(false);
    Vibration.vibrate(50);
    Alert.alert('Success', 'Your post has been created!');
  };

  // Predefined profession categories for filter buttons
  const professions = [
    { id: 'doctor', name: 'Doctor', icon: '🏥', color: '#EF4444', description: 'Medical professionals' },
    { id: 'lawyer', name: 'Lawyer', icon: '⚖️', color: '#3B82F6', description: 'Legal experts' },
    { id: 'chef', name: 'Chef', icon: '👨‍🍳', color: '#F59E0B', description: 'Food services' },
    { id: 'crafts', name: 'Crafts', icon: '🔨', color: '#10B981', description: 'Repair & handmade' },
    { id: 'teacher', name: 'Teacher', icon: '📚', color: '#8B5CF6', description: 'Educational services' },
    { id: 'designer', name: 'Designer', icon: '🎨', color: '#EC4899', description: 'Design services' },
    { id: 'tailor', name: 'Tailor', icon: '✂️', color: '#6366F1', description: 'Clothing services' },
  ];
  
  // Get count for each profession
  const getProfessionCount = (profession: string): number => {
    return neighbors.filter(neighbor => neighbor.profession === profession).length;
  };

  // Sort options
  const sortOptions = [
    { id: 'name', title: 'Name', icon: 'Users' },
    { id: 'rating', title: 'Rating', icon: 'Star' },
    { id: 'recent', title: 'Recent Calls', icon: 'Clock' },
    { id: 'favorites', title: 'Favorites', icon: 'Heart' },
    { id: 'availability', title: 'Available Now', icon: 'Zap' },
  ];

  // Advanced filtering and sorting with useMemo for performance
  const filteredAndSortedNeighbors = useMemo(() => {
    let filtered = neighbors.filter(neighbor => {
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

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return b.rating - a.rating;
        case 'recent':
          const aRecentIndex = recentCalls.indexOf(a.id);
          const bRecentIndex = recentCalls.indexOf(b.id);
          if (aRecentIndex === -1 && bRecentIndex === -1) return 0;
          if (aRecentIndex === -1) return 1;
          if (bRecentIndex === -1) return -1;
          return aRecentIndex - bRecentIndex;
        case 'favorites':
          const aFav = favorites.has(a.id);
          const bFav = favorites.has(b.id);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return a.name.localeCompare(b.name);
        case 'availability':
          if (a.availability === 'Available' && b.availability !== 'Available') return -1;
          if (a.availability !== 'Available' && b.availability === 'Available') return 1;
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

    return filtered;
  }, [neighbors, searchQuery, selectedCategory, sortBy, favorites, recentCalls]);

  // Global search results (when searching from main screen)
  const globalSearchResults = useMemo(() => {
    if (searchQuery === '') return [];
    
    return neighbors.filter(neighbor => {
      const searchLower = searchQuery.toLowerCase();
      return (
        neighbor.name.toLowerCase().includes(searchLower) ||
        neighbor.profession.toLowerCase().includes(searchLower) ||
        neighbor.flatNumber.toLowerCase().includes(searchLower) ||
        neighbor.specialization.toLowerCase().includes(searchLower)
      );
    }).sort((a, b) => b.rating - a.rating);
  }, [neighbors, searchQuery]);

  // Enhanced animation effects
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isSearchFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isSearchFocused]);

  const handleCall = (neighbor: Neighbor) => {
    Vibration.vibrate(50); // Haptic feedback
    
    // Add to recent calls
    setRecentCalls(prev => {
      const newRecent = [neighbor.id, ...prev.filter(id => id !== neighbor.id)].slice(0, 5);
      return newRecent;
    });

    // Show confirmation with more details
    Alert.alert(
      `Call ${neighbor.name}?`,
      `${neighbor.profession} • ${neighbor.specialization}\nFlat ${neighbor.flatNumber} • ${neighbor.contactNumber}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call Now', 
          onPress: () => {
            // Here you would integrate with actual calling functionality
            Alert.alert('Calling...', `Connecting to ${neighbor.name}`);
          }
        }
      ]
    );
  };

  const toggleFavorite = (neighborId: string) => {
    Vibration.vibrate(30);
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

  // Handle post like
  const handleLike = (neighbor: Neighbor) => {
    Vibration.vibrate(20);
    setLikedPosts(prev => {
      const newLiked = new Set(prev);
      const isLiked = newLiked.has(neighbor.id);
      
      if (isLiked) {
        newLiked.delete(neighbor.id);
        setPostLikes(prevLikes => ({
          ...prevLikes,
          [neighbor.id]: (prevLikes[neighbor.id] || neighbor.likes) - 1
        }));
      } else {
        newLiked.add(neighbor.id);
        setPostLikes(prevLikes => ({
          ...prevLikes,
          [neighbor.id]: (prevLikes[neighbor.id] || neighbor.likes) + 1
        }));
      }
      return newLiked;
    });
  };

  // Handle rating
  const handleRating = (neighbor: Neighbor) => {
    Vibration.vibrate(30);
    Alert.alert(
      'Rate ' + neighbor.name,
      `Current Rating: ${neighbor.rating} ⭐\n\nWould you like to rate this professional?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Rate Now', onPress: () => Alert.alert('Rating', 'Rating feature coming soon!') }
      ]
    );
  };

  // Handle share
  const handleShare = (neighbor: Neighbor) => {
    Vibration.vibrate(30);
    Alert.alert(
      'Share Contact',
      `Share ${neighbor.name}'s contact information?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Share', 
          onPress: () => Alert.alert('Shared!', `${neighbor.name}'s contact has been shared.`)
        }
      ]
    );
  };

  const handleCategorySelect = (profession: string) => {
    Vibration.vibrate(20);
    setSelectedCategory(profession);
    setSearchQuery('');
  };

  // Removed toggleViewMode - now using feed view only

  const handleSortSelect = (sortOption: string) => {
    Vibration.vibrate(20);
    setSortBy(sortOption);
    setShowSortOptions(false);
  };

  const goBack = () => {
    if (selectedCategory) {
      setSelectedCategory('');
      setSearchQuery('');
    } else {
      // Use back navigation to avoid strict typed route strings
      router.back();
    }
  };

  // Render photo gallery based on number of photos
  const renderPhotoGallery = (photos: string[]) => {
    if (photos.length === 0) return null;

    const photoCount = photos.length;
    
    if (photoCount === 1) {
      return (
        <View style={styles.photoGallery}>
          <View style={styles.singlePhoto}>
            <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
              <Text style={styles.photoPlaceholderText}>📷</Text>
            </View>
          </View>
        </View>
      );
    } else if (photoCount === 2) {
      return (
        <View style={styles.photoGallery}>
          <View style={styles.twoPhotosRow}>
            {[0, 1].map(i => (
              <View key={i} style={styles.halfPhoto}>
                <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
                  <Text style={styles.photoPlaceholderText}>📷</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      );
    } else if (photoCount === 3) {
      return (
        <View style={styles.photoGallery}>
          <View style={styles.threePhotosLayout}>
            <View style={styles.largePhoto}>
              <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
                <Text style={styles.photoPlaceholderText}>📷</Text>
              </View>
            </View>
            <View style={styles.smallPhotosColumn}>
              {[1, 2].map(i => (
                <View key={i} style={styles.smallPhoto}>
                  <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={styles.photoPlaceholderText}>📷</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    } else if (photoCount === 4) {
      return (
        <View style={styles.photoGallery}>
          <View style={styles.fourPhotosGrid}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={styles.quarterPhoto}>
                <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
                  <Text style={styles.photoPlaceholderText}>📷</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      );
    } else {
      // 5 photos
      return (
        <View style={styles.photoGallery}>
          <View style={styles.fivePhotosLayout}>
            <View style={styles.twoPhotosRow}>
              {[0, 1].map(i => (
                <View key={i} style={styles.halfPhoto}>
                  <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={styles.photoPlaceholderText}>📷</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={styles.threePhotosRow}>
              {[2, 3, 4].map(i => (
                <View key={i} style={styles.thirdPhoto}>
                  <View style={[styles.photoPlaceholder, { backgroundColor: '#E5E7EB' }]}>
                    <Text style={styles.photoPlaceholderText}>📷</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>
      );
    }
  };

  const renderNeighborCard = ({ item }: { item: Neighbor }) => {
    const neighbor = item;
    const isFavorite = favorites.has(neighbor.id);
    const isLiked = likedPosts.has(neighbor.id);
    const currentLikes = postLikes[neighbor.id] || neighbor.likes;
    const isOnline = neighbor.isOnline;
    const isAvailable = neighbor.availability === 'Available';

    // Redesigned post card with new layout
    return (
      <View style={styles.postCard}>
        {/* 🧑‍💼 Name of the Person - Highlight clearly at the top (bold and centered) */}
        <Text style={styles.cardNameNew}>🧑‍💼 {neighbor.name}</Text>

        {/* 🏠 Flat Number / Location - Small subtext below the name for quick identity */}
        <Text style={styles.cardFlatNew}>🏠 Flat {neighbor.flatNumber}</Text>

        {/* 💼 Profession - Simple line describing what they do */}
        <Text style={styles.cardProfessionNew}>💼 {neighbor.profession}</Text>

        {/* 🌟 Specialization / Skill - A short tagline showing their key expertise */}
        <Text style={styles.cardSpecializationNew}>🌟 {neighbor.specialization}</Text>

        {/* 📸 Picture + Like & Share Section - Display their photo */}
        <View style={styles.cardPictureSection}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: getRandomProfilePicture(neighbor.id, neighbor.name) }}
              style={styles.cardAvatarImageNew}
              resizeMode="cover"
            />
            {isOnline && <View style={styles.onlineIndicatorCardNew} />}
          </View>
        </View>

        {/* 👍 Like ❤️ Share - Icons or text at the bottom */}
        <View style={styles.cardFooterNew}>
          <TouchableOpacity 
            style={styles.cardFooterButtonNew}
            onPress={() => handleLike(neighbor)}
          >
            <ThumbsUp size={22} color={isLiked ? "#3B82F6" : "#6B7280"} fill={isLiked ? "#3B82F6" : "none"} />
            <Text style={[styles.cardFooterTextNew, isLiked && styles.cardFooterTextActiveNew]}>
              👍 Like ({currentLikes})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cardFooterButtonNew}
            onPress={() => handleShare(neighbor)}
          >
            <Share2 size={22} color="#EF4444" fill="none" />
            <Text style={styles.cardFooterTextNew}>❤️ Share</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Show profession categories first (main screen)
  if (!selectedCategory) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Connect with Neighbors</Text>
          <Text style={styles.welcomeSubtitle}>Find professionals and services in your community</Text>
        </View>

        {/* Search Section */}
        <Animated.View style={[styles.searchSection, {
          borderBottomWidth: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 2],
          }),
          borderBottomColor: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: ['#E5E7EB', '#7C3AED'],
          }),
        }]}>
          <View style={styles.searchContainer}>
            <Search size={18} color="#7C3AED" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search neighbors by name, profession, or specialization..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              placeholderTextColor="#9CA3AF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>

        {/* Show search results if searching */}
        {searchQuery.length > 0 ? (
          <View style={styles.searchResultsSection}>
            <View style={styles.searchResultsHeader}>
              <Text style={styles.searchResultsTitle}>Search Results</Text>
              <Text style={styles.searchResultsCount}>
                {globalSearchResults.length} found
              </Text>
            </View>
            
            {globalSearchResults.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Users size={48} color="#D1D5DB" />
                <Text style={styles.noResultsTitle}>No neighbors found</Text>
                <Text style={styles.noResultsText}>
                  Try adjusting your search terms
                </Text>
              </View>
            ) : (
              <FlatList
                data={globalSearchResults}
                renderItem={renderNeighborCard}
                keyExtractor={(item) => item.id}
                numColumns={2}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.searchResultsContainer}
                columnWrapperStyle={styles.gridRow}
              />
            )}
          </View>
        ) : (
          <>

            {/* Categories Section with new layout */}
            <View style={styles.categoriesSection}>
              <Text style={styles.categoriesTitle}>Browse by Profession</Text>
              
              {/* Scrollable Grid Layout for Categories */}
              <ScrollView 
                style={styles.categoriesScrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.categoriesGrid}
              >
                {professions.map((profession, index) => (
                  <TouchableOpacity
                    key={profession.id}
                    style={[
                      styles.professionCard,
                      { backgroundColor: profession.color + '10' },
                      index % 2 === 0 ? styles.professionCardLeft : styles.professionCardRight
                    ]}
                    onPress={() => handleCategorySelect(profession.name)}
                  >
                    <View style={[styles.professionIconContainer, { backgroundColor: profession.color + '20' }]}>
                      <Text style={styles.professionIcon}>{profession.icon}</Text>
                    </View>
                    <View style={styles.professionCardContent}>
                      <Text style={[styles.professionCardTitle, { color: profession.color }]}>
                        {profession.name}
                      </Text>
                      <Text style={styles.professionCardDescription}>
                        {profession.description}
                      </Text>
                      <Text style={styles.professionCardCount}>
                        {getProfessionCount(profession.name)} available
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </>
        )}

        {/* Floating Action Button to Create Post */}
        <TouchableOpacity 
          style={styles.fabButton}
          onPress={() => setShowCreatePostModal(true)}
        >
          <Plus size={28} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Create Post Modal */}
        <Modal
          visible={showCreatePostModal}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowCreatePostModal(false)}
        >
          <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              {/* Modal Header */}
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Create New Post</Text>
                <TouchableOpacity onPress={() => setShowCreatePostModal(false)}>
                  <X size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
                {/* Profile Info Preview */}
                <View style={styles.profilePreview}>
                  <View style={[styles.profileAvatar, { backgroundColor: getAvatarColor('user') + '20' }]}>
                    <Text style={[styles.profileAvatarText, { color: getAvatarColor('user') }]}>
                      {getInitials(userContext?.profileData?.name || 'User')}
                    </Text>
                  </View>
                  <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{userContext?.profileData?.name || 'Your Name'}</Text>
                    <Text style={styles.profileFlat}>
                      Flat {extractFlatNumber(userContext?.profileData?.address || '')}
                    </Text>
                  </View>
                </View>

                {/* Profession Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Profession *</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.professionSelector}>
                    {professions.map((prof) => (
                      <TouchableOpacity
                        key={prof.id}
                        style={[
                          styles.professionChip,
                          newPost.profession === prof.name && styles.professionChipSelected,
                          { borderColor: prof.color }
                        ]}
                        onPress={() => setNewPost({ ...newPost, profession: prof.name })}
                      >
                        <Text style={styles.professionChipIcon}>{prof.icon}</Text>
                        <Text style={[
                          styles.professionChipText,
                          newPost.profession === prof.name && styles.professionChipTextSelected
                        ]}>
                          {prof.name}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Specialization Input */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Specialization / Skill *</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="e.g., General Medicine, Family Law, etc."
                    value={newPost.specialization}
                    onChangeText={(text) => setNewPost({ ...newPost, specialization: text })}
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                {/* Availability Selection */}
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Availability</Text>
                  <View style={styles.availabilitySelector}>
                    <TouchableOpacity
                      style={[
                        styles.availabilityOption,
                        newPost.availability === 'Available' && styles.availabilityOptionSelected
                      ]}
                      onPress={() => setNewPost({ ...newPost, availability: 'Available' })}
                    >
                      <Text style={[
                        styles.availabilityText,
                        newPost.availability === 'Available' && styles.availabilityTextSelected
                      ]}>
                        ✅ Available
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.availabilityOption,
                        newPost.availability === 'Busy' && styles.availabilityOptionSelected
                      ]}
                      onPress={() => setNewPost({ ...newPost, availability: 'Busy' })}
                    >
                      <Text style={[
                        styles.availabilityText,
                        newPost.availability === 'Busy' && styles.availabilityTextSelected
                      ]}>
                        ⏰ Busy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Info Note */}
                <View style={styles.infoNote}>
                  <Text style={styles.infoNoteText}>
                    ℹ️ Your name, phone number, and flat number will be automatically fetched from your profile.
                  </Text>
                </View>
              </ScrollView>

              {/* Modal Footer */}
              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={styles.cancelButton}
                  onPress={() => setShowCreatePostModal(false)}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.createButton}
                  onPress={handleCreatePost}
                >
                  <Text style={styles.createButtonText}>Create Post</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </SafeAreaView>
    );
  }

  // Show contacts for selected profession
  return (
    <SafeAreaView style={styles.container}>
      {/* Enhanced Header with Sort */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.sortButton} 
            onPress={() => setShowSortOptions(!showSortOptions)}
          >
            <Filter size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Sort Options Dropdown */}
      {showSortOptions && (
        <Animated.View style={[styles.sortDropdown, {
          opacity: animatedValue,
          maxHeight: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 200],
          }),
        }]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortScrollView}>
            {sortOptions.map(option => (
              <TouchableOpacity
                key={option.id}
                style={[styles.sortOption, sortBy === option.id && styles.selectedSortOption]}
                onPress={() => handleSortSelect(option.id)}
              >
                {option.icon === 'Users' && <Users size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Star' && <Star size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Clock' && <Clock size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Heart' && <Heart size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                {option.icon === 'Zap' && <Zap size={16} color={sortBy === option.id ? "#FFFFFF" : "#7C3AED"} />}
                <Text style={[styles.sortOptionText, sortBy === option.id && styles.selectedSortOptionText]}>
                  {option.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>
      )}

      {/* Enhanced Search with Animation */}
      <Animated.View style={[styles.searchSection, {
        borderBottomWidth: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 2],
        }),
        borderBottomColor: animatedValue.interpolate({
          inputRange: [0, 1],
          outputRange: ['#E5E7EB', '#7C3AED'],
        }),
      }]}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#7C3AED" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={`Search ${selectedCategory.toLowerCase()}s by name or specialization...`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </Animated.View>

      {/* Enhanced Results Section */}
      <View style={styles.resultsSection}>
        <View style={styles.resultsHeader}>
          <View>
            <Text style={styles.resultsTitle}>
              {selectedCategory} Professionals
            </Text>
            <Text style={styles.sortIndicator}>
              Sorted by {sortOptions.find(opt => opt.id === sortBy)?.title}
            </Text>
          </View>
          <View style={styles.resultsStats}>
            <Text style={styles.resultsCount}>
              {filteredAndSortedNeighbors.length} found
            </Text>
            <Text style={styles.availableCount}>
              {filteredAndSortedNeighbors.filter(n => n.availability === 'Available').length} available
            </Text>
          </View>
        </View>

        {filteredAndSortedNeighbors.length === 0 ? (
          <View style={styles.noResultsContainer}>
            <Users size={48} color="#D1D5DB" />
            <Text style={styles.noResultsTitle}>No {selectedCategory.toLowerCase()}s found</Text>
            <Text style={styles.noResultsText}>
              {searchQuery ? 'Try adjusting your search terms' : `No ${selectedCategory.toLowerCase()}s available in your area`}
            </Text>
          </View>
        ) : (
          <FlatList
            data={filteredAndSortedNeighbors}
            renderItem={renderNeighborCard}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.feedContainer}
            initialNumToRender={5}
            maxToRenderPerBatch={5}
            windowSize={5}
            removeClippedSubviews={true}
          />
        )}
      </View>

      {/* Floating Action Button to Create Post */}
      <TouchableOpacity 
        style={styles.fabButton}
        onPress={() => setShowCreatePostModal(true)}
      >
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Create Post Modal */}
      <Modal
        visible={showCreatePostModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowCreatePostModal(false)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Post</Text>
              <TouchableOpacity onPress={() => setShowCreatePostModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Profile Info Preview */}
              <View style={styles.profilePreview}>
                <View style={[styles.profileAvatar, { backgroundColor: getAvatarColor('user') + '20' }]}>
                  <Text style={[styles.profileAvatarText, { color: getAvatarColor('user') }]}>
                    {getInitials(userContext?.profileData?.name || 'User')}
                  </Text>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{userContext?.profileData?.name || 'Your Name'}</Text>
                  <Text style={styles.profileFlat}>
                    Flat {extractFlatNumber(userContext?.profileData?.address || '')}
                  </Text>
                </View>
              </View>

              {/* Profession Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Profession *</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.professionSelector}>
                  {professions.map((prof) => (
                    <TouchableOpacity
                      key={prof.id}
                      style={[
                        styles.professionChip,
                        newPost.profession === prof.name && styles.professionChipSelected,
                        { borderColor: prof.color }
                      ]}
                      onPress={() => setNewPost({ ...newPost, profession: prof.name })}
                    >
                      <Text style={styles.professionChipIcon}>{prof.icon}</Text>
                      <Text style={[
                        styles.professionChipText,
                        newPost.profession === prof.name && styles.professionChipTextSelected
                      ]}>
                        {prof.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>

              {/* Specialization Input */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Specialization / Skill *</Text>
                <TextInput
                  style={styles.formInput}
                  placeholder="e.g., General Medicine, Family Law, etc."
                  value={newPost.specialization}
                  onChangeText={(text) => setNewPost({ ...newPost, specialization: text })}
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              {/* Availability Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.formLabel}>Availability</Text>
                <View style={styles.availabilitySelector}>
                  <TouchableOpacity
                    style={[
                      styles.availabilityOption,
                      newPost.availability === 'Available' && styles.availabilityOptionSelected
                    ]}
                    onPress={() => setNewPost({ ...newPost, availability: 'Available' })}
                  >
                    <Text style={[
                      styles.availabilityText,
                      newPost.availability === 'Available' && styles.availabilityTextSelected
                    ]}>
                      ✅ Available
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.availabilityOption,
                      newPost.availability === 'Busy' && styles.availabilityOptionSelected
                    ]}
                    onPress={() => setNewPost({ ...newPost, availability: 'Busy' })}
                  >
                    <Text style={[
                      styles.availabilityText,
                      newPost.availability === 'Busy' && styles.availabilityTextSelected
                    ]}>
                      ⏰ Busy
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Info Note */}
              <View style={styles.infoNote}>
                <Text style={styles.infoNoteText}>
                  ℹ️ Your name, phone number, and flat number will be automatically fetched from your profile.
                </Text>
              </View>
            </ScrollView>

            {/* Modal Footer */}
            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => setShowCreatePostModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.createButton}
                onPress={handleCreatePost}
              >
                <Text style={styles.createButtonText}>Create Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  
  // Header
  header: {
    backgroundColor: '#7C3AED',
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  viewToggle: {
    padding: 8,
    borderRadius: 8,
  },
  
  // Enhanced Search Section
  searchSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
  },
  clearButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
  },
  clearButtonText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: 'bold',
  },
  
  // Welcome Section
  welcomeSection: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
  
  // Search Results Section
  searchResultsSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  searchResultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  searchResultsCount: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  searchResultsContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  
  // Categories Section with New Layout
  categoriesSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  categoriesTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  categoriesScrollView: {
    flex: 1,
  },
  categoriesGrid: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  professionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  professionCardLeft: {
    marginRight: 8,
  },
  professionCardRight: {
    marginLeft: 8,
  },
  professionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  professionIcon: {
    fontSize: 28,
  },
  professionImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    resizeMode: 'cover',
  },
  professionCardContent: {
    flex: 1,
  },
  professionCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 2,
  },
  professionCardDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  professionCardCount: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },

  // Sort Dropdown
  sortDropdown: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    overflow: 'hidden',
  },
  sortScrollView: {
    paddingVertical: 8,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedSortOption: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  sortOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7C3AED',
    marginLeft: 6,
  },
  selectedSortOptionText: {
    color: '#FFFFFF',
  },
  
  // Enhanced Results Section
  resultsSection: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  sortIndicator: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  resultsStats: {
    alignItems: 'flex-end',
  },
  resultsCount: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  availableCount: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 2,
  },
  
  // List Container
  listContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  
  // Enhanced Grid Cards
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: (width - 48) / 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  unavailableCard: {
    opacity: 0.7,
    backgroundColor: '#F9FAFB',
  },
  gridCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  avatarWrapper: {
    position: 'relative',
  },
  gridAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  unavailableAvatar: {
    opacity: 0.5,
  },
  gridAvatarText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  gridProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    resizeMode: 'cover',
  },
  onlineIndicatorSmall: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  favoriteButtonSmall: {
    padding: 4,
  },
  gridCardName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 4,
  },
  unavailableText: {
    color: '#9CA3AF',
  },
  gridCardSpecialization: {
    fontSize: 11,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 4,
  },
  gridCardFlat: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 6,
  },
  gridRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 8,
  },
  availableBadge: {
    backgroundColor: '#D1FAE5',
  },
  busyBadge: {
    backgroundColor: '#FEE2E2',
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: '600',
  },
  availableText: {
    color: '#065F46',
  },
  busyText: {
    color: '#991B1B',
  },
  gridCallButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    opacity: 0.6,
  },
  gridCallButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 12,
  },
  
  // Enhanced List Cards
  listCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  listCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  smallAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  smallAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    resizeMode: 'cover',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  listCardInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  listCardName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginRight: 8,
  },
  listCardProfession: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
    marginBottom: 2,
  },
  listCardSpecialization: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  listCardFlat: {
    fontSize: 12,
    color: '#6B7280',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  favoriteButton: {
    padding: 8,
    marginBottom: 8,
  },
  quickCallButton: {
    backgroundColor: '#7C3AED',
    borderRadius: 20,
    padding: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  
  // Profession Badge
  professionBadge: {
    backgroundColor: '#EDE9FE',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    alignSelf: 'center',
    marginBottom: 4,
  },
  professionBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#7C3AED',
  },
  
  // Enhanced No Results
  noResultsContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 12,
    marginBottom: 6,
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },

  // Facebook-Style Post Cards
  feedContainer: {
    padding: 0,
    paddingBottom: 40,
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    marginHorizontal: 12,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  postHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarWrapper: {
    position: 'relative',
  },
  postAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  postAvatarText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  onlineIndicatorPost: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  favoriteButtonPost: {
    padding: 8,
  },
  postHeaderInfo: {
    flex: 1,
  },
  postName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 2,
  },
  postMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  postProfession: {
    fontSize: 13,
    color: '#7C3AED',
    fontWeight: '600',
  },
  postDot: {
    fontSize: 13,
    color: '#9CA3AF',
    marginHorizontal: 4,
  },
  postSpecialization: {
    fontSize: 13,
    color: '#6B7280',
  },
  postSubMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  postFlat: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  postTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  
  // Photo Gallery Styles
  photoGallery: {
    backgroundColor: '#F3F4F6',
  },
  photoPlaceholder: {
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoPlaceholderText: {
    fontSize: 40,
  },
  singlePhoto: {
    width: '100%',
    height: 300,
  },
  twoPhotosRow: {
    flexDirection: 'row',
  },
  halfPhoto: {
    width: '50%',
    height: 250,
  },
  twoPhotosItem: {
    width: '50%',
    height: 250,
  },
  threePhotosLayout: {
    flexDirection: 'row',
    height: 300,
  },
  largePhoto: {
    width: '66.66%',
    height: 300,
  },
  smallPhotosColumn: {
    width: '33.34%',
    height: 300,
  },
  smallPhoto: {
    width: '100%',
    height: 150,
  },
  threePhotosLarge: {
    width: '66.66%',
    height: 300,
  },
  threePhotosRight: {
    width: '33.34%',
    height: 300,
  },
  threePhotosSmall: {
    width: '100%',
    height: 150,
  },
  fourPhotosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  quarterPhoto: {
    width: '50%',
    height: 200,
  },
  fourPhotosItem: {
    width: '50%',
    height: 200,
  },
  fivePhotosLayout: {
    flexDirection: 'column',
  },
  fivePhotosTopRow: {
    flexDirection: 'row',
  },
  fivePhotosTopItem: {
    width: '50%',
    height: 200,
  },
  fivePhotosBottomRow: {
    flexDirection: 'row',
  },
  threePhotosRow: {
    flexDirection: 'row',
  },
  thirdPhoto: {
    width: '33.33%',
    height: 150,
  },
  fivePhotosBottomItem: {
    width: '33.33%',
    height: 150,
  },
  
  // Post Stats and Actions
  postActions: {
    backgroundColor: '#FFFFFF',
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  postStatsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatsText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
    fontWeight: '600',
  },
  postStatsRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingBadgeText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    marginLeft: 4,
  },
  postLikesCount: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 6,
  },
  postRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  postRatingText: {
    fontSize: 13,
    color: '#92400E',
    fontWeight: '600',
    marginLeft: 4,
  },
  postActionButtons: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  postActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  postActionButtonActive: {
    backgroundColor: '#F0F9FF',
  },
  postActionButtonDisabled: {
    opacity: 0.5,
  },
  postActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  postActionTextActive: {
    color: '#3B82F6',
  },
  postActionTextGreen: {
    color: '#10B981',
  },
  postActionTextDisabled: {
    color: '#9CA3AF',
  },
  
  // Post Footer
  postFooter: {
    backgroundColor: '#FFFFFF',
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  availabilityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  availabilityDotGreen: {
    backgroundColor: '#10B981',
  },
  availabilityDotRed: {
    backgroundColor: '#EF4444',
  },
  availableDot: {
    backgroundColor: '#10B981',
  },
  busyDot: {
    backgroundColor: '#EF4444',
  },
  availabilityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  availabilityTextGreen: {
    color: '#065F46',
  },
  availabilityTextRed: {
    color: '#991B1B',
  },
  availableTextPost: {
    color: '#065F46',
  },
  busyTextPost: {
    color: '#991B1B',
  },
  availableBadgePost: {
    backgroundColor: '#F0FDF4',
  },
  busyBadgePost: {
    backgroundColor: '#FEF2F2',
  },

  // New Redesigned Card Styles
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  cardName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
  },
  favoriteButtonTop: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 4,
  },
  cardFlat: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  cardProfession: {
    fontSize: 15,
    color: '#7C3AED',
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 6,
  },
  cardSpecialization: {
    fontSize: 14,
    color: '#374151',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  cardAvatarSection: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  cardAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardAvatarText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  onlineIndicatorCard: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cardRatingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 12,
  },
  cardRatingText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    marginLeft: 6,
  },
  cardAvailabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginHorizontal: 16,
    marginVertical: 12,
    borderRadius: 8,
  },
  cardAvailableBadge: {
    backgroundColor: '#D1FAE5',
  },
  cardBusyBadge: {
    backgroundColor: '#FEE2E2',
  },
  cardAvailabilityText: {
    fontSize: 13,
    fontWeight: '600',
  },
  cardAvailableText: {
    color: '#065F46',
  },
  cardBusyText: {
    color: '#991B1B',
  },
  cardFooter: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingVertical: 8,
    paddingHorizontal: 8,
  },
  cardFooterButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  cardFooterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 6,
  },
  cardFooterTextActive: {
    color: '#3B82F6',
  },
  cardFooterTextDisabled: {
    color: '#9CA3AF',
  },

  // New Card Layout Styles
  cardNameNew: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
  },
  cardFlatNew: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  cardProfessionNew: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  cardSpecializationNew: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingBottom: 20,
    fontStyle: 'italic',
  },
  cardPictureSection: {
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  cardAvatarNew: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardAvatarTextNew: {
    fontSize: 36,
    fontWeight: 'bold',
  },
  cardAvatarImageNew: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
    backgroundColor: '#F3F4F6',
  },
  onlineIndicatorCardNew: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  cardFooterNew: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    gap: 20,
  },
  cardFooterButtonNew: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    minWidth: 120,
  },
  cardFooterTextNew: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  cardFooterTextActiveNew: {
    color: '#3B82F6',
  },

  // Floating Action Button
  fabButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: height * 0.85,
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
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  profilePreview: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 20,
  },
  profileAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  profileAvatarText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileFlat: {
    fontSize: 14,
    color: '#6B7280',
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
  professionSelector: {
    flexDirection: 'row',
  },
  professionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
    marginRight: 10,
    backgroundColor: '#FFFFFF',
  },
  professionChipSelected: {
    backgroundColor: '#EDE9FE',
  },
  professionChipIcon: {
    fontSize: 18,
    marginRight: 6,
  },
  professionChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  professionChipTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1F2937',
    backgroundColor: '#FFFFFF',
  },
  availabilitySelector: {
    flexDirection: 'row',
    gap: 12,
  },
  availabilityOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  availabilityOptionSelected: {
    borderColor: '#7C3AED',
    backgroundColor: '#EDE9FE',
  },
  availabilityText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  availabilityTextSelected: {
    color: '#7C3AED',
    fontWeight: '600',
  },
  infoNote: {
    backgroundColor: '#EFF6FF',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  infoNoteText: {
    fontSize: 13,
    color: '#1E40AF',
    lineHeight: 18,
  },
  modalFooter: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
  },
  createButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});