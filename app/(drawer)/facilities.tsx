import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Clock, Calendar, Info, MapPin, Users, Dumbbell, Waves, Home, Gamepad2, PartyPopper } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import GradientHeader from '../../components/GradientHeader';
import OpenDrawerButton from '../../components/OpenDrawerButton';

const { width } = Dimensions.get('window');

export default function FacilitiesPage() {
  const router = useRouter();
  
  // Facilities data with icons and categories
  const facilities = [
    {
      id: '1',
      name: 'Swimming Pool',
      shortName: 'Pool',
      description: 'Olympic-sized swimming pool with dedicated lanes for lap swimming and a separate kids area.',
      image: 'https://images.pexels.com/photos/261327/pexels-photo-261327.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '6:00 AM - 10:00 PM',
      location: 'Block A, Ground Floor',
      icon: Waves,
      color: '#0077B6',
      category: 'Sports & Fitness'
    },
    {
      id: '2',
      name: 'Gymnasium',
      shortName: 'Gym',
      description: 'Fully equipped gym with cardio machines, free weights, and strength training equipment.',
      image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '5:00 AM - 11:00 PM',
      location: 'Block B, First Floor',
      icon: Dumbbell,
      color: '#10B981',
      category: 'Sports & Fitness'
    },
    {
      id: '3',
      name: 'Clubhouse',
      shortName: 'Club',
      description: 'Spacious clubhouse for community events, parties, and gatherings.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '9:00 AM - 9:00 PM',
      location: 'Central Plaza',
      icon: Home,
      color: '#F59E0B',
      category: 'Events & Meetings'
    },
    {
      id: '4',
      name: 'Indoor Games',
      shortName: 'Games',
      description: 'Indoor games area with table tennis, billiards, chess, and carrom boards.',
      image: 'https://images.pexels.com/photos/344034/pexels-photo-344034.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '10:00 AM - 8:00 PM',
      location: 'Block C, Ground Floor',
      icon: Gamepad2,
      color: '#8B5CF6',
      category: 'Recreation'
    },
    {
      id: '5',
      name: 'Tennis Court',
      shortName: 'Tennis',
      description: 'Professional-grade tennis court with night lighting and seating area.',
      image: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '6:00 AM - 9:00 PM',
      location: 'West Side, Open Area',
      icon: Users,
      color: '#EF4444',
      category: 'Sports & Fitness'
    },
    {
      id: '6',
      name: 'Mini Party Hall',
      shortName: 'Party Hall',
      description: 'Intimate party hall perfect for birthday celebrations, small gatherings, and family events.',
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600',
      timings: '10:00 AM - 10:00 PM',
      location: 'Block D, Second Floor',
      icon: PartyPopper,
      color: '#EC4899',
      category: 'Events & Meetings'
    },
  ];

  // Separate facilities into bookable and free access
  const bookableFacilities = facilities.filter(facility => facility.id === '3' || facility.id === '6');
  const freeAccessFacilities = facilities.filter(facility => facility.id !== '3' && facility.id !== '6');

  const bookSlot = (facilityId: string, facilityName: string) => {
    console.log(`Booking slot for ${facilityName} (ID: ${facilityId})`);
    // Add booking functionality here or navigate to a booking screen
    alert(`Booking system for ${facilityName} will be available soon!`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <GradientHeader
        title="Community Facilities"
        leftAction={<OpenDrawerButton />}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionIntro}>
          Explore our premium community facilities, designed for your comfort and enjoyment.
        </Text>
        
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{facilities.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{bookableFacilities.length}</Text>
            <Text style={styles.statLabel}>Bookable</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{freeAccessFacilities.length}</Text>
            <Text style={styles.statLabel}>Free Access</Text>
          </View>
        </View>
        
        {/* Bookable Facilities Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Calendar size={20} color="#F59E0B" />
            <Text style={styles.sectionTitle}>Bookable Facilities</Text>
            <Text style={styles.sectionSubtitle}>Advance booking required</Text>
          </View>
          
          <View style={styles.facilitiesGrid}>
            {bookableFacilities.map((facility) => (
              <TouchableOpacity 
                key={facility.id} 
                style={styles.facilityCard}
                activeOpacity={0.8}
              >
                <View style={styles.facilityImageContainer}>
                  <Image 
                    source={{ uri: facility.image }} 
                    style={styles.facilityImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                  />
                  <View style={[styles.facilityIconContainer, { backgroundColor: facility.color }]}>
                    <facility.icon size={20} color="white" />
                  </View>
                  <View style={styles.bookingBadge}>
                    <Text style={styles.bookingBadgeText}>BOOKING REQUIRED</Text>
                  </View>
                </View>
                
                <View style={styles.facilityContent}>
                  <View style={styles.facilityHeader}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <Text style={styles.facilityCategory}>{facility.category}</Text>
                  </View>
                  
                  <Text style={styles.facilityDescription} numberOfLines={2}>
                    {facility.description}
                  </Text>
                  
                  <View style={styles.facilityDetails}>
                    <View style={styles.detailItem}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.detailText}>{facility.timings}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={styles.detailText}>{facility.location}</Text>
                    </View>
                  </View>
                  
                  <TouchableOpacity 
                    style={[styles.bookButton, { backgroundColor: facility.color }]}
                    onPress={() => bookSlot(facility.id, facility.name)}
                  >
                    <Calendar size={14} color="white" />
                    <Text style={styles.bookButtonText}>Book Now</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Free Access Facilities Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#10B981" />
            <Text style={styles.sectionTitle}>Free Access Facilities</Text>
            <Text style={styles.sectionSubtitle}>Available anytime during operating hours</Text>
          </View>
          
          <View style={styles.facilitiesGrid}>
            {freeAccessFacilities.map((facility) => (
              <TouchableOpacity 
                key={facility.id} 
                style={styles.facilityCard}
                activeOpacity={0.8}
              >
                <View style={styles.facilityImageContainer}>
                  <Image 
                    source={{ uri: facility.image }} 
                    style={styles.facilityImage}
                  />
                  <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.7)']}
                    style={styles.imageOverlay}
                  />
                  <View style={[styles.facilityIconContainer, { backgroundColor: facility.color }]}>
                    <facility.icon size={20} color="white" />
                  </View>
                  <View style={styles.freeAccessBadge}>
                    <Text style={styles.freeAccessBadgeText}>FREE ACCESS</Text>
                  </View>
                </View>
                
                <View style={styles.facilityContent}>
                  <View style={styles.facilityHeader}>
                    <Text style={styles.facilityName}>{facility.name}</Text>
                    <Text style={styles.facilityCategory}>{facility.category}</Text>
                  </View>
                  
                  <Text style={styles.facilityDescription} numberOfLines={2}>
                    {facility.description}
                  </Text>
                  
                  <View style={styles.facilityDetails}>
                    <View style={styles.detailItem}>
                      <Clock size={12} color="#6B7280" />
                      <Text style={styles.detailText}>{facility.timings}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <MapPin size={12} color="#6B7280" />
                      <Text style={styles.detailText}>{facility.location}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.freeAccessButton}>
                    <Users size={14} color="#10B981" />
                    <Text style={styles.freeAccessText}>Walk-in Anytime</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        
        {/* Usage Guidelines */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color="#0077B6" />
            <Text style={styles.infoTitle}>Facility Usage Guidelines</Text>
          </View>
          <View style={styles.guidelinesList}>
            <Text style={styles.guidelineItem}>• <Text style={styles.boldText}>Bookable Facilities:</Text> Clubhouse and Mini Party Hall require advance booking (24 hours minimum)</Text>
            <Text style={styles.guidelineItem}>• <Text style={styles.boldText}>Free Access Facilities:</Text> Swimming Pool, Gym, Indoor Games, and Tennis Court - walk-in anytime</Text>
            <Text style={styles.guidelineItem}>• Booking cancellations must be done 12 hours before the scheduled slot</Text>
            <Text style={styles.guidelineItem}>• Children below 12 must be accompanied by adults in all facilities</Text>
            <Text style={styles.guidelineItem}>• Please adhere to the operating timings mentioned for each facility</Text>
            <Text style={styles.guidelineItem}>• Maintain cleanliness and report any issues to maintenance staff immediately</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 15,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionIntro: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 20,
    lineHeight: 24,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0077B6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  sectionContainer: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  facilitiesGrid: {
    gap: 16,
  },
  facilityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    marginBottom: 8,
  },
  facilityImageContainer: {
    position: 'relative',
    height: 160,
  },
  facilityImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  facilityIconContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookingBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  bookingBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  freeAccessBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  freeAccessBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  facilityContent: {
    padding: 16,
  },
  facilityHeader: {
    marginBottom: 8,
  },
  facilityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 2,
  },
  facilityCategory: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    fontWeight: '500',
  },
  facilityDescription: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 12,
  },
  facilityDetails: {
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 6,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  freeAccessButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
    gap: 6,
  },
  freeAccessText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#0077B6',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  guidelinesList: {
    gap: 8,
  },
  guidelineItem: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#1F2937',
  },
});
