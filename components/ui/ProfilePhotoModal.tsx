/**
 * ProfilePhotoModal — modal for choosing a profile photo
 *
 * Three options:
 *   1. Choose from Gallery (expo-image-picker)
 *   2. Take Photo (expo-image-picker camera)
 *   3. Browse Stock Photos (Unsplash search)
 *
 * Stock browser uses a 2-column masonry layout: each photo preserves its
 * original aspect ratio, and photos are distributed to whichever column is
 * currently shorter to keep the layout balanced. No default search query —
 * the grid is empty until the user types and submits.
 */

import React, { useState, useCallback, useMemo, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ScrollView,
  Image,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import Button from './Button';
import Icon from './Icon';
import Search from './Search';
import { searchUnsplash, type UnsplashPhoto } from '../../lib/api/unsplash';

// ─── Types ──────────────────────────────────────────────

export type ProfilePhotoModalProps = {
  visible: boolean;
  onClose: () => void;
  onImageSelected: (uri: string) => void;
};

// ─── Constants ──────────────────────────────────────────

const SCREEN_WIDTH = Dimensions.get('window').width;
const GRID_GAP = 16;
const GRID_PADDING = 24;
const COL_WIDTH = (SCREEN_WIDTH - GRID_PADDING * 2 - GRID_GAP) / 2;
const NEAR_BOTTOM_PX = 200;

type SizedPhoto = UnsplashPhoto & { displayHeight: number };

/**
 * Distribute photos into 2 balanced columns. Each photo's display height is
 * computed from its original aspect ratio so the masonry preserves intent.
 * Each new photo joins whichever column is currently shorter.
 */
function buildColumns(photos: UnsplashPhoto[]): { left: SizedPhoto[]; right: SizedPhoto[] } {
  const left: SizedPhoto[] = [];
  const right: SizedPhoto[] = [];
  let leftHeight = 0;
  let rightHeight = 0;

  for (const photo of photos) {
    const ratio = photo.width / photo.height || 1;
    const displayHeight = COL_WIDTH / ratio;
    if (leftHeight <= rightHeight) {
      left.push({ ...photo, displayHeight });
      leftHeight += displayHeight + GRID_GAP;
    } else {
      right.push({ ...photo, displayHeight });
      rightHeight += displayHeight + GRID_GAP;
    }
  }
  return { left, right };
}

// ─── Component ──────────────────────────────────────────

export default function ProfilePhotoModal({
  visible,
  onClose,
  onImageSelected,
}: ProfilePhotoModalProps) {
  const [showStockBrowser, setShowStockBrowser] = useState(false);
  const [stockQuery, setStockQuery] = useState('');
  const [stockPhotos, setStockPhotos] = useState<UnsplashPhoto[]>([]);
  const [stockLoading, setStockLoading] = useState(false);
  const stockPageRef = useRef(1);
  const lastSubmittedQueryRef = useRef('');

  const doSearch = useCallback(
    async (query: string, page: number, append: boolean) => {
      setStockLoading(true);
      // No orientation filter — let users pick portrait/landscape/square
      const results = await searchUnsplash(query, page, 'squarish');
      setStockPhotos((prev) => (append ? [...prev, ...results] : results));
      setStockLoading(false);
    },
    [],
  );

  const handleSearchSubmit = useCallback(() => {
    const q = stockQuery.trim();
    if (!q) return;
    stockPageRef.current = 1;
    lastSubmittedQueryRef.current = q;
    doSearch(q, 1, false);
  }, [stockQuery, doSearch]);

  const handleLoadMore = useCallback(() => {
    const q = lastSubmittedQueryRef.current;
    if (stockLoading || !q || stockPhotos.length === 0) return;
    const nextPage = stockPageRef.current + 1;
    stockPageRef.current = nextPage;
    doSearch(q, nextPage, true);
  }, [stockLoading, stockPhotos.length, doSearch]);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
      const distanceFromBottom =
        contentSize.height - (layoutMeasurement.height + contentOffset.y);
      if (distanceFromBottom < NEAR_BOTTOM_PX) handleLoadMore();
    },
    [handleLoadMore],
  );

  const handleSelectStock = useCallback(
    (photo: UnsplashPhoto) => {
      onImageSelected(photo.urls.regular);
      // Reset stock browser state for next open
      setShowStockBrowser(false);
      setStockQuery('');
      setStockPhotos([]);
      lastSubmittedQueryRef.current = '';
      stockPageRef.current = 1;
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
      aspect: [1, 1],
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
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
      onClose();
    }
  };

  const handleCloseAll = useCallback(() => {
    setShowStockBrowser(false);
    setStockQuery('');
    setStockPhotos([]);
    lastSubmittedQueryRef.current = '';
    stockPageRef.current = 1;
    onClose();
  }, [onClose]);

  // ─── Stock photo browser ────────────────────────────────

  const columns = useMemo(() => buildColumns(stockPhotos), [stockPhotos]);

  const renderPhoto = (item: SizedPhoto) => (
    <Pressable
      key={item.id}
      onPress={() => handleSelectStock(item)}
      style={styles.stockPhotoWrap}
    >
      <Image
        source={{ uri: item.urls.small }}
        style={[styles.stockPhoto, { height: item.displayHeight }]}
        resizeMode="cover"
      />
      <Text style={styles.attribution} numberOfLines={1}>
        {item.user.name}
      </Text>
    </Pressable>
  );

  const isEmpty = stockPhotos.length === 0;
  const hasSearched = lastSubmittedQueryRef.current.length > 0;

  if (showStockBrowser) {
    return (
      <Modal visible={visible} animationType="slide" onRequestClose={handleCloseAll}>
        <View style={styles.stockContainer}>
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

          <View style={styles.stockSearchWrap}>
            <Search
              value={stockQuery}
              onChangeText={setStockQuery}
              placeholder="Search Stock Photos"
              onSubmitEditing={handleSearchSubmit}
            />
          </View>

          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.gridContent}
            onScroll={handleScroll}
            scrollEventThrottle={400}
            showsVerticalScrollIndicator={false}
          >
            {isEmpty && stockLoading ? (
              <ActivityIndicator
                style={styles.loader}
                size="large"
                color={colors.icon.bold}
              />
            ) : isEmpty ? (
              <Text style={styles.emptyText}>
                {hasSearched ? 'No photos found' : 'Search for stock photos'}
              </Text>
            ) : (
              <View style={styles.columnsRow}>
                <View style={styles.column}>{columns.left.map(renderPhoto)}</View>
                <View style={styles.column}>{columns.right.map(renderPhoto)}</View>
              </View>
            )}

            {!isEmpty && stockLoading && (
              <ActivityIndicator
                style={styles.loader}
                size="small"
                color={colors.icon.bold}
              />
            )}
          </ScrollView>

          <View style={styles.unsplashCredit}>
            <Text style={styles.creditText}>Photos provided by Unsplash</Text>
          </View>
        </View>
      </Modal>
    );
  }

  // ─── Main modal (choose option) ─────────────────────────
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.cardOuter} onPress={(e) => e.stopPropagation()}>
          <View style={styles.cardInner}>
            <View style={styles.textGroup}>
              <Text style={styles.title}>Add profile photo</Text>
            </View>

            <View style={styles.buttons}>
              <Button emphasis="Bold" label="Choose from Gallery" onPress={handleGallery} />
              <Button emphasis="Subtle" label="Take Photo" onPress={handleCamera} />
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
  // Main modal
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
    borderWidth: borderWidth.regular,
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

  buttons: {
    gap: spacer['12'],
  },

  // Stock photo browser
  stockContainer: {
    flex: 1,
    backgroundColor: colors.surface.bold,
  },

  stockHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: spacer['24'],
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['12'],
  },

  stockSearchWrap: {
    paddingHorizontal: spacer['24'],
    paddingBottom: spacer['24'],
  },

  scroll: {
    flex: 1,
  },

  gridContent: {
    paddingHorizontal: GRID_PADDING,
    paddingBottom: spacer['24'],
  },

  // Two columns side-by-side, each stacks photos vertically.
  // Photos preserve their native aspect ratio (height computed from item).
  columnsRow: {
    flexDirection: 'row',
    gap: GRID_GAP,
  },

  column: {
    flex: 1,
    gap: GRID_GAP,
  },

  stockPhotoWrap: {
    width: '100%',
  },

  stockPhoto: {
    width: '100%',
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
    paddingVertical: spacer['48'],
  },

  unsplashCredit: {
    paddingVertical: spacer['16'],
    paddingHorizontal: spacer['24'],
    alignItems: 'center',
    borderTopWidth: borderWidth.regular,
    borderTopColor: colors.border.subtle,
  },

  creditText: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
  },
});
