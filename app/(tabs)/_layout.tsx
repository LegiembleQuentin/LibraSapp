import React from "react";
import { Tabs } from "expo-router";
import Navbar from "../../components/navigation/Navbar";

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <Navbar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="options" />
    </Tabs>
  );
}


