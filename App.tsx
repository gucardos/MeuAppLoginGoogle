import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, Image } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface UserInfo {
  name: string;
  email: string;
  picture: string;
}

export default function App() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '769766071168-qkhfm3ejf1qlccdf169ggk5o1l3qpp2n.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@gucardos/MeuAppLoginGoogle',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication?.accessToken}` },
      })
        .then(res => res.json())
        .then(data => setUserInfo(data));
    }
  }, [response]);

  return (
    <View style={styles.container}>
      {userInfo ? (
        <View style={styles.profile}>
          <Image source={{ uri: userInfo.picture }} style={styles.avatar} />
          <Text style={styles.name}>{userInfo.name}</Text>
          <Text>{userInfo.email}</Text>
        </View>
      ) : (
        <Button title="Entrar com Google" onPress={() => promptAsync()} disabled={!request} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  profile: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
