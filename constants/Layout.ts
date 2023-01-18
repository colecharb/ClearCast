import { Dimensions } from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default {
  margin: 15,
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};
