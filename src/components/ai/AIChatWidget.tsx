import { useState, useRef, useCallback } from "react";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { MessageCircle, X, Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/integrations/supabase/client";

interface Message {
  role: "user" | "assistant";
  content: string;
  isStreaming?: boolean;
}

const EDGE_FUNCTION_NAME = "ai-chat";

function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const abortControllerRef = useRef<AbortController | null>(null);

  const sendMessage = useCallback(
    async (content: string) => {
      abortControllerRef.current = new AbortController();

      const userMessage: Message = { role: "user", content };
      const assistantMessage: Message = { role: "assistant", content: "", isStreaming: true };
      const history = [...messages, userMessage];

      setMessages((prev) => [...prev, userMessage, assistantMessage]);
      setIsLoading(true);
      setError(null);

      try {
        await fetchEventSource(`${SUPABASE_URL}/functions/v1/${EDGE_FUNCTION_NAME}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
            "X-Session-ID": sessionIdRef.current,
          },
          body: JSON.stringify({ messages: history }),
          signal: abortControllerRef.current.signal,
          async onopen(response) {
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
              if (contentType?.includes("text/event-stream")) {
                const text = await response.text();
                const dataMatch = text.match(/data: (.+)/);
                if (dataMatch) {
                  try {
                    const errorData = JSON.parse(dataMatch[1]);
                    const message = errorData.error?.message;
                    if (message) throw new Error(message);
                  } catch (parseError) {
                    if (parseError instanceof Error && parseError.message !== "Unexpected token") {
                      throw parseError;
                    }
                  }
                }
              }
              throw new Error(`Request failed: ${response.status}`);
            }
          },
          onmessage(event) {
            if (!event.data || event.data === "[DONE]") return;
            const data = JSON.parse(event.data);

            if (data.error) {
              setError(data.error.message || "Service error");
              setMessages((prev) => prev.slice(0, -1));
              setIsLoading(false);
              return;
            }

            const text = data.candidates?.[0]?.content?.parts
              ?.map((part: { text?: string }) => part.text || "")
              .join("");

            if (text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  last.content = (last.content || "") + text;
                }
                return updated;
              });
            }

            if (data.candidates?.[0]?.finishReason) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") last.isStreaming = false;
                return updated;
              });
              setIsLoading(false);
            }
          },
          onerror(err) {
            throw err;
          },
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          setError(err.message || "Failed to send message");
          setMessages((prev) => prev.slice(0, -1));
        }
      } finally {
        setIsLoading(false);
      }
    },
    [messages]
  );

  return { messages, isLoading, error, sendMessage };
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isLoading, error, sendMessage } = useAIChat();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <>
      <Button
        onClick={() => setOpen((v) => !v)}
        size="icon"
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-primary shadow-glow hover:opacity-90"
        aria-label="Open AI assistant"
      >
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-elegant">
          <div className="flex items-center gap-2 border-b border-border/60 bg-gradient-primary/10 px-4 py-3">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">DigiCools AI Assistant</span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {messages.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Tell me what you're looking for — e.g. "I need a resume template" or "Canva wedding templates".
              </p>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-xl px-3 py-2 text-sm whitespace-pre-wrap",
                  m.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted text-foreground"
                )}
              >
                {m.content}
                {m.isStreaming && !m.content && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              </div>
            ))}
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border/60 p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for a product..."
              className="h-9"
            />
            <Button type="submit" size="icon" className="h-9 w-9 shrink-0 bg-gradient-primary" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </>
  );
}
