import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '../lib/supabase';
import { ActivityIndicator, View } from 'react-native';

const RootNavigator = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const session = await AsyncStorage.getItem('supabaseSession');
      if (session) {
        const parsedSession = JSON.parse(session);
        const { data: { user } } = await supabase.auth.setSession(parsedSession);
        setUser(user);
      }
      setLoading(false);
    };

    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN') {
          setUser(session.user);
          AsyncStorage.setItem('supabaseSession', JSON.stringify(session));
        } else {
          setUser(null);
          AsyncStorage.removeItem('supabaseSession');
        }
      }
    );

    return () => {
      authListener.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;