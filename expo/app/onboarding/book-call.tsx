import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUser } from '@/contexts/UserContext';
import { SoulworxColors, Spacing, Typography, BorderRadius, Shadows } from '@/constants/colors';
import { apiGet, apiPost } from '@/lib/api-client';
import { format, addDays, startOfDay, isBefore } from 'date-fns';
import { Linking } from 'react-native';

const TIME_SLOTS = [
  { label: '12:00 PM', value: 12 },
  { label: '1:00 PM', value: 13 },
  { label: '2:00 PM', value: 14 },
  { label: '3:00 PM', value: 15 },
  { label: '4:00 PM', value: 16 },
  { label: '5:00 PM', value: 17 },
];

export default function BookCallScreen() {
  const insets = useSafeAreaInsets();
  const { user, tier } = useUser();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<number | null>(null);
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [meetLink, setMeetLink] = useState<string | null>(null);

  const today = startOfDay(new Date());
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(today, i));

  useEffect(() => {
    if (user?.role === 'admin' || user?.role === 'super_admin') {
      router.replace('/(tabs)' as any);
      return;
    }
    if (tier?.level !== 'pro_plus') {
      router.replace('/(tabs)/programs');
      return;
    }
    fetchAvailability();
  }, [tier, user?.role]);

  const fetchAvailability = async () => {
    try {
      const data = await apiGet<{ bookedDates: string[] }>(
        `/api/coach-calls/availability?startDate=${today.toISOString()}&endDate=${addDays(today, 30).toISOString()}`
      );
      setBookedDates(new Set(data.bookedDates || []));
    } catch (error) {
      console.error('Error fetching availability:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBook = async () => {
    if (!selectedDate || selectedTime === null) {
      Alert.alert('Missing Information', 'Please select a date and time');
      return;
    }

    setIsBooking(true);
    try {
      const scheduledAt = new Date(selectedDate);
      scheduledAt.setHours(selectedTime, 0, 0, 0);

      const data = await apiPost<{ coachCall: { googleMeetLink: string } }>('/api/coach-calls/book', {
        scheduledAt: scheduledAt.toISOString(),
        duration: 60,
      });

      setMeetLink(data.coachCall?.googleMeetLink || null);
      setBookingSuccess(true);
    } catch (error: any) {
      console.error('Error booking call:', error);
      Alert.alert('Error', error.message || 'Failed to book call');
    } finally {
      setIsBooking(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={SoulworxColors.gold} />
      </View>
    );
  }

  if (bookingSuccess) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
      >
        <View style={styles.successContainer}>
          <Ionicons name="checkmark-circle" size={80} color={SoulworxColors.success} />
          <Text style={styles.successTitle}>Call Booked Successfully!</Text>
          <Text style={styles.successText}>
            Your coach call is scheduled for {selectedDate && format(selectedDate, 'MMMM d, yyyy')} at{' '}
            {selectedTime && TIME_SLOTS.find((slot) => slot.value === selectedTime)?.label}
          </Text>
          {meetLink && (
            <TouchableOpacity
              style={styles.meetButton}
              onPress={() => {
                if (meetLink) {
                  Linking.openURL(meetLink).catch((err) => {
                    console.error('Error opening Meet link:', err);
                    Alert.alert('Error', 'Could not open Google Meet link');
                  });
                }
              }}
            >
              <Ionicons name="videocam" size={20} color={SoulworxColors.white} />
              <Text style={styles.meetButtonText}>Open Google Meet</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => router.replace('/(tabs)/programs')}
          >
            <Text style={styles.continueButtonText}>Continue to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={[styles.content, { paddingTop: insets.top + Spacing.lg }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={SoulworxColors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book Coach Call</Text>
      </View>

      <Text style={styles.subtitle}>Schedule your personalized coaching session</Text>

      {/* Date Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Date</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesContainer}>
          {availableDates.map((date) => {
            const dateKey = format(date, 'yyyy-MM-dd');
            const isBooked = bookedDates.has(dateKey);
            const isSelected = selectedDate && format(selectedDate, 'yyyy-MM-dd') === dateKey;
            const isPast = isBefore(date, today);

            return (
              <TouchableOpacity
                key={dateKey}
                style={[
                  styles.dateButton,
                  isSelected && styles.dateButtonSelected,
                  (isBooked || isPast) && styles.dateButtonDisabled,
                ]}
                onPress={() => !isBooked && !isPast && setSelectedDate(date)}
                disabled={isBooked || isPast}
              >
                <Text style={[styles.dateText, isSelected && styles.dateTextSelected]}>
                  {format(date, 'EEE')}
                </Text>
                <Text style={[styles.dateNumber, isSelected && styles.dateNumberSelected]}>
                  {format(date, 'd')}
                </Text>
                {isBooked && <Ionicons name="close-circle" size={16} color={SoulworxColors.error} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Time Selection */}
      {selectedDate && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Time</Text>
          <View style={styles.timesContainer}>
            {TIME_SLOTS.map((slot) => (
              <TouchableOpacity
                key={slot.value}
                style={[
                  styles.timeButton,
                  selectedTime === slot.value && styles.timeButtonSelected,
                ]}
                onPress={() => setSelectedTime(slot.value)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === slot.value && styles.timeTextSelected,
                  ]}
                >
                  {slot.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Book Button */}
      <TouchableOpacity
        style={[
          styles.bookButton,
          (!selectedDate || selectedTime === null || isBooking) && styles.bookButtonDisabled,
        ]}
        onPress={handleBook}
        disabled={!selectedDate || selectedTime === null || isBooking}
      >
        {isBooking ? (
          <ActivityIndicator color={SoulworxColors.white} />
        ) : (
          <>
            <Ionicons name="calendar" size={20} color={SoulworxColors.white} />
            <Text style={styles.bookButtonText}>Book Coach Call</Text>
          </>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: SoulworxColors.beige,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  backButton: {
    marginRight: Spacing.md,
  },
  headerTitle: {
    flex: 1,
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  subtitle: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xl,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginBottom: Spacing.md,
  },
  datesContainer: {
    marginHorizontal: -Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  dateButton: {
    width: 70,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.charcoal,
    alignItems: 'center',
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
  },
  dateButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  dateButtonDisabled: {
    opacity: 0.5,
  },
  dateText: {
    fontSize: Typography.xs,
    color: SoulworxColors.textSecondary,
    marginBottom: Spacing.xs,
  },
  dateTextSelected: {
    color: SoulworxColors.gold,
    fontWeight: Typography.bold,
  },
  dateNumber: {
    fontSize: Typography.xl,
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
  },
  dateNumberSelected: {
    color: SoulworxColors.gold,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  timeButton: {
    flex: 1,
    minWidth: '30%',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    backgroundColor: SoulworxColors.charcoal,
    borderWidth: 2,
    borderColor: SoulworxColors.border,
    alignItems: 'center',
  },
  timeButtonSelected: {
    borderColor: SoulworxColors.gold,
    backgroundColor: `${SoulworxColors.gold}20`,
  },
  timeText: {
    fontSize: Typography.base,
    color: SoulworxColors.textPrimary,
  },
  timeTextSelected: {
    color: SoulworxColors.gold,
    fontWeight: Typography.bold,
  },
  bookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: SoulworxColors.gold,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginTop: Spacing.lg,
    ...Shadows.medium,
  },
  bookButtonDisabled: {
    opacity: 0.5,
  },
  bookButtonText: {
    fontSize: Typography.lg,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
  },
  successTitle: {
    fontSize: Typography['3xl'],
    fontWeight: Typography.bold,
    color: SoulworxColors.textPrimary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  successText: {
    fontSize: Typography.base,
    color: SoulworxColors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
  },
  meetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#34A853',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.md,
  },
  meetButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.semibold,
    color: SoulworxColors.white,
  },
  continueButton: {
    backgroundColor: SoulworxColors.gold,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    marginTop: Spacing.lg,
  },
  continueButtonText: {
    fontSize: Typography.base,
    fontWeight: Typography.bold,
    color: SoulworxColors.white,
  },
});
