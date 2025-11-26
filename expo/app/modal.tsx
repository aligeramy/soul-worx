import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SoulworxColors } from '@/constants/colors';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Modal Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SoulworxColors.beige,
  },
  text: {
    fontSize: 20,
    color: SoulworxColors.textPrimary,
  },
});
