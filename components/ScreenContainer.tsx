import { View } from "react-native";


export default function (props: View['props']) {
  return (
    // <View>
    // {/* <HorizontalLine /> */}
    <View style={{ flex: 1 }} {...props} />
    // {/* <HorizontalLine /> */}
    // </View>
  )
}