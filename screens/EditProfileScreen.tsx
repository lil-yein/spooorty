/**
 * EditProfileScreen — edit name, phone, photo, and connected Instagram (Figma node 3387:4722)
 *
 * Reached from MyProfileScreen's edit (pencil) header button.
 *
 * Layout:
 *   Top nav: back button (Subtle Sm icon)
 *   Profile: Avatar Xl + camera overlay → ProfilePhotoModal
 *   Inputs: Name, Email (read-only), Phone Number
 *   Instagram row: label + Connect/Edit button → SocialHandleModal
 *   BottomAction: Save (disabled until form is dirty)
 */

import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Alert,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../lib/tokens/spacing';
import { textStyles } from '../lib/tokens/textStyles';
import {
  Avatar,
  BottomAction,
  Button,
  CoverPhotoModal,
  Icon,
  Input,
  Overlay,
} from '../components/ui';
import { useAuth } from '../lib/AuthContext';
import { useCurrentProfile, useUpdateProfile } from '../lib/hooks/useProfile';
import {
  uploadAvatar,
  uriToBlob,
  detectContentType,
  isRemoteUrl,
} from '../lib/api/storage';

// ─── Component ──────────────────────────────────────────

export default function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const { data: profile, loading: profileLoading } = useCurrentProfile();
  const { update, loading: saving } = useUpdateProfile();

  const initial = useMemo(
    () => ({
      displayName: profile?.display_name ?? '',
      phoneNumber: profile?.phone_number ?? '',
      photoUrl: profile?.profile_photo_url ?? null,
      handle: profile?.social_handle ?? null,
    }),
    [profile?.display_name, profile?.phone_number, profile?.profile_photo_url, profile?.social_handle],
  );

  const [displayName, setDisplayName] = useState(initial.displayName);
  const [phoneNumber, setPhoneNumber] = useState(initial.phoneNumber);
  const [photoUri, setPhotoUri] = useState<string | null>(initial.photoUrl);
  const [handle, setHandle] = useState<string | null>(initial.handle);

  const [photoModalVisible, setPhotoModalVisible] = useState(false);
  const [handleModalVisible, setHandleModalVisible] = useState(false);

  // Reseed local form once profile arrives
  React.useEffect(() => {
    setDisplayName(initial.displayName);
    setPhoneNumber(initial.phoneNumber);
    setPhotoUri(initial.photoUrl);
    setHandle(initial.handle);
  }, [initial]);

  const trimmedName = displayName.trim();
  const trimmedPhone = phoneNumber.trim();
  const isDirty =
    trimmedName !== (initial.displayName ?? '').trim() ||
    trimmedPhone !== (initial.phoneNumber ?? '').trim() ||
    photoUri !== initial.photoUrl ||
    handle !== initial.handle;

  const canSave = trimmedName.length >= 2 && isDirty && !saving;

  const handlePhotoSelected = useCallback((uri: string) => {
    setPhotoUri(uri);
  }, []);

  const handleSave = useCallback(async () => {
    if (!canSave) return;

    const updates: Record<string, any> = {};

    if (trimmedName !== (initial.displayName ?? '').trim()) {
      updates.display_name = trimmedName;
    }
    if (trimmedPhone !== (initial.phoneNumber ?? '').trim()) {
      updates.phone_number = trimmedPhone.length > 0 ? trimmedPhone : null;
    }
    if (handle !== initial.handle) {
      updates.social_handle = handle;
      updates.social_platform = handle ? 'instagram' : null;
    }
    if (photoUri !== initial.photoUrl) {
      try {
        if (!photoUri) {
          updates.profile_photo_url = null;
        } else if (isRemoteUrl(photoUri)) {
          updates.profile_photo_url = photoUri;
        } else if (user) {
          const contentType = detectContentType(photoUri);
          const blob = await uriToBlob(photoUri);
          updates.profile_photo_url = await uploadAvatar(user.id, blob, contentType);
        }
      } catch (err) {
        console.warn('Avatar upload failed:', err);
        Alert.alert('Upload Failed', 'Could not upload your new photo. Please try again.');
        return;
      }
    }

    const result = await update(updates);
    if (!result) {
      Alert.alert('Save Failed', 'Could not update your profile. Please try again.');
      return;
    }
    navigation.goBack();
  }, [canSave, trimmedName, trimmedPhone, handle, photoUri, initial, user, update, navigation]);

  if (profileLoading) {
    return <View style={styles.container} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Top nav ─────────────────────────────────────── */}
        <View style={styles.topNavRow}>
          <Button
            emphasis="Subtle"
            content="Icon"
            size="Sm"
            icon={({ color, size }) => (
              <Icon type="arrow backward" size={size} color={color} />
            )}
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* ── Avatar ──────────────────────────────────────── */}
        <View style={styles.avatarBlock}>
          <View style={styles.avatarContainer}>
            <Avatar
              type="Image"
              size="Xl"
              source={photoUri ? { uri: photoUri } : undefined}
            />
            <View style={styles.cameraOverlay}>
              <Button
                emphasis="Subtle"
                content="Icon"
                size="Sm"
                icon={({ color, size }) => (
                  <Icon type="add image" size={size} color={color} />
                )}
                onPress={() => setPhotoModalVisible(true)}
              />
            </View>
          </View>
        </View>

        {/* ── Inputs ──────────────────────────────────────── */}
        <FieldGroup label="Name">
          <Input
            size="Md"
            placeholder="Your name"
            value={displayName}
            onChangeText={setDisplayName}
            autoCapitalize="words"
            autoCorrect={false}
            showTrailingIcon={false}
          />
        </FieldGroup>

        <FieldGroup label="Email">
          <Input
            size="Md"
            placeholder="Email"
            value={profile?.email ?? ''}
            editable={false}
            showTrailingIcon={false}
          />
        </FieldGroup>

        <FieldGroup label="Phone Number">
          <Input
            size="Md"
            placeholder="Add phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
            autoCorrect={false}
            showTrailingIcon={false}
          />
        </FieldGroup>

        {/* ── Instagram row ───────────────────────────────── */}
        <View style={styles.instagramRow}>
          <Text style={styles.instagramLabel}>Instagram</Text>
          <View style={styles.instagramAction}>
            <Button
              emphasis="Bold"
              size="Sm"
              label={handle ? handle : 'Connect'}
              trailingIcon={({ color, size }) => (
                <Icon type="Instagram" size={size} color={color} />
              )}
              onPress={() => setHandleModalVisible(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* ── Save action ─────────────────────────────────── */}
      <View style={styles.bottomActionWrap}>
        <BottomAction>
          <Button
            emphasis="Bold"
            label="Save"
            state={saving ? 'Loading' : 'Enabled'}
            disabled={!canSave}
            overrideTextColor={!canSave ? colors.text.subtle : undefined}
            onPress={handleSave}
          />
        </BottomAction>
      </View>

      {/* ── Photo picker ────────────────────────────────── */}
      <CoverPhotoModal
        visible={photoModalVisible}
        onClose={() => setPhotoModalVisible(false)}
        onImageSelected={handlePhotoSelected}
        context="club"
      />

      {/* ── Instagram handle modal ──────────────────────── */}
      <SocialHandleModal
        visible={handleModalVisible}
        initialValue={handle ?? ''}
        onClose={() => setHandleModalVisible(false)}
        onSave={(value) => {
          setHandle(value.length > 0 ? value : null);
          setHandleModalVisible(false);
        }}
      />
    </KeyboardAvoidingView>
  );
}

// ─── FieldGroup helper ──────────────────────────────────

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      {children}
    </View>
  );
}

// ─── Inline social handle modal ─────────────────────────

type SocialHandleModalProps = {
  visible: boolean;
  initialValue: string;
  onClose: () => void;
  onSave: (value: string) => void;
};

function SocialHandleModal({ visible, initialValue, onClose, onSave }: SocialHandleModalProps) {
  const [value, setValue] = useState(initialValue);

  React.useEffect(() => {
    if (visible) setValue(initialValue);
  }, [visible, initialValue]);

  // Strip leading @ when saving so we store the canonical handle
  const normalize = (raw: string) => raw.trim().replace(/^@+/, '');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={StyleSheet.absoluteFill}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Overlay variant="dark" onPress={onClose}>
          <Pressable style={styles.handleSheet} onPress={() => {}}>
            <Text style={styles.handleTitle}>Connect Instagram</Text>
            <Text style={styles.handleSubtitle}>
              Add your Instagram handle so friends can find you.
            </Text>
            <Input
              size="Md"
              placeholder="@yourhandle"
              value={value}
              onChangeText={setValue}
              autoCapitalize="none"
              autoCorrect={false}
              autoFocus
            />
            <View style={styles.handleActions}>
              <View style={styles.handleActionItem}>
                <Button
                  emphasis="Subtle"
                  label="Cancel"
                  onPress={onClose}
                />
              </View>
              <View style={styles.handleActionItem}>
                <Button
                  emphasis="Bold"
                  label="Save"
                  disabled={normalize(value).length === 0 && initialValue.length === 0}
                  onPress={() => onSave(normalize(value))}
                />
              </View>
            </View>
          </Pressable>
        </Overlay>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  content: {
    paddingTop: spacer['24'],
    paddingBottom: 140, // leaves room for floating BottomAction
    gap: spacer['24'],
  },

  topNavRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
  },

  avatarBlock: {
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
  },

  avatarContainer: {
    position: 'relative',
  },

  cameraOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  fieldGroup: {
    paddingHorizontal: spacer['24'],
    gap: spacer['12'],
  },

  fieldLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  instagramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacer['24'],
    gap: spacer['12'],
  },

  instagramLabel: {
    ...textStyles.title02Medium,
    color: colors.text.bold,
  },

  instagramAction: {
    flexShrink: 0,
  },

  bottomActionWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  // Social handle modal
  handleSheet: {
    width: '88%',
    maxWidth: 360,
    backgroundColor: colors.surface.bold,
    borderRadius: borderRadius['16'],
    padding: spacer['24'],
    gap: spacer['16'],
  },

  handleTitle: {
    ...textStyles.title01Medium,
    color: colors.text.bold,
  },

  handleSubtitle: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },

  handleActions: {
    flexDirection: 'row',
    gap: spacer['12'],
    marginTop: spacer['8'],
  },

  handleActionItem: {
    flex: 1,
  },
});
