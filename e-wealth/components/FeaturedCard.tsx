import React, { useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, Image, View, Animated } from 'react-native';
import { Colors } from '../constants/Colors';

interface FeaturedCardProps {
  title: string;
  imageSource: any;
  onPress?: () => void;
}

export const FeaturedCard: React.FC<FeaturedCardProps> = ({
  title,
  imageSource,
  onPress,
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
        style={styles.card}
        onPress={onPress}
        activeOpacity={0.8}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        accessibilityLabel={title}
      >
        <View style={styles.imageContainer}>
          <Image source={imageSource} style={styles.image} />
        </View>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.light.surface,
    borderRadius: 16,
    marginRight: 16,
    width: 160,
    alignItems: 'center',
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  imageContainer: {
    marginBottom: 12,
  },
  image: {
    width: 120,
    height: 80,
    borderRadius: 12,
  },
  title: {
    fontWeight: '600',
    color: Colors.light.accent,
    fontSize: 14,
    textAlign: 'center',
  },
}); 