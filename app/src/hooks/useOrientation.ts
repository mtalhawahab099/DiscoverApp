import { useState, useEffect } from 'react';
import { Dimensions } from 'react-native';
import { Orientation } from '../types/navigation';

export const useOrientation = (): Orientation => {
  const [orientation, setOrientation] = useState<Orientation>(
    getOrientation()
  );

  function getOrientation(): Orientation {
    const { width, height } = Dimensions.get('window');
    return width > height ? 'landscape' : 'portrait';
  }

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      const { width, height } = window;
      setOrientation(width > height ? 'landscape' : 'portrait');
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return orientation;
};