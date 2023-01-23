import { LinearGradient } from "expo-linear-gradient";
import React from "react";


export default () => (
  <LinearGradient
    pointerEvents='none'
    colors={['rgba(0,0,0,1)', 'transparent', 'transparent', 'rgba(0,0,0,1)']}
    locations={[1 / 16, 1 / 8, 1 / 2, 1]}
    style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flex: 1, zIndex: 100 }}
  />
)