/**
 * CoverPhotoModal — modal for selecting a cover photo
 *
 * Options:
 *   1. Choose from Gallery (expo-image-picker)
 *   2. Take Photo (expo-image-picker camera)
 *   3. Browse Stock Photos (Unsplash image search)
 *
 * Anatomy (from Figma node 3261:22474):
 *   cardOuter: surface/subtle bg, padding 8, borderRadius 16
 *   cardInner: border 0.5, borderRadius 16, padding 16
 *     Title: "Add cover photo" — title01Medium
 *     Subtitle: body02Light, text/subtle
 *     Buttons: gap spacer/12
 *       "Choose from Gallery" — Bold button
 *       "Take Photo" — Subtle button
 *       "Browse Stock Photos" — Subtle button
 *
 * Stock photo browser (full-screen modal):
 *   Search bar at top, 2-column masonry grid of results
 *   Tap photo to select, shows Unsplash attribution
 */

import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import Button from './Button';
import Icon from './Icon';
import Search from './Search';

// ─── Unsplash config ────────────────────────────────────

const UNSPLASH_KEY = process.env.EXPO_PUBLIC_UNSPLASH_ACCESS_KEY ?? '';
const UNSPLASH_API = 'https://api.unsplash.com';

type UnsplashPhoto = {
  id: string;
  urls: { small: string; regular: string };
  user: { name: string; links: { html: string } };
  width: number;
  height: number;
};

async function searchUnsplash(query: string, page = 1): Promise<UnsplashPhoto[]> {
  if (!UNSPLASH_KEY || !query.trim()) return [];
  const url = `${UNSPLASH_API}/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20&orientation=landscape`;
  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.results ?? [];
}

// ─── Types ──────────────────────────────────────────────

export type CoverPhotoModalProps = {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
  /** Label context: "club" or "event" */
  context?: 'club' | 'event';
};

// ─── Constants ──────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 16;
const GRID_PADDING = 24;
const COL_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const PHOTO_HEIGHT = COL_WIDTH * 0.75; // 4:3 aspect ratio

// ─── Component ──────────────────────────────────────────

export default function CoverPhotoModal({
  visible,
  onClose,
  onImageSelected,
  context = 'club',
}: CoverPhotoModalProps) {
  const [showStockBrowser, setShowStockBrowser] = useState(false);
  const [stockQuery, setStockQuery] = useState('');
  const [stockPhotos, setStockPhotos] = useState<UnsplashPhoto[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const [stockPage, setStockPage] = useState(1);

  // Search Unsplash when query or page changes
  const doSearch = useCallback(async (query: string, page: number, append: boolean) => {
    setStockLoading(true);
    const results = await searchUnsplash(query, page);
    setStockPhotos((prev) => (append ? [...prev, ...results] : results));
    setStockLoading(false);
  }, []);

  // No auto-search on open — user types and submits to search

  const handleSearchSubmit = useCallback(() => {
    if (!stockQuery.trim()) return;
    setStockPage(1);
    doSearch(stockQuery, 1, false);
  }, [stockQuery, doSearch]);

  const handleLoadMore = useCallback(() => {
    if (stockLoading || !stockQuery.trim() || stockPhotos.length === 0) return;
    const nextPage = stockPage + 1;
    setStockPage(nextPage);
    doSearch(stockQuery, nextPage, true);
  }, [stockPage, stockQuery, stockLoading, stockPhotos.length, doSearch]);

  const handleSelectStock = useCallback(
    (photo: UnsplashPhoto) => {
      onImageSelected(photo.urls.regular);
      setShowStockBrowser(false);
      onClose();
    },
    [onImageSelected, onClose],
  );

  const handleGallery = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
      onClose();
    }
  };

  const handleCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
      onClose();
    }
  };

  const handleCloseAll = useCallback(() => {
    setShowStockBrowser(false);
    onClose();
  }, [onClose]);

  // ─── Stock Photo Browser ────────────────────────────────

  const renderStockPhoto = useCallback(
    ({ item }: { item: UnsplashPhoto }) => {
      return (
        <Pressable onPress={() => handleSelectStock(item)} style={styles.stockPhotoWrap}>
          <Image
            source={{ uri: item.urls.small }}
            style={styles.stockPhoto}
            resizeMode="cover"
          />
          <Text style={styles.attribution} numberOfLines={1}>
            {item.user.name}
          </Text>
        </Pressable>
      );
    },
    [handleSelectStock],
  );

  if (showStockBrowser) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleCloseAll}>
        <View style={styles.stockContainer}>
          {/* Header — back button only (uses Button Sm Icon, same as other screens) */}
          <View style={styles.stockHeader}>
            <Button
              emphasis="Subtle"
              content="Icon"
              size="Sm"
              icon={({ color, size }) => (
                <Icon type="arrow backward" size={size} color={color} />
              )}
              onPress={() => setShowStockBrowser(false)}
            />
          </View>

          {/* Search */}
          <View style={styles.stockSearchWrap}>
            <Search
              value={stockQuery}
              onChangeText={setStockQuery}
              placeholder="Search Stock Photos"
              onSubmitEditing={handleSearchSubmit}
            />
          </View>

          {/* Grid */}
          <FlatList
            data={stockPhotos}
            renderItem={renderStockPhoto}
            keyExtractor={(item) => item.id}
            numColumns={2}
            columnWrapperStyle={styles.gridRow}
            contentContainerStyle={styles.gridContent}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={
              stockLoading ? (
                <ActivityIndicator style={styles.loader} size="large" color={colors.icon.bold} />
              ) : (
                <Text style={styles.emptyText}>
                  {stockQuery.trim() ? 'No photos found' : 'Search for stock photos'}
                </Text>
              )
            }
            ListFooterComponent={
              stockLoading && stockPhotos.length > 0 ? (
                <ActivityIndicator style={styles.loader} size="small" color={colors.icon.bold} />
              ) : null
            }
          />

          {/* Unsplash attribution */}
          <View style={styles.unsplashCredit}>
            <Text style={styles.creditText}>Photos provided by Unsplash</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // ─── Main Modal (Choose option) ─────────────────────────

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.cardOuter} onPress={(e) => e.stopPropagation()}>
          <View style={styles.cardInner}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Add cover photo</Text>
              <Text style={styles.subtitle}>
                It will be used as a background on your {context} page!
              </Text>
            </View>

            <View style={styles.buttons}>
              <Button
                emphasis="Bold"
                label="Choose from Gallery"
                onPress={handleGallery}
              />
              <Button
                emphasis="Subtle"
                label="Take Photo"
                onPress={handleCamera}
              />
              <Button
                emphasis="Subtle"
                label="Browse Stock Photos"
                onPress={() => setShowStockBrowser(true)}
              />
            </View>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // ── Main modal ──
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacer['24'],
  },

  cardOuter: {
    width: '100%',
    backgroundColor: colors.surface.subtle,
    borderRadius: borderRadius['16'],
    padding: spacer['8'],
  },

  cardInner: {
    borderWidth: borderWidth.thin,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    padding: spacer['16'],
    gap: spacer['24'],
  },

  textGroup: {
    gap: spacer['8'],
  },

  title: {
    ...textStyles.title01Medium,
    color: colors.text.bold,
  },

  subtitle: {
    ...textStyles.body02Light,
    color: colors.text.subtle,
  },

  buttons: {
    gap: spacer['12'],
  },

  // ── Stock photo browser ──
  stockContainer: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacer['64'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['12'],
  },

  stockSearchWrap: {
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['24'],
  },

  gridContent: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: spacer['24'],
  },

  gridRow: {
    gap: GRID_GAP,
    marginBottom: spacer['16'],
  },

  stockPhotoWrap: {
    flex: 1,
    maxWidth: COL_WIDTH,
  },

  stockPhoto: {
    width: '100%',
    height: PHOTO_HEIGHT,
    borderRadius: borderRadius['16'],
  },

  attribution: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
    marginTop: spacer['8'],
  },

  loader: {
    paddingVertical: spacer['24'],
  },

  emptyText: {
    ...textStyles.body01Light,
    color: colors.text.subtle,
    textAlign: 'center',
    paddingVertical: spacer['24'],
  },

  unsplashCredit: {
    paddingVertical: spacer['16'],
    paddingHorizontal: spacer['24'],
    alignItems: 'center',
    borderTopWidth: borderWidth.thin,
    borderTopColor: colors.border.subtle,
  },

  creditText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },
});
