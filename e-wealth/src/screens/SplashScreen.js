import React, { useState } from 'react';
import { Image } from 'react-native';

const SplashScreen = () => {
  const [imgError, setImgError] = useState(false);
  const [imageUrl, setImageUrl] = useState('https://example.com/image.jpg');
  const [defaultImage, setDefaultImage] = useState('https://example.com/default-image.jpg');

  return (
    <Image
      source={imgError ? defaultImage : { uri: imageUrl }}
      onError={() => setImgError(true)}
      style={styles.image}
    />
  );
};

export default SplashScreen;
