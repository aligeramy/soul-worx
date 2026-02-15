import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components"
import { Tailwind } from "@react-email/tailwind"

interface EventTicketEmailProps {
  eventTitle: string
  dateLabel: string
  venueAddress: string
  purchaserName?: string
  amountPaid: string
  ticketImageUrl?: string
}

export function EventTicketEmail({
  eventTitle,
  dateLabel,
  venueAddress,
  purchaserName,
  amountPaid,
  ticketImageUrl,
}: EventTicketEmailProps) {
  return (
    <Html>
      <Head />
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#191512",
              },
            },
          },
        }}
      >
        <Preview>Your ticket for {eventTitle}</Preview>
        <Body className="bg-neutral-100 font-sans">
          <Container className="mx-auto my-8 max-w-lg rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
            <Section className="mb-6">
              <Text className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                SOULWORX PRESENTS
              </Text>
              <Heading className="mt-2 text-2xl font-bold text-neutral-900">
                {eventTitle}
              </Heading>
              <Text className="mt-1 text-neutral-600">{dateLabel}</Text>
              <Text className="mt-2 text-sm text-neutral-500">{venueAddress}</Text>
            </Section>
            <Hr className="border-neutral-200" />
            <Section className="my-6">
              <Text className="text-sm text-neutral-600">
                Hi{purchaserName ? ` ${purchaserName}` : ""}, here&apos;s your ticket. Show this (or the QR code) at the door.
              </Text>
              {ticketImageUrl ? (
                <Img
                  src={ticketImageUrl}
                  alt="Your ticket"
                  width={400}
                  className="mt-4 w-full max-w-[400px] rounded-xl border border-neutral-200"
                  style={{ maxWidth: "400px", width: "100%", height: "auto" }}
                />
              ) : (
                <Text className="mt-4 text-sm text-neutral-500">Your ticket is confirmed. Show your confirmation email at the door.</Text>
              )}
            </Section>
            <Hr className="border-neutral-200" />
            <Section>
              <Text className="text-xs text-neutral-500">
                Amount paid: {amountPaid} · Thank you for supporting the arts.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
