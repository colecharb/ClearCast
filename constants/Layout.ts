import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const margin = 10

export default {
  margin,
  borderWidth: 2,
  borderRadius: 30,
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
  gradientOverlayZIndex: 10,
};
