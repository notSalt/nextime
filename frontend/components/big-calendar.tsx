"use client";

import {
  EventCalendar,
  CalendarEvent,
} from "@/components/event-calendar";

interface BigCalendarProps {
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (event: CalendarEvent) => void;
  onEventDelete: (eventId: string) => void;
}

export default function BigCalendar({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
}: BigCalendarProps) {
  return (
    <EventCalendar
      events={events}
      onEventAdd={onEventAdd}
      onEventUpdate={onEventUpdate}
      onEventDelete={onEventDelete}
      initialView="week"
    />
  );
}