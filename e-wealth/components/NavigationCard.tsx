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
  borderColor, // unused in new design
  backgroundColor = 'rgba(255,255,255,0.08)', // lighter, semi-transparent
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
          { backgroundColor: backgroundColor }
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
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 10,
    marginBottom: 18,
    width: '47%', // two columns
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    marginHorizontal: '1.5%',
  },
  cardText: {
    color: Colors.light.text,
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
}); 