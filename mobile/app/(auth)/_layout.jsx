import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function AuthRoutesLayout() {
  const { isSignedIn, isLoaded } = useAuth()


  console.log('auth _layout');
  if (!isLoaded) {
    return null
  }

  if (isSignedIn) {
    return <Redirect href={'/'} />
  }

  return <Stack screenOptions={{ headerShown : false}} />
}