import { useAuth } from '@clerk/expo'
import { Redirect, Stack } from 'expo-router'

export default function Layout() {
  const { isSignedIn, isLoaded } = useAuth()

  console.log('root _layout');

  if (!isLoaded) {
    return null
  }

  if (!isSignedIn) {
    return <Redirect href={'/sign-in'} />
  }

  return <Stack />
}