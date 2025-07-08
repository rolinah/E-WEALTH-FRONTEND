// Navigation Helper
// Provides easy navigation methods for the app

export const NavigationHelper = {
  // Authentication
  goToLogin: (navigation) => navigation.navigate('auth/login'),
  goToSignUp: (navigation) => navigation.navigate('auth/signup'),
  
  // Main App
  goToHome: (navigation) => navigation.navigate('(tabs)'),
  goToProfile: (navigation) => navigation.navigate('(tabs)', { screen: 'profile' }),
  goToCommunity: (navigation) => navigation.navigate('(tabs)', { screen: 'community' }),
  goToSettings: (navigation) => navigation.navigate('(tabs)', { screen: 'settings' }),
  goToAdmin: (navigation) => navigation.navigate('(tabs)', { screen: 'admin' }),
  
  // Learning Screens
  goToInterests: (navigation) => navigation.navigate('interests'),
  goToTopicsCollection: (navigation) => navigation.navigate('topics-collection'),
  goToTopicsDashboard: (navigation) => navigation.navigate('topics-dashboard'),
  goToTopicDetails: (navigation, topic) => navigation.navigate('topic-details', { topic }),
  goToTopicList: (navigation) => navigation.navigate('topic-list'),
  goToModuleViewer: (navigation, module, topic) => 
    navigation.navigate('module-viewer', { module, topic }),
  goToQuiz: (navigation, topic) => navigation.navigate('quiz', { topic }),
  
  // Other Screens
  goToSplash: (navigation) => navigation.navigate('splash'),
  
  // Go Back
  goBack: (navigation) => navigation.goBack(),
  
  // Reset to Home
  resetToHome: (navigation) => navigation.reset({
    index: 0,
    routes: [{ name: '(tabs)' }],
  }),
};

export default NavigationHelper; 