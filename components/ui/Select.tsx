/**
 * Select component — mapped from Figma component documentation
 *
 * Props (from Figma properties):
 *   items: string[] — list of selectable options
 *   selectedValue?: string — currently selected value
 *   placeholder?: string — placeholder text when no value selected
 *   onSelect?: (value: string) => void — callback when an item is selected
 *   style?: ViewStyle — optional container style override
 *
 * States: Enabled | Active | Selected/Filled (managed internally)
 *
 * Anatomy (from Figma docs):
 *   Shape: pill (borderRadius round), borderWidth 0.5
 *   Border: border/subtle default, border/bold when active
 *   Padding: spacer/12 all around
 *   Text: body03Light, text/subtle placeholder, text/bold value
 *   Trailing icon: 12px expand more (chevron-down), icon/subtle when enabled, icon/bold when active/selected
 *   Dropdown: white bg, border 0.5 border/bold, borderRadius 16, padding spacer/16, gap spacer/16
 *   SelectItem: row with label (body03Light, text/bold) and check icon for selected item
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Modal,
  StyleSheet,
  type ViewStyle,
} from 'react-native';
import Icon from './Icon';
import { colors } from '../../lib/tokens/colors';
import { spacer, borderRadius, borderWidth } from '../../lib/tokens/spacing';
import { textStyles } from '../../lib/tokens/textStyles';

// ─── Types ──────────────────────────────────────────────

export type SelectProps = {
  items: string[];
  selectedValue?: string;
  placeholder?: string;
  onSelect?: (value: string) => void;
  style?: ViewStyle;
};

// ─── SelectItem (internal) ──────────────────────────────

function SelectItem({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.item} onPress={onPress}>
      <Text style={styles.itemLabel} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.itemIconWrap}>
        {selected && (
          <Icon type="check" size={12} color={colors.icon.bold} />
        )}
      </View>
    </Pressable>
  );
}

// ─── Component ──────────────────────────────────────────

export default function Select({
  items,
  selectedValue,
  placeholder = 'Select',
  onSelect,
  style,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0, width: 0 });
  const triggerRef = useRef<View>(null);

  const hasValue = selectedValue != null && selectedValue !== '';
  const isActive = open;

  const borderColor = isActive
    ? colors.border.bold
    : colors.border.subtle;

  const textColor = hasValue ? colors.text.bold : colors.text.subtle;
  const iconColor = isActive || hasValue ? colors.icon.bold : colors.icon.subtle;

  const handleOpen = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownPosition({ x, y: y + height + 4, width });
      setOpen(true);
    });
  };

  const handleSelect = (value: string) => {
    onSelect?.(value);
    setOpen(false);
  };

  return (
    <View style={style}>
      <Pressable onPress={handleOpen}>
        <View
          ref={triggerRef}
          style={[styles.container, { borderColor }]}
        >
          <Text
            style={[styles.text, { color: textColor }]}
            numberOfLines={1}
          >
            {hasValue ? selectedValue : placeholder}
          </Text>
          <View style={styles.iconWrap}>
            <Icon type="collapsed" size={12} color={iconColor} />
          </View>
        </View>
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View
            style={[
              styles.dropdown,
              {
                position: 'absolute',
                top: dropdownPosition.y,
                left: dropdownPosition.x,
                width: dropdownPosition.width,
              },
            ]}
          >
            {items.map((item) => (
              <SelectItem
                key={item}
                label={item}
                selected={item === selectedValue}
                onPress={() => handleSelect(item)}
              />
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacer['12'],
    borderRadius: borderRadius.round,
    borderWidth: borderWidth.thin,
    overflow: 'hidden',
  },

  text: {
    flex: 1,
    ...textStyles.body03Light,
    padding: 0,
    margin: 0,
  },

  iconWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginLeft: spacer['8'],
  },

  backdrop: {
    flex: 1,
  },

  dropdown: {
    backgroundColor: colors.surface.bold,
    borderWidth: borderWidth.thin,
    borderColor: colors.border.bold,
    borderRadius: borderRadius['16'],
    padding: spacer['16'],
    gap: spacer['16'],
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  itemLabel: {
    flex: 1,
    ...textStyles.body03Light,
    color: colors.text.bold,
  },

  itemIconWrap: {
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
