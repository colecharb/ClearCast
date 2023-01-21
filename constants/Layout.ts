import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const margin = 16

export default {
  margin,
  borderWidth: 2,
  borderRadius: margin,
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
