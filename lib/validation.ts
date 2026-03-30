/**
 * Centralized validation rules — mirrors Supabase schema CHECK constraints
 *
 * Each validator returns null if valid, or an error message string if invalid.
 * Composite validators (validateClubForm, validateEventForm) return a
 * Record<fieldName, errorMessage | null> for per-field error display.
 */

// ─── Primitive validators ────────────────────────────────

export function validateRequired(value: string, label: string): string | null {
  return value.trim().length > 0 ? null : `${label} is required`;
}

export function validateLength(
  value: string,
  min: number,
  max: number,
  label: string,
): string | null {
  const len = value.trim().length;
  if (len === 0) return `${label} is required`;
  if (len < min) return `${label} must be at least ${min} characters`;
  if (len > max) return `${label} must be at most ${max} characters`;
  return null;
}

export function validateEmail(email: string): string | null {
  const trimmed = email.trim();
  if (!trimmed) return 'Email is required';
  // RFC-lite: local@domain.tld
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(trimmed)) return 'Please enter a valid email address';
  return null;
}

export function validateNumericRange(
  value: string,
  min: number,
  max: number,
  label: string,
  allowEmpty = false,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return allowEmpty ? null : `${label} is required`;
  const num = parseFloat(trimmed);
  if (isNaN(num)) return `${label} must be a number`;
  if (num < min) return `${label} must be at least ${min}`;
  if (num > max) return `${label} must be at most ${max}`;
  return null;
}

export function validateInteger(
  value: string,
  min: number,
  label: string,
  allowEmpty = true,
): string | null {
  const trimmed = value.trim();
  if (!trimmed) return allowEmpty ? null : `${label} is required`;
  const num = parseInt(trimmed, 10);
  if (isNaN(num) || String(num) !== trimmed) return `${label} must be a whole number`;
  if (num < min) return `${label} must be at least ${min}`;
  return null;
}

export function validateTime(hour: string, minute: string): string | null {
  if (!hour.trim() || !minute.trim()) return 'Time is required';
  const h = parseInt(hour, 10);
  const m = parseInt(minute, 10);
  if (isNaN(h) || h < 1 || h > 12) return 'Hour must be 1–12';
  if (isNaN(m) || m < 0 || m > 59) return 'Minute must be 0–59';
  return null;
}

export function validateDate(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return 'Date is required';
  // Accept MM/DD or YYYY-MM-DD
  const mmdd = /^(\d{1,2})\/(\d{1,2})$/;
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  if (mmdd.test(trimmed)) {
    const [, m, d] = trimmed.match(mmdd)!;
    const month = parseInt(m, 10);
    const day = parseInt(d, 10);
    if (month < 1 || month > 12) return 'Month must be 1–12';
    if (day < 1 || day > 31) return 'Day must be 1–31';
    return null;
  }
  if (iso.test(trimmed)) {
    const parsed = new Date(trimmed);
    if (isNaN(parsed.getTime())) return 'Invalid date';
    return null;
  }
  return 'Date must be MM/DD or YYYY-MM-DD';
}

// ─── Composite: Club form ────────────────────────────────

export type ClubFormErrors = {
  name: string | null;
  fee: string | null;
  capacity: string | null;
  description: string | null;
};

export function validateClubForm(fields: {
  name: string;
  feeValue: string;
  capacity: string;
  description: string;
}): ClubFormErrors {
  return {
    // schema: char_length(name) BETWEEN 2 AND 80
    name: validateLength(fields.name, 2, 80, 'Club name'),
    // schema: fee_amount >= 0 AND fee_amount <= 9999
    fee: validateNumericRange(fields.feeValue, 0, 9999, 'Fee'),
    // schema: capacity IS NULL OR capacity >= 1
    capacity: validateInteger(fields.capacity, 1, 'Capacity', true),
    // schema: char_length(description) <= 2000
    description: fields.description.trim().length > 2000
      ? 'Description must be at most 2000 characters'
      : null,
  };
}

export function hasClubErrors(errors: ClubFormErrors): boolean {
  return Object.values(errors).some((e) => e !== null);
}

// ─── Composite: Event form ───────────────────────────────

export type EventFormErrors = {
  name: string | null;
  date: string | null;
  time: string | null;
  fee: string | null;
  capacity: string | null;
  description: string | null;
};

export function validateEventForm(fields: {
  name: string;
  isRecurring: boolean;
  dateValue: string;
  selectedDays: number[];
  hourValue: string;
  minuteValue: string;
  dayTimes?: Record<number, { hour: string; minute: string }>;
  feeValue: string;
  capacity: string;
  description: string;
}): EventFormErrors {
  // Date: one-time needs a date string; recurring needs ≥1 selected day
  let dateError: string | null = null;
  if (fields.isRecurring) {
    dateError = fields.selectedDays.length > 0 ? null : 'Select at least one day';
  } else {
    dateError = validateDate(fields.dateValue);
  }

  // Time: one-time uses hourValue/minuteValue; recurring checks each day
  let timeError: string | null = null;
  if (fields.isRecurring && fields.dayTimes) {
    for (const d of fields.selectedDays) {
      const t = fields.dayTimes[d];
      if (t) {
        const err = validateTime(t.hour, t.minute);
        if (err) {
          timeError = err;
          break;
        }
      } else {
        timeError = 'Time is required for each selected day';
        break;
      }
    }
  } else if (!fields.isRecurring) {
    timeError = validateTime(fields.hourValue, fields.minuteValue);
  }

  return {
    // schema: char_length(name) BETWEEN 2 AND 80
    name: validateLength(fields.name, 2, 80, 'Event name'),
    date: dateError,
    time: timeError,
    // schema: fee_amount >= 0 AND fee_amount <= 9999
    fee: validateNumericRange(fields.feeValue, 0, 9999, 'Fee'),
    // schema: capacity IS NULL OR capacity >= 1
    capacity: validateInteger(fields.capacity, 1, 'Capacity', true),
    // schema: char_length(description) <= 2000
    description: fields.description.trim().length > 2000
      ? 'Description must be at most 2000 characters'
      : null,
  };
}

export function hasEventErrors(errors: EventFormErrors): boolean {
  return Object.values(errors).some((e) => e !== null);
}
