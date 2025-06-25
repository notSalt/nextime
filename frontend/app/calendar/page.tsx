"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from "react";
import axios from "axios";

import { CalendarEvent } from "@/components/event-calendar";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import BigCalendar from "@/components/big-calendar";

export default function Page() {
  const router = useRouter();
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
    try {
      await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Not authenticated:", err);
      router.push("/login");
    }
  };

  checkAuth();
  }, [router]);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/events/fetch`, { withCredentials: true })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("Failed to fetch events:", err));
  }, []);

  const handleEventAdd = (event: CalendarEvent) => {
    console.log(event);
    setEvents((prev) => [...prev, event]);
  };

  const handleEventUpdate = (updatedEvent: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)),
    );
  };

  const handleEventDelete = (eventId: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
  };

  return (
    <SidebarProvider>
      <AppSidebar onNLPCreate={handleEventAdd} />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-2 pt-0">
          <BigCalendar
            events={events}
            onEventAdd={handleEventAdd}
            onEventUpdate={handleEventUpdate}
            onEventDelete={handleEventDelete}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}