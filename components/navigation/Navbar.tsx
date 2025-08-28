import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Image } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

const BAR_HEIGHT = 45;
const FAB_SIZE = 72;
const FAB_RING = 0;
const SIDE_MARGIN = 0;
const ROW_PADDING_H = 28;
const CENTER_EXTRA_GAP = 0;

export default function Navbar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const activeColor = theme.colors.accent;  // #FFE815
  const inactiveColor = theme.colors.white;

  const getIconName = (routeName: string) => {
    const n = routeName.toLowerCase();
    if (n.includes('discover')) return 'book-outline';
    if (n.includes('library') || n.includes('biblio')) return 'bookmarks-outline';
    if (n.includes('search') || n.includes('recher')) return 'search-outline';
    if (n.includes('scan')) return 'scan-outline';
    if (n.includes('options') || n.includes('settings')) return 'settings-outline';
    return 'ellipse-outline';
  };

  const onPress = (routeName: string, isFocused: boolean) => {
    const event = navigation.emit({ type: 'tabPress', target: routeName, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName as never);
  };

  const scanIndex = state.routes.findIndex((r) => r.name.toLowerCase().includes('scan'));
  const routesWithoutScan = state.routes.filter((_, i) => i !== scanIndex && i !== state.routes.findIndex((r) => r.name.toLowerCase().includes('book-details')));
  const middle = Math.ceil(routesWithoutScan.length / 2);
  const leftRoutes = routesWithoutScan.slice(0, middle);
  const rightRoutes = routesWithoutScan.slice(middle);

  const FAB_BOTTOM = insets.bottom + BAR_HEIGHT - FAB_SIZE / 2 + 2;

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: 0 }]}>
      {/* --- SIMPLE YELLOW GLOW --- */}
      <View
        pointerEvents="none"
        style={[
          styles.glowSimple,
          {
            height: BAR_HEIGHT + insets.bottom,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            // iOS: vrai shadow jaune
            ...(Platform.OS === 'ios'
              ? {
                  shadowColor: activeColor,
                  shadowOpacity: 0.55,
                  shadowRadius: 27,
                  shadowOffset: { width: 0, height: 10 },
                }
              : {}),
          },
        ]}
      >
        {/* Android: simulateur de shadow coloré (fade jaune -> transparent) */}
        {Platform.OS === 'android' && (
          <LinearGradient
            colors={['transparent', 'rgba(255,232,21,0.28)', 'rgba(255,232,21,0.10)', 'transparent']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.glowFill}
          />
        )}
      </View>

      {/* --- BAR --- */}
      <LinearGradient
        colors={[theme.gradient.start, theme.gradient.end]}
        style={[
          styles.bar,
          {
            height: BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.sideLeft}>
            {leftRoutes.map((route) => {
              const isFocused = state.index === state.routes.indexOf(route);
              return (
                <TouchableOpacity
                  key={route.key}
                  style={styles.tabBtn}
                  onPress={() => onPress(route.name, isFocused)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={getIconName(route.name) as any}
                    size={24}
                    color={isFocused ? activeColor : inactiveColor}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={{ width: FAB_SIZE + CENTER_EXTRA_GAP }} />

          <View style={styles.sideRight}>
            {rightRoutes.map((route) => {
              const isFocused = state.index === state.routes.indexOf(route);
              return (
                <TouchableOpacity
                  key={route.key}
                  style={styles.tabBtn}
                  onPress={() => onPress(route.name, isFocused)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons
                    name={getIconName(route.name) as any}
                    size={24}
                    color={isFocused ? activeColor : inactiveColor}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </LinearGradient>

      {/* --- FAB --- */}
      {scanIndex !== -1 && (
        <TouchableOpacity
          onPress={() => onPress(state.routes[scanIndex].name, state.index === scanIndex)}
          style={[
            styles.fab,
            {
              width: FAB_SIZE,
              height: FAB_SIZE,
              borderRadius: FAB_SIZE / 2,
              bottom: FAB_BOTTOM,
              shadowColor: '#000',
            },
          ]}
          activeOpacity={0.85}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: FAB_SIZE / 2,
              padding: FAB_RING,
              backgroundColor: 'rgba(255,255,255,0.06)',
            }}
          >
            <LinearGradient
              colors={[theme.gradient.start, theme.gradient.end]}
              style={{
                flex: 1,
                borderRadius: (FAB_SIZE - FAB_RING * 2) / 2,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: Platform.OS === 'ios' ? 0.4 : 0.8,
                borderColor: 'rgba(255,255,255,0.18)',
              }}
            >
              <Image
                source={require('../../assets/images/scan-icon.png')}
                style={{ width: 40, height: 40, resizeMode: 'contain' }}
              />
            </LinearGradient>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: SIDE_MARGIN,
    right: SIDE_MARGIN,
  },

  // --- simple yellow glow container (derrière la barre) ---
  glowSimple: {
    position: 'absolute',
    left: -8,               // léger débord = halo plus doux
    right: -8,
    bottom: -8,
    overflow: 'visible',
    // Android n’a pas de shadow coloré → on ne met rien ici,
    // le LinearGradient interne (glowFill) crée le fade.
  },
  glowFill: {
    flex: 1,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    transform: [{ scaleX: 1.04 }], // léger overscan pour un halo doux
  },

  bar: {
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowOpacity: 0.16, shadowRadius: 8, shadowOffset: { width: 0, height: -3 } },
      android: { elevation: 10 },
    }),
    boxShadow: '0px 0px 30px 0px rgba(194, 223, 250, 0.5)',

  },
  row: {
    height: BAR_HEIGHT,
    paddingHorizontal: ROW_PADDING_H,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sideRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  tabBtn: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 14,
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    //descendre legerement le fab
    transform: [{ translateY: 10 }],
    ...Platform.select({
      ios: { shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 18 },
    }),
  },
});
