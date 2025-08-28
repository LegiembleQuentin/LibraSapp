import React from "react";
import { Tabs } from "expo-router";
import Navbar from "../../components/navigation/Navbar";
import { ScanProvider, useScanContext } from "../../contexts/ScanContext";

function TabsContent() {
  const { triggerScan } = useScanContext();

  return (
    <Tabs 
      tabBar={(props) => (
        <Navbar 
          {...props} 
          onScanTrigger={triggerScan}
        />
      )} 
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="discover" />
      <Tabs.Screen name="library" />
      <Tabs.Screen name="scan" />
      <Tabs.Screen name="search" />
      <Tabs.Screen name="options" />
    </Tabs>
  );
}

export default function TabsLayout() {
  return (
    <ScanProvider>
      <TabsContent />
    </ScanProvider>
  );
}


