
import { Slot, Stack } from "expo-router";
import ScreenWrapper from "../../components/ScreenWrapper";



export default function HomeLayout() {

  return (
  <ScreenWrapper>
    <Slot />
  </ScreenWrapper>
)
}
