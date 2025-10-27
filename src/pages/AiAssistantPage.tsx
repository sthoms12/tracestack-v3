import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Bot, Send, User } from "lucide-react";
import { useState } from "react";
interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}
export default function AiAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! How can I help you analyze your troubleshooting sessions today?", sender: 'bot' }
  ]);
  const [input, setInput] = useState("");
  const handleSend = () => {
    if (input.trim()) {
      const userMessage: Message = { id: Date.now(), text: input, sender: 'user' };
      const botMessage: Message = { id: Date.now() + 1, text: "I'm currently a read-only assistant. This feature is coming soon!", sender: 'bot' };
      setMessages(prev => [...prev, userMessage, botMessage]);
      setInput("");
    }
  };
  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="py-8 md:py-10 lg:py-12 h-full flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">AI Assistant</h1>
          </div>
          <div className="flex-grow flex flex-col bg-card border rounded-lg overflow-hidden">
            <div className="flex-1 p-6 space-y-6 overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex items-start gap-4",
                    message.sender === 'user' ? "justify-end" : "justify-start"
                  )}
                >
                  {message.sender === 'bot' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><Bot /></AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "max-w-md p-3 rounded-lg",
                      message.sender === 'user'
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    )}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                  {message.sender === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback><User /></AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
            </div>
            <div className="p-4 bg-background/80 backdrop-blur-sm border-t">
              <div className="relative">
                <Input
                  placeholder="Ask about past sessions, e.g., 'Find solutions for 502 errors'"
                  className="pr-12 h-12"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="absolute top-1/2 right-2 -translate-y-1/2"
                  onClick={handleSend}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}