import { View } from "react-native";
import Svg, { Path } from "react-native-svg";

type Props = {
  size?: number;
  color?: string;
};

export default function InboxIcon({ size, color }: Props) {
  return (
    <View style={{ width: size ?? 24, height: size ?? 24 }}>
      <Svg
        fill="none"
        strokeWidth={1.2}
        stroke={color || "currentColor"}
        height="100%"
        width="100%"
        viewBox="0 0 24 24"
      >
        <Path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </Svg>
    </View>
  );
}
