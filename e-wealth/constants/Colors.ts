/**
 * E-Wealth App Color Palette (Updated for Brighter Look)
 * Primary: Blue (#1A2EFF)
 * Accent: Yellow (#FFD600) 
 * Secondary: Orange (#FF9900)
 * Background: Light Gray (#F5F7FA)
 * Surface: Card Background (#FFFFFF)
 */

const primaryBlue = '#1A2EFF';
const accentYellow = '#FFD600';
const secondaryOrange = '#FF9900';
const white = '#FFFFFF';
const lightGray = '#F5F7FA'; // much lighter
const cardBackground = '#FFFFFF'; // white cards
const background = '#F5F7FA'; // very light gray background
const text = '#222B45'; // dark blue-gray for text
const errorRed = '#FF4C4C';

export const Colors = {
  light: {
    text: text,
    background: background,
    tint: primaryBlue,
    icon: primaryBlue,
    tabIconDefault: lightGray,
    tabIconSelected: accentYellow,
    primary: primaryBlue,
    secondary: secondaryOrange,
    accent: accentYellow,
    surface: cardBackground,
    error: errorRed,
  },
  dark: {
    text: white,
    background: '#101A3D',
    tint: accentYellow,
    icon: lightGray,
    tabIconDefault: lightGray,
    tabIconSelected: accentYellow,
    primary: primaryBlue,
    secondary: secondaryOrange,
    accent: accentYellow,
    surface: '#19224A',
    error: errorRed,
  },
};
