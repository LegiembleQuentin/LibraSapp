import { Stack } from 'expo-router';

export default function OptionsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: 'default',
        animationDuration: 300,
        gestureEnabled: true,
        gestureDirection: 'horizontal',
      }}
    >
      <Stack.Screen name="cgu" />
      <Stack.Screen name="mentions-legales" />
    </Stack>
  );
}
