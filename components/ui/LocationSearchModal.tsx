/**
 * LocationSearchModal — Google Places powered location search
 *
 * Features:
 *   - Google Places Autocomplete with live suggestions
 *   - Location biasing from user's current GPS (expo-location)
 *   - "Use Current Location" shortcut at top
 *   - Reusable for both Create Club and Create Event
 *
 * Anatomy:
 *   Full-screen modal overlay (cardOuter + cardInner pattern)
 *   Back button (Button Sm Icon Subtle)
 *   Search bar (Search component)
 *   "Use Current Location" row with GPS icon
 *   List of autocomplete suggestions (LocationItem)
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import * as Location from 'expo-location';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';
import {
  autocomplete,
  getPlaceDetails,
  type PlacePrediction,
  type LatLng,
} from '../../lib/services/googlePlaces';
import Button from './Button';
import Icon from './Icon';
import Search from './Search';

// ─── Types ──────────────────────────────────────────────

export type SelectedLocation = {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
};

export type LocationSearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onLocationSelected: (location: SelectedLocation) => void;
  placeholder?: string;
};

// ─── Component ──────────────────────────────────────────

export default function LocationSearchModal({
  visible,
  onClose,
  onLocationSelected,
  placeholder = 'Search Location',
}: LocationSearchModalProps) {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Get user's current location for biasing
  useEffect(() => {
    if (!visible) return;
    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setUserLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        });
      } catch {
        // Location not available — autocomplete still works, just without bias
      }
    })();
  }, [visible]);

  // Debounced autocomplete search
  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!text.trim()) {
        setPredictions([]);
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setLoading(true);
        const results = await autocomplete(text, userLocation);
        setPredictions(results);
        setLoading(false);
      }, 300);
    },
    [userLocation],
  );

  // Select a prediction → fetch details → return to parent
  const handleSelect = useCallback(
    async (prediction: PlacePrediction) => {
      setLoading(true);
      const details = await getPlaceDetails(prediction.place_id);
      setLoading(false);

      if (details) {
        onLocationSelected({
          placeId: details.place_id,
          name: details.name,
          address: details.formatted_address,
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        });
      } else {
        // Fallback — use prediction data directly
        onLocationSelected({
          placeId: prediction.place_id,
          name: prediction.structured_formatting.main_text,
          address: prediction.description,
          latitude: 0,
          longitude: 0,
        });
      }

      setQuery('');
      setPredictions([]);
      onClose();
    },
    [onLocationSelected, onClose],
  );

  // "Use Current Location" handler
  const handleUseCurrentLocation = useCallback(async () => {
    setGettingLocation(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setGettingLocation(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      // Reverse geocode to get address
      const [geo] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const name = geo?.name ?? 'Current Location';
      const parts = [geo?.street, geo?.city, geo?.region, geo?.postalCode].filter(Boolean);
      const address = parts.join(', ') || 'Current Location';

      onLocationSelected({
        placeId: 'current-location',
        name,
        address,
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      setQuery('');
      setPredictions([]);
      onClose();
    } catch {
      // Could not get location
    }
    setGettingLocation(false);
  }, [onLocationSelected, onClose]);

  const handleClose = useCallback(() => {
    setQuery('');
    setPredictions([]);
    onClose();
  }, [onClose]);

  // ─── Render ─────────────────────────────────────────────

  const renderPrediction = useCallback(
    ({ item }: { item: PlacePrediction }) => (
      <Pressable style={styles.predictionRow} onPress={() => handleSelect(item)}>
        <View style={styles.pinIconWrap}>
          <Icon type="pin drop" size={20} color={colors.icon.subtle} />
        </View>
        <View style={styles.predictionText}>
          <Text style={styles.predictionMain} numberOfLines={1}>
            {item.structured_formatting.main_text}
          </Text>
          <Text style={styles.predictionSecondary} numberOfLines={1}>
            {item.structured_formatting.secondary_text}
          </Text>
        </View>
      </Pressable>
    ),
    [handleSelect],
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        <View style={styles.modalCard}>
          <View style={styles.modalCardInner}>
            {/* Back button */}
            <View style={styles.backRow}>
              <View style={styles.backButtonWrap}>
                <Button
                  emphasis="Subtle"
                  content="Icon"
                  size="Sm"
                  icon={({ color, size }) => (
                    <Icon type="arrow backward" size={size} color={color} />
                  )}
                  onPress={handleClose}
                />
              </View>
            </View>

            {/* Search */}
            <View style={styles.searchWrap}>
              <Search
                value={query}
                onChangeText={handleQueryChange}
                placeholder={placeholder}
              />
            </View>

            {/* Use Current Location */}
            <View style={styles.currentLocationWrap}>
              <Button
                emphasis="Subtle"
                content="Text"
                size="Md"
                state={gettingLocation ? 'Loading' : 'Enabled'}
                label="User Current Location"
                leadingIcon={({ color, size }) => (
                  <Icon type="pin drop" size={size} color={color} />
                )}
                onPress={handleUseCurrentLocation}
              />
            </View>

            {/* Results */}
            <FlatList
              data={predictions}
              renderItem={renderPrediction}
              keyExtractor={(item) => item.place_id}
              style={styles.list}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={
                loading ? (
                  <ActivityIndicator
                    style={styles.loader}
                    size="small"
                    color={colors.icon.bold}
                  />
                ) : query.trim() ? (
                  <Text style={styles.emptyText}>No results found</Text>
                ) : null
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.surface.overlay,
    justifyContent: 'center',
    paddingHorizontal: spacer['24'],
  },

  modalCard: {
    width: '100%',
    height: 640,
    backgroundColor: colors.surface.subtle,
    borderRadius: borderRadius['16'],
    padding: spacer['8'],
    overflow: 'hidden',
  },

  modalCardInner: {
    flex: 1,
    borderWidth: borderWidth.regular,
    borderColor: colors.border.subtle,
    borderRadius: borderRadius['16'],
    backgroundColor: colors.surface.subtle,
    padding: spacer['16'],
    overflow: 'hidden',
  },

  backRow: {
    paddingBottom: spacer['12'],
  },

  backButtonWrap: {
    alignSelf: 'flex-start',
  },

  searchWrap: {
    paddingBottom: spacer['24'],
  },

  currentLocationWrap: {
    paddingBottom: spacer['24'],
  },

  pinIconWrap: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },

  list: {
    flex: 1,
  },

  listContent: {
    paddingVertical: spacer['8'],
  },

  predictionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacer['12'],
    paddingVertical: spacer['12'],
  },

  predictionText: {
    flex: 1,
    gap: spacer['4'],
  },

  predictionMain: {
    ...textStyles.body01Light,
    color: colors.text.bold,
  },

  predictionSecondary: {
    ...textStyles.body03Light,
    color: colors.text.subtle,
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
});
