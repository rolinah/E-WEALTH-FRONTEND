import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

export default function Badge({ label, icon }) {
  return (
    <View style={styles.badge}>
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFD600',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 4,
    alignSelf: 'flex-start',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 6,
  },
  label: {
    color: '#222',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 