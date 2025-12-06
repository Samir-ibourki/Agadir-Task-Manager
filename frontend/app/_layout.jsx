import { Stack } from "expo-router";
export default function Layout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)/login" />
      <Stack.Screen name="(auth)/signup" />
      <Stack.Screen name="onboarding/index" />
      <Stack.Screen name="onboarding/last" />
      <Stack.Screen name="home" />
      <Stack.Screen name="add-task" />
    </Stack>
  );
}
