import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { Colors } from '../constants/Colors';

interface NavigationCardProps {
  title: string;
  onPress: () => void;
  borderColor: string;
  backgroundColor?: string;
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  title,
  onPress,
  borderColor,
  backgroundColor = Colors.light.surface,
}) => {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 10,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <TouchableOpacity
        style={[
          styles.card,
          { 
            borderLeftColor: borderColor,
            backgroundColor: backgroundColor
          }
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={title}
      >
        <Text style={styles.cardText}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderLeftWidth: 4,
  },
  cardText: {
    color: Colors.light.text,
    fontWeight: '600',
    fontSize: 16,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
}); 