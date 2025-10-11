import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Platform } from 'react-native';
import { auth } from '../../../config/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

// Ensures auth session completes properly when app is foregrounded again
WebBrowser.maybeCompleteAuthSession();
// Client IDs (replace with your own from Google Cloud console)
// Web client must have the Expo proxy redirect added; native iOS/Android clients will be used once you build.
const WEB_CLIENT_ID = '478924932982-li069ndho7q23am800fc5jp3svomoaml.apps.googleusercontent.com';
// If you later add native builds, set these:
const IOS_CLIENT_ID = undefined; // e.g., 'xxxxxx-ios.apps.googleusercontent.com'
const ANDROID_CLIENT_ID = undefined; // e.g., 'xxxxxx-android.apps.googleusercontent.com'

// Decide redirect URI strategy.
// We force the Expo proxy in development / Expo Go because only the https proxy URL is whitelisted in Google.
// For future standalone builds we want a custom scheme-based redirect.
const isStandalone = Platform.select({
  ios: typeof navigator !== 'undefined' && !navigator.userAgent?.includes('Expo'),
  android: typeof navigator !== 'undefined' && !navigator.userAgent?.includes('Expo'),
  default: false,
});

// Proxy (https://auth.expo.io/@owner/slug) used when not standalone. Custom scheme when built.
const redirectUri = isStandalone ? makeRedirectUri({ scheme: 'climbingtracker' }) : makeRedirectUri(); // default -> proxy in Expo Go

if (__DEV__) {
  console.log('[Auth] Using redirect URI:', redirectUri, 'isStandalone:', isStandalone);
}

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'login' | 'signup' | 'reset'>('login');
  const [googleLoading, setGoogleLoading] = useState(false);
  const isWeb = Platform.OS === 'web';

  // Google Auth configuration
  // Native / Expo Go flow uses expo-auth-session to obtain an id_token then sign into Firebase.
  // On web we avoid this hook-based flow to prevent the blocked loopback error and instead use Firebase's popup.
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    isWeb
      ? // Provide minimal dummy config (will not be used) to keep hooks order consistent.
        { clientId: WEB_CLIENT_ID }
      : {
          clientId: WEB_CLIENT_ID,
          iosClientId: IOS_CLIENT_ID,
          androidClientId: ANDROID_CLIENT_ID,
          redirectUri,
          scopes: ['profile', 'email'],
        }
  );

  useEffect(() => {
    if (isWeb) return; // Native-only handler
    if (response) {
      if (response.type === 'success') {
        const { id_token } = response.params;
        if (!id_token) {
          Alert.alert('Google sign-in failed', 'No id_token returned');
          return;
        }
        const credential = GoogleAuthProvider.credential(id_token);
        signInWithCredential(auth, credential)
          .then(() => Alert.alert('Google sign-in successful!'))
          .catch(e => Alert.alert('Google sign-in failed', e.message));
      } else if (response.type === 'error') {
        Alert.alert('Google sign-in error', JSON.stringify(response.params ?? {}, null, 2));
      }
    }
  }, [response, isWeb]);

  // Web popup-based Google sign-in
  const handleGoogleWeb = async () => {
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      if (__DEV__) {
        console.log('[Google][Web] Sign-in success', user.uid, user.email);
      }
      Alert.alert('Google sign-in successful!');
    } catch (e: any) {
      if (__DEV__) {
        console.warn('[Google][Web] signInWithPopup error', e?.code, e?.message);
      }
      // Fallback to redirect if popup is blocked or unsupported
      if (e?.code === 'auth/popup-blocked' || e?.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, provider);
          // Redirect flow will reload page; no further code
          return;
        } catch (re: any) {
          Alert.alert('Google sign-in failed (redirect)', re?.message || 'Unknown error');
        }
      } else {
        Alert.alert('Google sign-in failed', e?.message || 'Unknown error');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleNative = () => {
    if (!request) {
      Alert.alert('Google sign-in unavailable', 'Request not ready yet');
      return;
    }
    promptAsync();
  };

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Login successful!');
    } catch (e: any) {
      Alert.alert('Login failed', e.message);
    }
  };

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert('Account created!');
    } catch (e: any) {
      Alert.alert('Signup failed', e.message);
    }
  };

  const handleReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Password reset email sent!');
    } catch (e: any) {
      Alert.alert('Reset failed', e.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === 'login' ? 'Login' : mode === 'signup' ? 'Sign Up' : 'Reset Password'}</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      {mode !== 'reset' && (
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      )}
      {mode === 'login' && (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      {mode === 'signup' && (
        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      )}
      {mode === 'reset' && (
        <TouchableOpacity style={styles.button} onPress={handleReset}>
          <Text style={styles.buttonText}>Send Reset Email</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        style={[styles.button, styles.googleButton, googleLoading && styles.googleButtonLoading]}
        onPress={isWeb ? handleGoogleWeb : handleGoogleNative}
        disabled={googleLoading || (!isWeb && !request)}
      >
        <Text style={styles.buttonText}>{googleLoading ? 'Signing in...' : 'Sign in with Google'}</Text>
      </TouchableOpacity>
      <View style={styles.switchContainer}>
        {mode !== 'login' && (
          <TouchableOpacity onPress={() => setMode('login')}>
            <Text style={styles.switchText}>Already have an account? Login</Text>
          </TouchableOpacity>
        )}
        {mode !== 'signup' && (
          <TouchableOpacity onPress={() => setMode('signup')}>
            <Text style={styles.switchText}>Create account</Text>
          </TouchableOpacity>
        )}
        {mode !== 'reset' && (
          <TouchableOpacity onPress={() => setMode('reset')}>
            <Text style={styles.switchText}>Forgot password?</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 8,
    marginBottom: 12,
    padding: 14,
    width: '100%',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  container: { alignItems: 'center', flex: 1, justifyContent: 'center', padding: 24 },
  googleButton: {
    backgroundColor: '#ea4335',
  },
  googleButtonLoading: {
    opacity: 0.7,
  },
  input: { borderColor: '#ccc', borderRadius: 8, borderWidth: 1, marginBottom: 16, padding: 12, width: '100%' },
  switchContainer: { marginTop: 12 },
  switchText: { color: '#2563eb', marginTop: 6, textAlign: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
});
