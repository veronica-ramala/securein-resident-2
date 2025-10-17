// app/(tabs)/index.tsx
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Users, Store, Heart, Bell, Watch } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Ellipse } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useLocalization } from '../../../context/LocalizationContext';
import { fontSize, s, vs, getLineHeight } from '../../../utils/responsive';
import { useEffect, useState } from 'react';
import WeatherCard from './weather-card';
import OpenDrawerButton from '../../../components/OpenDrawerButton';
import GradientHeader from '../../../components/GradientHeader';

// ---------- Custom icons ----------
const CommunityGateIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Rect x="3" y="4" width="3" height="16" />
    <Rect x="18" y="4" width="3" height="16" />
    <Path d="M6 8 L18 8" />
    <Path d="M6 12 L18 12" />
    <Path d="M6 16 L18 16" />
    <Path d="M6 4 L18 4" />
    <Path d="M6 20 L18 20" />
    <Path d="M9 4 L9 20" strokeWidth={1.5} />
    <Path d="M15 4 L15 20" strokeWidth={1.5} />
  </Svg>
);

const ShuttleRacketIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M12 20 L12 14" />
    <Ellipse cx="12" cy="8" rx="6" ry="7" />
    <Path d="M9 3 L9 13" strokeWidth={1} />
    <Path d="M12 2 L12 14" strokeWidth={1} />
    <Path d="M15 3 L15 13" strokeWidth={1} />
    <Path d="M7 5 L17 5" strokeWidth={1} />
    <Path d="M6 8 L18 8" strokeWidth={1} />
    <Path d="M7 11 L17 11" strokeWidth={1} />
    <Circle cx="18" cy="18" r="1.5" />
    <Path d="M18 16.5 L19 15 L20 15.5 L19.5 16.5 L18 16.5" fill={color} strokeWidth={1} />
  </Svg>
);

const CommunityMapIcon = ({ size = 24, color = 'currentColor', ...props }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <Path d="M3 6v15l6-3 6 3 6-3V3l-6 3-6-3-6 3" />
    <Path d="M9 3v15" strokeWidth={1.5} />
    <Path d="M15 6v15" strokeWidth={1.5} />
    <Path d="M5 10h4" strokeWidth={1.5} />
    <Path d="M15 10h4" strokeWidth={1.5} />
    <Path d="M7 14h10" strokeWidth={1.5} />
    <Circle cx="12" cy="10" r="1.5" fill={color} />
  </Svg>
);

// ---------- Screen ----------
export default function HomeScreen() {
  const router = useRouter();
  const { t } = useLocalization();

  // greeting helper
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t('features.goodMorning');
    if (hour >= 12 && hour < 18) return t('features.goodAfternoon');
    return t('features.goodEvening');
  };

  // Alerts (badge)
  const residentAlertsData = [
    { id: 1, title: t('alerts.waterShutdown'), read: false, timestamp: Date.now() - 2 * 60 * 60 * 1000 },
    { id: 2, title: t('alerts.newSecurityProtocol'), read: false, timestamp: Date.now() - 24 * 60 * 60 * 1000 },
    { id: 3, title: t('alerts.communityMeeting'), read: true, timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000 },
  ];
  const unreadCount = residentAlertsData.filter(a => !a.read).length;

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Gradient Header */}
      <GradientHeader
        title={getGreeting()}
        subtitle="John Doe"
        leftAction={<OpenDrawerButton color="#FFFFFF" />}
        rightAction={
          <TouchableOpacity
            style={styles.bellContainer}
            onPress={() => router.push('../(tabs)/notifications')}
          >
            <Bell size={22} color="#FFFFFF" />
            {unreadCount > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        }
      />

      {/* Content */}
      <ScrollView
        style={styles.modernContent}
        contentContainerStyle={styles.modernScrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.enhancedWeatherCard}>
          <WeatherCard />
        </View>

        {/* Quick Actions */}
        <View style={styles.modernQuickActionsSection}>
          <Text style={styles.modernSectionTitle}>Quick Actions</Text>

          <View style={styles.modernQuickActionsGrid}>
            <View style={styles.modernActionRow}>
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('../(tabs)/gate')}>
                <View style={styles.modernActionIconContainer}>
                  <CommunityGateIcon size={24} color="#4A90E2" />
                </View>
                <Text style={styles.modernActionLabel}>Gate Entry</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('../(tabs)/store')}>
                <View style={styles.modernActionIconContainer}>
                  <Store size={24} color="#10B981" />
                </View>
                <Text style={styles.modernActionLabel}>Store</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modernActionRow}>
              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('../(tabs)/community-map')}>
                <View style={styles.modernActionIconContainer}>
                  <CommunityMapIcon size={24} color="#F59E0B" />
                </View>
                <Text style={styles.modernActionLabel}>Community Map</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modernActionCard} onPress={() => router.push('../(tabs)/secure-band')}>
                <View style={styles.modernActionIconContainer}>
                  <Watch size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.modernActionLabel}>Secure Band</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  // Bell notification
  bellContainer: {
    position: 'relative',
    padding: s(5),
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: s(10),
    minWidth: s(18),
    height: s(18),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0077B6',
  },
  notificationBadgeText: { color: '#FFFFFF', fontSize: fontSize.tiny - 1, fontWeight: '700' },

  modernContent: { flex: 1 },
  modernScrollContent: { paddingHorizontal: s(20), paddingBottom: vs(20) },

  enhancedWeatherCard: {
    borderRadius: s(16),
    marginTop: vs(20),
    marginBottom: vs(20),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    overflow: 'hidden',
  },

  // Quick actions
  modernQuickActionsSection: { marginBottom: vs(20) },
  modernSectionTitle: { fontSize: fontSize.large, fontWeight: '700', color: '#1E293B', marginBottom: vs(16) },
  modernQuickActionsGrid: { gap: vs(12) },
  modernActionRow: { flexDirection: 'row', justifyContent: 'space-between', gap: s(12) },
  modernActionCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: s(16),
    padding: s(20),
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    minHeight: vs(90),
    justifyContent: 'center',
    gap: vs(8),
  },
  modernActionIconContainer: {
    width: s(48),
    height: s(48),
    borderRadius: s(24),
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  modernActionLabel: {
    fontSize: fontSize.small,
    fontWeight: '600',
    color: '#374151',
    textAlign: 'center',
    lineHeight: getLineHeight(fontSize.small, 1.3),
  },
});
