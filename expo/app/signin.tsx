import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';

const { height } = Dimensions.get('window');

export default function SignInScreen() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function signInWithEmail() {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      // Success - will be handled by auth state listener
      router.replace('/(tabs)/programs');
    }
  }

  async function signUpWithEmail() {
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setError('Check your email for verification link!');
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* Hero Section with Background */}
      <View style={[styles.heroSection, { paddingTop: insets.top }]}>
        <View style={styles.heroOverlay} />
        
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('@/assets/images/logo-white.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* Title */}
        <View style={styles.heroText}>
          <Text style={styles.heroTitle}>Soulworx</Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formSection}>

        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color={SoulworxColors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={SoulworxColors.textTertiary}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />
            <TouchableOpacity
              onPress={() => {
                setEmail('user@soulworx.ca');
                setPassword('user123');
              }}
              style={styles.devIconButton}
            >
              <Ionicons name="flash-outline" size={18} color={SoulworxColors.gold} />
            </TouchableOpacity>
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={SoulworxColors.textSecondary} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={SoulworxColors.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="password"
            />
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={16} color={SoulworxColors.error} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={signInWithEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          {/* Create Account Button */}
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={signUpWithEmail}
            disabled={loading}
          >
            <Text style={styles.secondaryButtonText}>Create Account</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  heroSection: {
    height: height * 0.5,
    backgroundColor: SoulworxColors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.xxl,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  logo: {
    width: 80,
    height: 80,
  },
  heroText: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: Typography['5xl'],
    fontWeight: Typography.medium,
    color: SoulworxColors.white,
    marginBottom: Spacing.xs,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.white,
    opacity: 0.9,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  formSection: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    marginTop: -32,
    paddingTop: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  formTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.xs,
  },
  formSubtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xl,
  },
  form: {
    gap: Spacing.sm,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SoulworxColors.white,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: SoulworxColors.border,
    position: 'relative',
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
  },
  errorText: {
    flex: 1,
    fontSize: Typography.sm,
    color: SoulworxColors.error,
  },
  button: {
    backgroundColor: SoulworxColors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    ...Shadows.medium,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
    letterSpacing: 0.5,
  },
  secondaryButton: {
    backgroundColor: SoulworxColors.darkBeige,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.textPrimary,
  },
  forgotButton: {
    alignItems: 'center',
    padding: Spacing.sm,
  },
  forgotText: {
    fontSize: Typography.sm,
    color: SoulworxColors.gold,
    fontWeight: Typography.medium,
  },
  devIconButton: {
    padding: Spacing.xs,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

