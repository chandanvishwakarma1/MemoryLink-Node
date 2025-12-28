import { ScrollView, Text, View } from 'react-native';
import React from 'react';

export default function TermsCondition() {
  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
    >
      <Text className="text-xl font-bold mb-4">Terms & Conditions</Text>

      <Text className="text-neutral-600 mb-4">
        By creating an account or using this app, you agree to the following Terms and Conditions.
        If you do not agree, please do not use the app.
      </Text>

      <Text className="font-semibold mb-2">1. Eligibility</Text>
      <Text className="text-neutral-600 mb-4">
        You must be at least 18 years old to use this app. By registering, you confirm that
        the information you provide is accurate and truthful.
      </Text>

      <Text className="font-semibold mb-2">2. Account Responsibility</Text>
      <Text className="text-neutral-600 mb-4">
        You are responsible for maintaining the confidentiality of your account credentials.
        Any activity performed using your account is your responsibility.
      </Text>

      <Text className="font-semibold mb-2">3. Acceptable Use</Text>
      <Text className="text-neutral-600 mb-4">
        You agree not to misuse the app, attempt unauthorized access, disrupt services,
        or engage in illegal or harmful activities.
      </Text>

      <Text className="font-semibold mb-2">4. Content</Text>
      <Text className="text-neutral-600 mb-4">
        You retain ownership of any content you provide. You grant us permission to store
        and display it as necessary to operate the service.
      </Text>

      <Text className="font-semibold mb-2">5. Termination</Text>
      <Text className="text-neutral-600 mb-4">
        We reserve the right to suspend or terminate accounts that violate these terms
        or compromise platform safety.
      </Text>

      <Text className="font-semibold mb-2">6. Limitation of Liability</Text>
      <Text className="text-neutral-600 mb-4">
        We are not liable for indirect damages, data loss, or service interruptions,
        except as required by law.
      </Text>

      <Text className="font-semibold mb-2">7. Changes</Text>
      <Text className="text-neutral-600 mb-4">
        These terms may be updated from time to time. Continued use of the app
        constitutes acceptance of the updated terms.
      </Text>

      <Text className="text-neutral-500 text-sm mt-6">
        Last updated: {new Date().getFullYear()}
      </Text>
    </ScrollView>
  );
}
