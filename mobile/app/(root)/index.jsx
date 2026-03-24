import { Show, useUser, SignedIn, SignedOut } from '@clerk/expo'
import { useClerk } from '@clerk/expo'
import React, { useState } from 'react'
import { Link, useRouter } from 'expo-router'
import { Text, View, Pressable, StyleSheet, Image, TouchableOpacity, FlatList, Alert, RefreshControl } from 'react-native'
import { useTransactions } from '../../hooks/useTransactions'
import { useEffect } from 'react'
import { styles } from '@/assets/styles/home.styles.js';
import  PageLoader from '@/components/PageLoader.jsx';
import Ionicons from '@expo/vector-icons/Ionicons';
import SignOutButton from '../../components/SignOutBtn.jsx';
import {BalanceCard} from '../../components/BalanceCard.jsx';
import {TransactionItem} from '../../components/TransactionItem.jsx';
import NoTransactionsFound from '../../components/NoTransactionsFound.jsx';

export default function Page() {
  const { user } = useUser()
  const router = useRouter();
  const { signOut } = useClerk()
  const { transactions, summary, IsLoading , loadData, deleteTransactions  } = useTransactions(user.id);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  useEffect(() => {
    loadData();
  }, [loadData])

  const handleDelete = (id) => {
    Alert.alert("Delete Transaction","Are you sure you want to delte this transaction?",[
        {text: "Cancel", style: "cancel"},
        {text: "Delete", style:"destructive", onPress: () => deleteTransactions(id) },
    ]);
  }
  
  if(IsLoading && !refreshing) return <PageLoader />

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/*Header*/}
        <View style={styles.header}>
          {/*Left*/}
          <View style={styles.headerLeft}>
            <Image 
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode='contain'
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {/*username@email.com*/}
                {user?.emailAddresses[0]?.emailAddress.split('@')[0]}
              </Text>
            </View>
          </View>
          {/*Right*/}
          <View style={styles.headerRight}>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create')}>
                <Ionicons name='add' size={20} color="#fff" />
                <Text style={styles.addButtonText} >Add</Text>
              </TouchableOpacity>
              <SignOutButton />
           </View>
        </View>
        <BalanceCard summary={summary} />
        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
      </View>
      {/* Flat list renders item lazily and used for rendering long list */}
      <FlatList 
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transactions}
        renderItem={({item}) =>  (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound />}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </View>
  )
}

 {/* <Text style={styles.title}>Welcome!</Text>
      <Show when="signed-out">
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </Show>
      <Show when="signed-in">
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <Pressable style={styles.button} onPress={() => signOut()}>
          <Text style={styles.buttonText}>Sign out</Text>
        </Pressable>
      </Show> */}