export type CalendarView = "month" | "week" | "day" | "agenda";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  color?: EventColor;
  label?: string;
  location?: string;
  allDay?: boolean;
}

export type EventColor = "blue" | "orange" | "violet" | "rose" | "emerald";
