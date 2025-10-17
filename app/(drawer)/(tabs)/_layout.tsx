import React, { memo } from 'react';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { Home, User, QrCode } from 'lucide-react-native';
import { useLocalization } from "../../../context/LocalizationContext";
import { vs, fontSize, s, getTabLabel } from '../../../utils/responsive';
import { globalHeaderOptions } from '../../../constants/headerStyles';

const HomeIcon = memo(({ color }: { color: string }) => <Home size={22} color={color} />);
const QRIcon = memo(({ color }: { color: string }) => (
  <View style={{
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: color === '#1E88E5' ? 'rgba(30, 136, 229, 0.15)' : 'rgba(77, 208, 225, 0.1)',
    borderWidth: 2,
    borderColor: color,
    justifyContent: 'center',
    alignItems: 'center',
  }}>
    <QrCode size={28} color={color} strokeWidth={2.5} />
  </View>
));
const UserIcon = memo(({ color }: { color: string }) => <User size={22} color={color} />);

function TabLayout() {
  const { t } = useLocalization();

  return (
    <Tabs
      sceneContainerStyle={{ paddingBottom: 0 }} // remove bottom gap from scene
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#4DD0E1',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#DDDBCB',
          borderTopWidth: 1,
          height: vs(55),
          paddingBottom: 0, // was vs(2) → remove extra bottom space
          paddingTop: 0,
        },
        tabBarItemStyle: {
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: vs(2),
        },
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: fontSize.tiny,
          fontWeight: '600',
          textAlign: 'center',
          lineHeight: fontSize.tiny * 1.3,
          flexWrap: 'wrap',
          maxWidth: s(80),
        },
        tabBarLabelPosition: 'below-icon',
        tabBarAllowFontScaling: true,
        tabBarHideOnKeyboard: true,
        lazy: true,
        freezeOnBlur: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: getTabLabel(t('navigation.home')),
          tabBarIcon: ({ color }) => <HomeIcon color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="qr"
        options={{
          title: 'QR',
          tabBarIcon: ({ color }) => <QRIcon color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: getTabLabel(t('navigation.profile')),
          tabBarIcon: ({ color }) => <UserIcon color={color} />,
          headerShown: false,
        }}
      />

      <Tabs.Screen name="add-visitor" options={{ 
        href: null,
        headerShown: false,
        title: 'Add Visitor'
      }} />
      <Tabs.Screen name="my-visitors" options={{ 
        href: null,
        headerShown: false,
        title: 'My Visitors'
      }} />
      <Tabs.Screen name="emergency" options={{ 
        href: null,
        headerShown: false,
        title: 'Emergency'
      }} />
      <Tabs.Screen name="requests" options={{ 
        href: null,
        headerShown: false,
        title: 'Requests'
      }} />
      <Tabs.Screen name="gate" options={{ 
        href: null,
        headerShown: false,
        title: 'Gate Access'
      }} />
      <Tabs.Screen name="store" options={{ 
        href: null,
        headerShown: false,
        title: 'Store'
      }} />
      <Tabs.Screen name="facilities" options={{ 
        href: null,
        headerShown: false // Keep custom header for facilities
      }} />
      <Tabs.Screen name="community-map" options={{ 
        href: null,
        headerShown: false,
        title: 'Community Map'
      }} />
      <Tabs.Screen name="community-services" options={{ 
        href: null,
        headerShown: false,
        title: 'Community Services'
      }} />
      <Tabs.Screen name="local-connect" options={{ 
        href: null,
        headerShown: false,
        title: 'Local Connect'
      }} />
      <Tabs.Screen name="edit-profile" options={{ 
        href: null,
        headerShown: false,
        title: 'Edit Profile'
      }} />
      <Tabs.Screen name="change-password" options={{ 
        href: null,
        headerShown: false,
        title: 'Change Password'
      }} />
      <Tabs.Screen name="security" options={{ 
        href: null,
        headerShown: false,
        title: 'Security'
      }} />
      <Tabs.Screen name="elder-monitoring" options={{ 
        href: null,
        headerShown: false,
        title: 'TrustIN'
      }} />
      <Tabs.Screen name="notifications" options={{ 
        href: null,
        headerShown: false,
        title: 'Notifications'
      }} />
      <Tabs.Screen name="weather-card" options={{ href: null }} />
      <Tabs.Screen name="visitor-registration" options={{ href: null }} />
      <Tabs.Screen name="visitor-qr" options={{ href: null }} />
      <Tabs.Screen name="delivery-registration" options={{ href: null }} />
      <Tabs.Screen name="cab-registration" options={{ href: null }} />
      <Tabs.Screen name="buy-sell" options={{ href: null }} />
    </Tabs>
  );
}

export default memo(TabLayout);
