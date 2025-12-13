import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Sparkles, Loader2, Database, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  imageUrl?: string;
}

const VISAIPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vis-ai-chat`;
  const IMAGE_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/vis-ai-image`;

  // Handle /@add command to save data
  const handleAddCommand = async (content: string): Promise<boolean> => {
    const dataToSave = content.slice(5).trim(); // Remove "/@add " prefix
    
    if (!dataToSave) {
      setMessages(prev => [...prev, 
        { role: 'user', content },
        { role: 'assistant', content: '❌ Please provide some data after /@add. Example: /@add My favorite subject is Math.' }
      ]);
      return true;
    }

    try {
      const { error } = await supabase
        .from('vis_ai_data')
        .insert({ content: dataToSave });

      if (error) throw error;

      setMessages(prev => [...prev, 
        { role: 'user', content },
        { role: 'assistant', content: `✅ Data saved successfully!\n\n📝 **Saved:** "${dataToSave}"\n\nI'll remember this information for future conversations.` }
      ]);
      
      toast({
        title: "Data Saved",
        description: "Your information has been stored successfully.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving data:', error);
      setMessages(prev => [...prev, 
        { role: 'user', content },
        { role: 'assistant', content: '❌ Sorry, there was an error saving your data. Please try again.' }
      ]);
      return true;
    }
  };

  // Handle /@image command to generate images
  const handleImageCommand = async (content: string): Promise<boolean> => {
    const prompt = content.slice(7).trim(); // Remove "/@image " prefix
    
    if (!prompt) {
      setMessages(prev => [...prev, 
        { role: 'user', content },
        { role: 'assistant', content: '❌ Please provide a description after /@image. Example: /@image a beautiful sunset over mountains' }
      ]);
      return true;
    }

    setMessages(prev => [...prev, 
      { role: 'user', content },
      { role: 'assistant', content: '🎨 Generating your image...' }
    ]);

    try {
      const response = await fetch(IMAGE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const data = await response.json();
      
      if (data.imageUrl) {
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: `✨ Here's your generated image for: "${prompt}"`,
            imageUrl: data.imageUrl,
          };
          return newMessages;
        });
      } else {
        throw new Error('No image returned');
      }
      
      return true;
    } catch (error) {
      console.error('Image generation error:', error);
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: '❌ Sorry, I couldn\'t generate that image. Please try again with a different prompt.',
        };
        return newMessages;
      });
      return true;
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const trimmedInput = input.trim();
    
    // Check for /@add command
    if (trimmedInput.toLowerCase().startsWith('/@add')) {
      setInput('');
      setIsLoading(true);
      await handleAddCommand(trimmedInput);
      setIsLoading(false);
      return;
    }

    // Check for /@image command
    if (trimmedInput.toLowerCase().startsWith('/@image')) {
      setInput('');
      setIsLoading(true);
      await handleImageCommand(trimmedInput);
      setIsLoading(false);
      return;
    }

    const userMessage: Message = { role: 'user', content: trimmedInput };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      });

      if (!response.ok || !response.body) {
        throw new Error('Failed to get response');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

      // Add empty assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = {
                  role: 'assistant',
                  content: assistantContent,
                };
                return newMessages;
              });
            }
          } catch {
            // Incomplete JSON, wait for more data
          }
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header */}
      <div className="bg-primary/5 border-b border-primary/10 py-8">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-2"
          >
            <div className="p-3 bg-primary rounded-xl">
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary">
              VIS-AI
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm text-muted-foreground font-medium tracking-wide"
          >
            Powered by ZyReX Nano-1
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-foreground/80 max-w-2xl mx-auto"
          >
            Your intelligent study companion. Ask questions about any subject, get explanations, and learn better!
          </motion.p>
        </div>
      </div>

      {/* Chat Container */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <Card className="h-[60vh] flex flex-col shadow-xl border-primary/10">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Bot className="h-16 w-16 mx-auto mb-4 text-primary/30" />
                  <p className="text-lg">Start a conversation with VIS-AI!</p>
                  <p className="text-sm mt-2">Ask about any subject or topic you'd like to learn.</p>
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg text-left space-y-2">
                    <p className="text-xs font-medium flex items-center gap-1">
                      <Database className="h-3 w-3" /> Tip: Use <code className="bg-primary/10 px-1 rounded">/@add</code> to save information
                    </p>
                    <p className="text-xs font-medium flex items-center gap-1">
                      <ImageIcon className="h-3 w-3" /> Tip: Use <code className="bg-primary/10 px-1 rounded">/@image</code> to generate images
                    </p>
                  </div>
                </div>
              </div>
            )}
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.role === 'assistant' && (
                    <div className="p-2 bg-primary rounded-lg h-fit">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-secondary text-secondary-foreground rounded-bl-md'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    {message.imageUrl && (
                      <img 
                        src={message.imageUrl} 
                        alt="Generated" 
                        className="mt-3 rounded-lg max-w-full h-auto shadow-md"
                      />
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="p-2 bg-accent rounded-lg h-fit">
                      <User className="h-5 w-5 text-accent-foreground" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {isLoading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-3">
                <div className="p-2 bg-primary rounded-lg h-fit">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-secondary p-4 rounded-2xl rounded-bl-md">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask VIS-AI anything..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={sendMessage} 
                disabled={!input.trim() || isLoading}
                size="icon"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VISAIPage;
