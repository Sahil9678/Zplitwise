import React from 'react'
import { Show, useUser, SignedIn, SignedOut } from '@clerk/expo';
import { useClerk } from '@clerk/expo'
import { Alert, TouchableOpacity } from 'react-native';
import { styles } from '@/assets/styles/home.styles.js';
import { COLORS } from "@/constants/color.js";
import Ionicons from '@expo/vector-icons/Ionicons';

const SignOutButton = () => {
    const { signOut } = useClerk();

    const handleSignOut = async() => {
        // try{
        //     await signOut();
        // }catch(err){
        //     console.error(JSON.stringify(err, null, 2))
        // }
        Alert.alert("Logout","Are you sure you want to logout?",[
            {text: "Cancel", style: "cancel"},
            {text: "Logout", style:"destructive", onPress: signOut },
        ]);
    };

    return (
        <Show when="signed-in">
            <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
                <Ionicons name='log-out-outline' size={22} color={COLORS.text} />
            </TouchableOpacity>
        </Show>
    )
}

export default SignOutButton;