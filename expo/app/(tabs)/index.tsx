import { Redirect } from 'expo-router';

// Hidden tab - redirects to programs
export default function IndexScreen() {
  return <Redirect href="/(tabs)/programs" />;
}
