// app/(drawer)/_layout.tsx
import React from 'react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'; // ✅ correct source
import { TouchableOpacity, Text,View ,StyleSheet } from 'react-native';
import { Home, Calendar, Wrench, ShoppingBag, LogOut, Users } from 'lucide-react-native';
import Svg, { Path, Rect, Ellipse } from 'react-native-svg';
import { useUserContext } from '../../context/UserContext';
import { useLocalization } from '../../context/LocalizationContext';
import { globalHeaderOptions } from '../../constants/headerStyles';

// Custom icon for facilities
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
  </Svg>
);

export default function DrawerGroupLayout() {
  const { isLoggedIn, logout } = useUserContext();
  const { t } = useLocalization();
  const rootState = useRootNavigationState();
  const rootReady = !!rootState?.key;
  if (!rootReady) return null; // (optional) splash/loader

  // Auth guard
  if (!isLoggedIn) {
    return <Redirect href="/login" />;
  }

  return (
    <Drawer
      initialRouteName="(tabs)"
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        drawerActiveTintColor: '#1E88E5',
        drawerInactiveTintColor: '#6B7280',
        drawerActiveBackgroundColor: 'rgba(30, 136, 229, 0.1)',
        drawerStyle: {
          backgroundColor: '#FFFFFF',
          width: 280,
        },
        drawerItemStyle: {
          marginVertical: 4,
          marginHorizontal: 12,
          borderRadius: 8,
          paddingVertical: 4,
        },
        drawerLabelStyle: {
          paddingLeft: 12,
          fontSize: 16,
          fontWeight: '600',
          marginLeft: -16,
        },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView {...props} contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1 }}>
            <DrawerItemList {...props} />

            {/* Logout pinned at bottom */}
           
<TouchableOpacity style={styles.logoutButton} onPress={logout}>
  <LogOut size={20} color="#fff" style={{ marginRight: 8 }} />
  <Text style={styles.logoutText}>Logout</Text>
</TouchableOpacity>
          </View>
        </DrawerContentScrollView>
      )}
    >
      {/* Make the whole tabs group a drawer screen */}
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: t('navigation.home'),
          drawerIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />

      {/* Events Screen */}
      <Drawer.Screen
        name="events"
        options={{
          drawerLabel: 'Events',
          drawerIcon: ({ color, size }) => <Calendar size={size} color={color} />,
          headerShown: false,
          title: 'Community Events',
        }}
      />

      {/* Services Screen */}
      <Drawer.Screen
        name="services"
        options={{
          drawerLabel: t('navigation.services') || 'Services',
          drawerIcon: ({ color, size }) => <Wrench size={size} color={color} />,
          headerShown: false,
          title: 'Community Services',
        }}
      />

      {/* Buy & Sell Screen */}
      <Drawer.Screen
        name="buy-sell"
        options={{
          drawerLabel: t('navigation.buySell') || 'Buy & Sell',
          drawerIcon: ({ color, size }) => <ShoppingBag size={size} color={color} />,
          headerShown: false,
          title: 'Buy & Sell',
        }}
      />

      {/* Facilities Booking Screen */}
      <Drawer.Screen
        name="facilities"
        options={{
          drawerLabel: 'Facilities Booking',
          drawerIcon: ({ color, size }) => <ShuttleRacketIcon size={size} color={color} />,
          headerShown: false, // Keep custom header for this screen
        }}
      />

      {/* Local Connect Screen */}
      <Drawer.Screen
        name="local-connect"
        options={{
          drawerLabel: 'Local Connect',
          drawerIcon: ({ color, size }) => <Users size={size} color={color} />,
          headerShown: false,
          title: 'Local Connect',
        }}
      />

      {/* Hide index from drawer */}
      <Drawer.Screen
        name="index"
        options={{
          drawerItemStyle: { display: 'none' },
        }}
      />
    </Drawer>
  );
}
const styles = StyleSheet.create({
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginTop: 'auto',
    marginBottom: 20,
    paddingVertical: 12,
    backgroundColor: '#ed1527ff', // 🔴 red button
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
