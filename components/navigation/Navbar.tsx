import React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../theme';

const BAR_HEIGHT = 60;      // plus fin
const FAB_SIZE = 60;        // bouton central
const FAB_RING = 6;         // épaisseur de l’anneau
const SIDE_MARGIN = 14;

export default function Navbar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();

  const activeColor = theme.colors.accent;
  const inactiveColor = theme.colors.white;

  const getIconName = (routeName: string) => {
    const n = routeName.toLowerCase();
    if (n.includes('discover')) return 'book-outline';
    if (n.includes('library') || n.includes('biblio')) return 'bookmarks-outline';
    if (n.includes('search') || n.includes('recher')) return 'search-outline';
    if (n.includes('options') || n.includes('settings')) return 'settings-outline';
    return 'ellipse-outline';
  };

  const onPress = (routeName: string, isFocused: boolean) => {
    const event = navigation.emit({ type: 'tabPress', target: routeName, canPreventDefault: true });
    if (!isFocused && !event.defaultPrevented) navigation.navigate(routeName as never);
  };

  // on isole l’onglet "scan" pour faire un bouton central
  const scanIndex = state.routes.findIndex((r) => r.name.toLowerCase().includes('scan'));
  const routesWithoutScan = state.routes.filter((_, i) => i !== scanIndex);
  const middle = Math.ceil(routesWithoutScan.length / 2);
  const leftRoutes = routesWithoutScan.slice(0, middle);
  const rightRoutes = routesWithoutScan.slice(middle);

  // Positionne le bouton pour que son centre tombe pile sur le bord supérieur de la barre (+ petit chevauchement)
  const FAB_BOTTOM =
    insets.bottom + BAR_HEIGHT - FAB_SIZE / 2 + 4; // 4px de chevauchement vers le haut

  return (
    <View pointerEvents="box-none" style={[styles.wrapper, { bottom: 0 }]}>
      {/* BARRE collée en bas */}
      <LinearGradient
        colors={[theme.gradient.start, theme.gradient.end]}
        style={[
          styles.bar,
          {
            height: BAR_HEIGHT + insets.bottom,
            paddingBottom: insets.bottom, // évite que les icônes soient "collées" au bas
            borderTopLeftRadius: theme.radii.pill,
            borderTopRightRadius: theme.radii.pill,
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.side}>
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
                    size={26}
                    color={isFocused ? activeColor : inactiveColor}
                  />
                </TouchableOpacity>
              );
            })}
          </View>

          {/* espace réservé au FAB (empêche le chevauchement) */}
          <View style={{ width: FAB_SIZE + 8 }} />

          <View style={styles.side}>
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
                    size={26}
                    color={isFocused ? activeColor : inactiveColor}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </LinearGradient>

      {/* Bouton central stylisé */}
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
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          activeOpacity={0.8}
        >
          {/* Anneau */}
          <LinearGradient
            colors={[theme.colors.purple, theme.colors.purple]}
            style={{
              flex: 1,
              borderRadius: FAB_SIZE / 2,
              padding: FAB_RING,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Pastille intérieure */}
            <View
              style={{
                flex: 1,
                borderRadius: (FAB_SIZE - FAB_RING * 2) / 2,
                backgroundColor: theme.colors.backgroundSecondary,
                borderWidth: Platform.OS === 'ios' ? 0.5 : 0.8,
                borderColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="scan-outline" size={28} color={theme.colors.white} />
            </View>
          </LinearGradient>
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
  bar: {
    ...Platform.select({
      ios: {
        shadowOpacity: 0.25,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: -4 },
      },
      android: { elevation: 12 },
    }),
  },
  row: {
    height: BAR_HEIGHT,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',             // <-- centre verticalement les icônes
    justifyContent: 'space-between',
  },
  side: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 26,
  },
  tabBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fab: {
    position: 'absolute',
    alignSelf: 'center',
    ...Platform.select({
      ios: { shadowOpacity: 0.35, shadowRadius: 16, shadowOffset: { width: 0, height: 8 } },
      android: { elevation: 18 },
    }),
  },
});
