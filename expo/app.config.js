module.exports = {
  expo: {
    owner: "softxinnovations",
    name: "Soulworx",
    slug: "soulworx",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "soulworx",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/images/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#F5F1E8"
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.soulworx.app",
      buildNumber: "1",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: "This app needs access to your camera to take photos for your profile and content.",
        NSPhotoLibraryUsageDescription: "This app needs access to your photo library to select images for your profile and content.",
        NSPhotoLibraryAddUsageDescription: "This app needs permission to save photos to your library.",
        NSMicrophoneUsageDescription: "This app needs access to your microphone for video recording features."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#F5F1E8"
      },
      package: "com.soulworx.app"
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#F5F1E8",
          image: "./assets/images/splash-icon.png",
          imageWidth: 200
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      eas: {
        projectId: "b58c24a2-a6c1-49f2-90b9-1ae4680bc62b"
      },
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      databaseUrl: process.env.EXPO_PUBLIC_DATABASE_URL,
      openaiApiKey: process.env.EXPO_PUBLIC_OPENAI_API_KEY
    }
  }
};

