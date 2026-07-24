"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, X, Send, Loader2, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { MODULES } from "@/lib/modules";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Explain the current project delay",
  "Prepare a recovery schedule",
  "Forecast completion date",
  "Suggest resource optimization",
];

export function AICopilot() {
  const pathname = usePathname() ?? "";
  const activeModule = MODULES.find((m) => pathname.startsWith(m.href));
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  async function send(content: string) {
    if (!content.trim() || loading) return;
    const next = [...messages, { role: "user", content } as Message];
    setMessages(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/copilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next, module: activeModule?.slug ?? "dashboard" }),
    });
    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
    setLoading(false);
  }

  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:opacity-90"
        aria-label="Open AI Copilot"
      >
        {open ? <X className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[30rem] w-[24rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elegant">
          <div className="flex items-center gap-2 border-b border-border/60 bg-gradient-primary/10 px-4 py-3">
            <Bot className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm font-semibold">AI Copilot</span>
              <span className="text-xs text-muted-foreground">{activeModule?.name ?? "DigiCools"}</span>
            </div>
            <span className="ml-auto rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning">
              stubbed
            </span>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Ask about {activeModule?.name.toLowerCase() ?? "your project"} — try one of these:
                </p>
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="block w-full rounded-lg border border-border/60 px-3 py-2 text-left text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 text-sm",
                  m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
              >
                {m.content}
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Thinking…
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 border-t border-border/60 p-3"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask the copilot…"
              className="h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0 bg-gradient-primary" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
