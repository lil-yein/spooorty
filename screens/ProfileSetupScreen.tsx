/**
 * ProfileSetupScreen — first onboarding step (after auth)
 *
 * Layout:
 *   Header: "Let's build your profile!" + "Add a photo and name so others can recognize you."
 *   Body:
 *     Squircle avatar (140px) with camera button overlay → opens ProfilePhotoModal
 *     Name input (Md, "Display name" placeholder)
 *   Footer: "Next" button (disabled until name is provided)
 *
 * Photo is optional; name is required (min 2 chars).
 * Selections are passed via route params to SportsSelectionScreen, which
 * then calls completeOnboarding() with the full payload.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import { Avatar, Button, Icon, Input, ProfilePhotoModal } from '../components/ui';

export default function ProfileSetupScreen() {
  const navigation = useNavigation<any>();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const trimmedName = displayName.trim();
  const canContinue = trimmedName.length >= 2;

  const handleNext = () => {
    if (!canContinue) return;
    navigation.navigate('SportsSelection', {
      photoUri,
      displayName: trimmedName,
    });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <View style={styles.headerGroup}>
          <Text style={styles.title}>Let's build your profile!</Text>
          <Text style={styles.subtitle}>
            Add a photo and name so others can recognize you.
          </Text>
        </View>

        <View style={styles.body}>
          {/* Avatar with camera button overlay */}
          <View style={styles.avatarWrap}>
            <Avatar
              type="Image"
              size="Xl"
              source={photoUri ? { uri: photoUri } : undefined}
            />
            <Pressable
              style={styles.cameraButton}
              onPress={() => setModalVisible(true)}
              hitSlop={8}
            >
              <Icon type="camera" size={16} color={colors.icon.bold} />
            </Pressable>
          </View>

          <Input
            size="Md"
            placeholder="Name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleNext}
          />
        </View>

        <View style={styles.ctaGroup}>
          <Button
            emphasis="Bold"
            label="Next"
            onPress={handleNext}
            disabled={!canContinue}
            overrideTextColor={!canContinue ? colors.text.subtle : undefined}
          />
        </View>
      </View>

      <ProfilePhotoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onImageSelected={(uri) => setPhotoUri(uri)}
      />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    flex: 1,
    paddingTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['48'],
    gap: spacer['48'],
  },

  headerGroup: {
    gap: spacer['16'],
  },

  title: {
    ...textStyles.headline02Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.title01Light,
    color: colors.text.subtle,
  },

  body: {
    alignItems: 'center',
    gap: spacer['32'],
  },

  avatarWrap: {
    position: 'relative',
  },

  cameraButton: {
    position: 'absolute',
    right: -4,
    bottom: 4,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface.bold,
    borderWidth: borderWidth.regular,
    borderColor: colors.border.subtle,
    alignItems: 'center',
    justifyContent: 'center',
  },

  ctaGroup: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
