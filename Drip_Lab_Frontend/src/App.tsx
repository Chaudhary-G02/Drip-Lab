import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({ default: 'native', native: 'native' });

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center">
        {/* Our Brand Header */}
        <Text className="text-primary text-6xl font-bold italic tracking-tighter">
          DRIP LAB
        </Text>
        <Text className="text-gray-400 mt-2 font-medium tracking-widest">
          EST. 2026 | STYLIST TERMINAL
        </Text>
      </View>
    </SafeAreaView>
  );
}
