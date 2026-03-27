// src/utils/screenSizes.js
import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const SCREEN_BREAKPOINTS = {
  SMALL: 380, 
  MEDIUM: 768,  
  LARGE: 768,   
};

export const getScreenSize = () => {
  if (width < SCREEN_BREAKPOINTS.SMALL) {
    return 'small';
  } else if (width < SCREEN_BREAKPOINTS.MEDIUM) {
    return 'medium';
  } else {
    return 'large';
  }
};

// Hook для використання в компонентах
export const useScreenSize = () => {
  const screenWidth = Dimensions.get('window').width;
  
  return {
    width: screenWidth,
    isSmall: screenWidth < SCREEN_BREAKPOINTS.SMALL,
    isMedium: screenWidth >= SCREEN_BREAKPOINTS.SMALL && screenWidth < SCREEN_BREAKPOINTS.MEDIUM,
    isLarge: screenWidth >= SCREEN_BREAKPOINTS.LARGE,
    size: getScreenSize(),
  };
};