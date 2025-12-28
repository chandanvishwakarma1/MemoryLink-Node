import { ScrollView, Text, View } from 'react-native';
import React from 'react';

export default function PrivacyPolicy() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text className="text-xl font-bold mb-4">Privacy Policy</Text>

      <Text className="text-neutral-600 mb-4">
        Your privacy is important to us. This policy explains how we collect,
        use, and protect your personal information.
      </Text>

      <Text className="font-semibold mb-2">1. Information We Collect</Text>
      <Text className="text-neutral-600 mb-4">
        We may collect your name, username, email address, date of birth,
        and other information you provide during registration.
      </Text>

      <Text className="font-semibold mb-2">2. How We Use Your Information</Text>
      <Text className="text-neutral-600 mb-4">
        Your data is used to create and manage your account, provide services,
        improve app performance, and communicate important updates.
      </Text>

      <Text className="font-semibold mb-2">3. Data Security</Text>
      <Text className="text-neutral-600 mb-4">
        We use industry-standard security measures to protect your data.
        Passwords are encrypted and never stored in plain text.
      </Text>

      <Text className="font-semibold mb-2">4. Data Sharing</Text>
      <Text className="text-neutral-600 mb-4">
        We do not sell your personal data. Information may be shared only
        with trusted service providers or when required by law.
      </Text>

      <Text className="font-semibold mb-2">5. Your Rights</Text>
      <Text className="text-neutral-600 mb-4">
        You can access, update, or delete your account data at any time.
        You may also request permanent deletion of your account.
      </Text>

      <Text className="font-semibold mb-2">6. Children’s Privacy</Text>
      <Text className="text-neutral-600 mb-4">
        This app is not intended for children under 18. We do not knowingly
        collect data from minors.
      </Text>

      <Text className="font-semibold mb-2">7. Policy Updates</Text>
      <Text className="text-neutral-600 mb-4">
        We may update this policy periodically. Significant changes
        will be communicated within the app.
      </Text>

      <Text className="text-neutral-500 text-sm mt-6">
        Last updated: {new Date().getFullYear()}
      </Text>
    </ScrollView>
  );
}
