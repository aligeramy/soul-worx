import { Redirect } from 'expo-router';

// Hidden tab - not used in Soulworx app
export default function ExploreScreen() {
  return <Redirect href="/(tabs)/programs" />;
}
