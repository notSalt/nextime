"use client";

import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import * as React from "react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SidebarCalendar from "@/components/sidebar-calendar";
import { CalendarEvent } from "./event-calendar";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner";
import { format } from 'date-fns'

const data = {
  user: {
    name: "Joshua Koh",
    email: "test@notsalt.com",
    avatar:
      "https://raw.githubusercontent.com/origin-space/origin-images/refs/heads/main/exp6/user-01_l4if9t.png",
  },
};

export function AppSidebar({ onNLPCreate, ...props }: {
  onNLPCreate?: (event: CalendarEvent) => void;
} & React.ComponentProps<typeof Sidebar>) {
  const [promptText, setPromptText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Set text when done listening
  React.useEffect(() => {
    if (!listening && transcript) {
      setPromptText(transcript);
    }
  }, [listening, transcript]);

  const handleVoiceToggle = () => {
    resetTranscript();
    if (listening) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: false, language: "en-US" });
    }
  };

  return (
    <Sidebar
      variant="inset"
      {...props}
      className="dark scheme-only-dark max-lg:p-3 lg:pe-1"
    >
      <SidebarHeader>
        <div className="flex justify-between items-center gap-2">
          <Link className="inline-flex" href="/">
            <span>NexTime</span>
          </Link>
          <SidebarTrigger className="text-muted-foreground/80 hover:text-foreground/80 hover:bg-transparent!" />
        </div>
      </SidebarHeader>
      <SidebarGroup className="px-1 mt-3 pt-4 border-t">
        <SidebarGroupLabel className="uppercase text-muted-foreground/65">
          Smart Add Event
        </SidebarGroupLabel>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (!promptText) return;
            setLoading(true);

            try {
              const res = await fetch("http://localhost:5000/api/ai/parse-event", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ text: promptText }),
              });

              const parsed = await res.json();

              const saved = await fetch("http://localhost:5000/api/events/create", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                  title: parsed.title,
                  description: parsed.description || "",
                  startTime: parsed.start,
                  endTime: parsed.end,
                }),
              });

              const savedEvent = await saved.json();

              console.log("Event created:", savedEvent);
              onNLPCreate?.(savedEvent);
              setPromptText("");

              // Show toast notification when an event is updated
              toast(`Event "${savedEvent.title}" updated`, {
                description: format(new Date(savedEvent.start), "MMM d, yyyy"),
                position: "bottom-left",
              });
            } catch (err) {
              console.error("Failed to create event:", err);
            } finally {
              setLoading(false)
            }
          }}
          className="flex flex-col gap-2 mt-2"
        >
          <div className="relative">
            <Textarea
              className="h-24 text-base pr-10" // extra padding for button
              id="prompt"
              placeholder="e.g. Call with client Friday at 9am"
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              disabled={loading}
            />
            {browserSupportsSpeechRecognition && (
              <button
                type="button"
                onClick={handleVoiceToggle}
                className="absolute bottom-2 right-2 text-muted-foreground hover:text-primary"
              >
                {listening ? (
                  <div className="size-5 bg-red-500 rounded-full animate-pulse" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18v4m0 0h3m-3 0H9m6-4a3 3 0 01-6 0V5a3 3 0 016 0v9z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </div>
            ) : (
              "Add Event"
            )}
          </Button>
        </form>
      </SidebarGroup>
      <SidebarContent className="gap-0 mt-3 pt-3 border-t">
        <SidebarGroup className="px-1">
          <SidebarCalendar />
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
