# Eatwisely

## Overview

Eatwisely is a mobile application. Built with React Native and Expo.

## Technical Stack

- **Frontend**: React Native with Expo framework
- **Language**: TypeScript for type-safe development
- **State Management**: React Context API and custom hooks
- **Navigation**: Expo Router for declarative navigation
- **Authentication**: Clerk for secure user management
- **Backend Integration**: RESTful API calls using Axios
- **Push Notifications**: Expo Notifications and Firebase Cloud Messaging
- **Analytics**: Mixpanel for user behavior tracking
- **Error Tracking**: Sentry for real-time error monitoring
- **In-App Purchases**: React Native IAP for handling subscriptions and one-time purchases
- **Styling**: React Native's StyleSheet for component-specific styles

## Architecture

The application follows a modular architecture with the following key components:

1. **Screens**: Represent main views of the application (e.g., Recipe, Profile, Add Credits).
   Example:

   ```typescript:screens/recipe/index.tsx
   import React from 'react';
   import {
     View,
     Text,
     SectionList,
     SectionListRenderItemInfo,
     SectionListData,
     ActivityIndicator,
   } from 'react-native';
   import BottomBar from '@/components/BottomBar';
   import GenerateRecipeModal from '@/components/GenerateRecipeModal';

   import { useRecipeScreen } from './useRecipeScreen';

   import styles from './recipe.styles';

   type RecipeInfo = {
     minutes: number;
     calories: number;
     protein: string;
     fat: string;
     carbs: string;
   };

   type Instruction = {
     [key: string]: string[];
   };

   type Ingredient = {
     ingredient_name: string;
     quantity: string;
     unit: string;
   };

   type SectionItem = RecipeInfo | Ingredient | Instruction | number;

   type Section = {
     title: string;
     data: SectionItem[];
     renderItem: (
       info: SectionListRenderItemInfo<SectionItem>,
     ) => React.ReactElement | null;
   };

   const RecipeScreen
   ```

2. **Components**: Reusable UI elements used across different screens.

3. **Hooks**: Custom React hooks for encapsulating and sharing stateful logic.
   Example:

   ```typescript:screens/recipe/useRecipeScreen.ts
   export const useRecipeScreen = () => {
     const formatRecipeMessage = (recipe: any) => {
       const { title, ingredients, instructions } = recipe;
       let message = `${title}\n\nIngredients\n\n`;

       ingredients.forEach((ingredient: any) => {
         const displayQuantity = toFraction(ingredient.quantity);
         let unit = ingredient.unit;

         const words = unit.split(' ');
         const firstWord = words[0];
         const lastWord = words[words.length - 1];

         if (firstWord === lastWord && words.length > 1) {
           unit = words.slice(0, words.length - 1).join(' ');
         }

         message += `• ${capitalizeFirstLetter(ingredient.ingredient_name)}: `;
         if (ingredient.unit === 'tsp' || ingredient.unit === 'tbsp') {
           message += `${
             +displayQuantity > 1
               ? `${displayQuantity} tablespoons`
               : `${displayQuantity} tablespoon`
           }\n`;
         } else {
           message += `${
             displayQuantity ? `${displayQuantity} ${unit}` : `${unit}`
           }\n`;
         }
       });

       message += `\nInstructions\n`;

       const instructionSections = ['prep', 'cook', 'serving'];

       instructionSections.forEach((section, index) => {
         message += `\n${index + 1}. ${capitalizeFirstLetter(section)}\n`;
         if (instructions[section] && instructions[section].length > 0) {
           message += `• ${instructions[section].join('\n• ')}\n`;
         } else {
           message += `Skip this step\n`;
         }
       });

       message += `\n\nCreated by eatwisely(${
         Platform.OS === 'ios'
           ? 'https://eatwisely.app/#ios'
           : 'https://eatwisely.app/#android'
       })`;

       return message;
     }
   ```

4. **Styles**: Separate style files for each screen and component for better maintainability.
   Example:

   ```typescript:screens/recipe/recipe.styles.ts
   import { StyleSheet } from 'react-native';

   export default StyleSheet.create({
     container: {
       flex: 1,
       backgroundColor: '#fff',
       paddingVertical: 16,
     },
     loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
     screenTitle: {
       fontFamily: 'GolosText-ExtraBold',
       fontSize: 28,
       lineHeight: 28,
       color: '#0C0C19',
       paddingHorizontal: 16,
     },
     infoContainer: {
       flexDirection: 'row',
       marginVertical: 16,
       gap: 12,
       paddingHorizontal: 16,
     },
     infoBlock: {
       backgroundColor: '#F0F4F7',
       padding: 12,
       paddingTop: 8,
       borderRadius: 12,
     },
     infoTitle: {
       fontFamily: 'Nunito-Regular',
       fontSize: 15,
       lineHeight: 20,
       color: '#0C0C19',
       marginBottom: 7,
     },
     infoDetailsContainer: {
       flexDirection: 'row',
       gap: 24,
     },
     infoDetail: {
       flexDirection: 'column',
     },
     infoDetailTop: {
       fontFamily: 'GolosText-ExtraBold',
       fontSize: 22,
       lineHeight: 24,
       color: '#0C0C19',
     },
     infoDetailBottom: {
       fontFamily: 'Nunito-Regular',
       fontSize: 12,
       lineHeight: 16,
       color: '#0C0C19',
     },
     sectionHeaderBackground: {
       backgroundColor: '#fff',
       paddingVertical: 8,
       borderBottomStartRadius: 8,
       borderBottomEndRadius: 8,
     },
     sectionTitle: {
       fontFamily: 'GolosText-ExtraBold',
       fontSize: 22,
       lineHeight: 24,
       color: '#0C0C19',
       paddingHorizontal: 16,
     },
     ingredient: {
       fontFamily: 'Nunito-Regular',
       fontSize: 17,
       lineHeight: 24,
       color: '#0C0C19',
     },
     ingredientsContainer: {
       marginBottom: 16,
       paddingHorizontal: 16,
     },
     instructionItem: {
       marginBottom: 16,
       paddingHorizontal: 16,
     },
     instructionStep: {
       fontFamily: 'GolosText-ExtraBold',
       fontSize: 17,
       lineHeight: 24,
       color: '#0C0C19',
       marginBottom: 2,
     },
     instructionDetail: {
       fontFamily: 'Nunito-Regular',
       fontSize: 17,
       lineHeight: 24,
       color: '#0C0C19',
     },
     servingText: {
       fontFamily: 'Nunito-Regular',
       fontSize: 17,
       lineHeight: 24,
       color: '#0C0C19',
     },
   });
   ```

5. **Navigation**: Utilizes Expo Router for type-safe and file-system based routing.

6. **Services**: Abstracted API calls and third-party service integrations.

7. **Utils**: Helper functions and utility modules.

8. **Constants**: Application-wide constant values and configurations.

## Key Features and Implementation Details

1. **Recipe Generation**:

   - Utilizes AI-powered backend service for generating personalized recipes.
   - Implements a credit system for recipe generation to manage user quotas.

2. **Nutritional Information Display**:

   - Parses and presents detailed nutritional data for each recipe.
   - Custom UI components for visualizing nutritional content.

3. **User Authentication**:

   - Integrated Clerk for secure authentication flow.
   - Implements token-based authentication for API requests.

4. **Push Notifications**:

   - Utilizes Expo Notifications for cross-platform push notification handling.
   - Implements Firebase Cloud Messaging for Android-specific notifications.

5. **In-App Purchases**:

   - Integrates React Native IAP for handling subscription and one-time purchase flows.
   - Implements server-side receipt validation for security.

6. **Offline Support**:

   - Implements data caching strategies for offline access to previously loaded recipes.

7. **Performance Optimization**:
   - Utilizes React Native's performance optimization techniques like memoization and lazy loading.

## Build and Deployment

The project uses Expo Application Services (EAS) for building and deploying:

- **iOS Production Build**:
  ```
  pnpm run build-ios:prod
  ```
- **Android Production Build**:
  ```
  pnpm run build-android:prod
  ```

Configuration for different environments (development, staging, production) is managed through EAS profiles in the `eas.json` file:

```
json:eas.json
{
"cli": {
"version": ">= 3.13.3"
},
"build": {
"development": {
"developmentClient": true,
"distribution": "internal"
},
"preview": {
"distribution": "internal"
},
"production": {}
},
"submit": {
"production": {}
}
}
```

This configuration allows for different build settings for each environment:

- **Development**: Builds with the development client for internal testing.
- **Preview**: Internal distribution for beta testing.
- **Production**: Standard production build for app store submission.

Each profile can be further customized with specific build parameters, environment variables, and plugins as needed for your project's requirements.

````

## Native Configurations

### iOS

The iOS configuration includes several key files:

1. **Podfile**: Manages iOS dependencies and configurations.
   ```ruby:ios/Podfile
   require File.join(File.dirname(`node --print "require.resolve('expo/package.json')"`), "scripts/autolinking")
   require File.join(File.dirname(`node --print "require.resolve('react-native/package.json')"`), "scripts/react_native_pods")

   require 'json'
   podfile_properties = JSON.parse(File.read(File.join(__dir__, 'Podfile.properties.json'))) rescue {}

   ENV['RCT_NEW_ARCH_ENABLED'] = podfile_properties['newArchEnabled'] == 'true' ? '1' : '0'
   ENV['EX_DEV_CLIENT_NETWORK_INSPECTOR'] = podfile_properties['EX_DEV_CLIENT_NETWORK_INSPECTOR']

   platform :ios, podfile_properties['ios.deploymentTarget'] || '13.4'
   install! 'cocoapods',
     :deterministic_uuids => false

   prepare_react_native_project!

   target 'Eatwisely' do
     use_expo_modules!
     config = use_native_modules!
     pod 'Firebase/Messaging'
     pod 'Firebase', :modular_headers => true
     pod 'FirebaseCoreInternal', :modular_headers => true
     pod 'GoogleUtilities', :modular_headers => true
     pod 'FirebaseCore', :modular_headers => true

     use_frameworks! :linkage => podfile_properties['ios.useFrameworks'].to_sym if podfile_properties['ios.useFrameworks']
     use_frameworks! :linkage => ENV['USE_FRAMEWORKS'].to_sym if ENV['USE_FRAMEWORKS']
````

2. **project.pbxproj**: Xcode project configuration file.

   ```ios/eatwisely.xcodeproj/project.pbxproj
   startLine: 9
   endLine: 71
   ```

3. **Info.plist**: Contains essential app configuration for iOS.
   ```xml:ios/eatwisely/Info.plist
   startLine: 35
   endLine: 98
   ```

Key iOS configurations:

- Deployment target set to iOS 13.4
- Firebase Messaging integration
- Background modes enabled for fetch and remote notifications
- Face ID usage description included
- Push notifications and user tracking permissions configured

### Android

Android configuration is primarily managed through Gradle files:

1. **settings.gradle**: Project-level Gradle settings.

   ```groovy:android/settings.gradle
   rootProject.name = 'Eatwisely'

   dependencyResolutionManagement {
     versionCatalogs {
       reactAndroidLibs {
         from(files(new File(["node", "--print", "require.resolve('react-native/package.json')"].execute(null, rootDir).text.trim(), "../gradle/libs.versions.toml")))
       }
     }
   }

   apply from: new File(["node", "--print", "require.resolve('expo/package.json')"].execute(null, rootDir).text.trim(), "../scripts/autolinking.gradle");
   useExpoModules()

   apply from: new File(["node", "--print", "require.resolve('@react-native-community/cli-platform-android/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim(), "../native_modules.gradle");
   applyNativeModulesSettingsGradle(settings)

   include ':app'
   includeBuild(new File(["node", "--print", "require.resolve('@react-native/gradle-plugin/package.json', { paths: [require.resolve('react-native/package.json')] })"].execute(null, rootDir).text.trim()).getParentFile())
   ```

Key Android configurations:

- React Native autolink setup
- Expo modules integration
- Custom native modules support

### Cross-Platform

1. **eas.json**: Manages build configurations for both iOS and Android using Expo Application Services.
   ```json:eas.json
   startLine: 293
   endLine: 311
   ```

This file defines different build profiles for development, preview, and production environments, allowing for flexible and environment-specific builds.

## Additional Development Notes

- The project uses custom fonts (GolosText and Nunito) across both platforms.
- Firebase Cloud Messaging is integrated for push notifications on both iOS and Android.
- The app supports deep linking, configured in the iOS Info.plist and Android AndroidManifest.xml.
- Performance optimizations include the use of modular headers for iOS dependencies and careful management of background modes.
- The app is configured to support only portrait orientation on iOS devices.
- User tracking permissions are included for personalized ad support.
