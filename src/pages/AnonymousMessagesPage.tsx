import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, Search, CheckCircle, Clock, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollReveal } from "@/components/animations/ScrollReveal";

const AnonymousMessagesPage = () => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [checkCode, setCheckCode] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [foundMessage, setFoundMessage] = useState<{
    message: string;
    admin_reply: string | null;
    replied_at: string | null;
    submitted_at: string;
  } | null>(null);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter your message before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from("anonymous_messages")
        .insert({ message: message.trim() })
        .select("message_code")
        .single();

      if (error) throw error;

      setSubmittedCode(data.message_code);
      setMessage("");
      toast({
        title: "Message Sent!",
        description: "Your anonymous message has been submitted successfully.",
      });
    } catch (error) {
      console.error("Error submitting message:", error);
      toast({
        title: "Error",
        description: "Failed to submit message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckReply = async () => {
    if (!checkCode.trim()) {
      toast({
        title: "Code Required",
        description: "Please enter your message code.",
        variant: "destructive",
      });
      return;
    }

    setIsChecking(true);
    setFoundMessage(null);
    try {
      const { data, error } = await supabase
        .from("anonymous_messages")
        .select("message, admin_reply, replied_at, submitted_at")
        .eq("message_code", checkCode.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setFoundMessage(data);
      } else {
        toast({
          title: "Not Found",
          description: "No message found with this code. Please check and try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking reply:", error);
      toast({
        title: "Error",
        description: "Failed to check for reply. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4 text-center">
          <ScrollReveal>
            <MessageSquare className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Anonymous Messages</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Share your thoughts, concerns, or suggestions with the school authorities anonymously. Your identity remains completely private.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Tabs defaultValue="send" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="send" className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Message
              </TabsTrigger>
              <TabsTrigger value="check" className="flex items-center gap-2">
                <Search className="w-4 h-4" />
                Check Reply
              </TabsTrigger>
            </TabsList>

            <TabsContent value="send">
              <ScrollReveal>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-primary" />
                      Send Anonymous Message
                    </CardTitle>
                    <CardDescription>
                      Your message will be sent anonymously. Save the code you receive to check for replies later.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {submittedCode ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8 space-y-4"
                      >
                        <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                        <h3 className="text-xl font-semibold">Message Sent Successfully!</h3>
                        <p className="text-muted-foreground">
                          Save this code to check for replies:
                        </p>
                        <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 inline-block">
                          <code className="text-2xl font-mono font-bold text-primary">
                            {submittedCode}
                          </code>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Keep this code safe. You'll need it to check if the school has replied.
                        </p>
                        <Button 
                          onClick={() => setSubmittedCode(null)} 
                          variant="outline"
                          className="mt-4"
                        >
                          Send Another Message
                        </Button>
                      </motion.div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="message">Your Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Type your message here... Share your thoughts, concerns, suggestions, or feedback."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="min-h-[200px] resize-none"
                          />
                          <p className="text-xs text-muted-foreground">
                            {message.length}/1000 characters
                          </p>
                        </div>
                        <Button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !message.trim()}
                          className="w-full"
                          size="lg"
                        >
                          {isSubmitting ? (
                            <>
                              <Clock className="w-4 h-4 mr-2 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Anonymously
                            </>
                          )}
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="check">
              <ScrollReveal>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Search className="w-5 h-5 text-primary" />
                      Check for Reply
                    </CardTitle>
                    <CardDescription>
                      Enter the code you received when you submitted your message.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter your message code"
                        value={checkCode}
                        onChange={(e) => setCheckCode(e.target.value)}
                        className="font-mono"
                      />
                      <Button onClick={handleCheckReply} disabled={isChecking}>
                        {isChecking ? (
                          <Clock className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {foundMessage && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-4"
                      >
                        <div className="bg-muted rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-2">Your Message:</p>
                          <p className="text-foreground">{foundMessage.message}</p>
                          <p className="text-xs text-muted-foreground mt-2">
                            Sent: {new Date(foundMessage.submitted_at).toLocaleDateString()}
                          </p>
                        </div>

                        {foundMessage.admin_reply ? (
                          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <p className="text-sm text-primary font-medium mb-2 flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              School's Reply:
                            </p>
                            <p className="text-foreground">{foundMessage.admin_reply}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Replied: {new Date(foundMessage.replied_at!).toLocaleDateString()}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 text-center">
                            <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                            <p className="text-yellow-700 dark:text-yellow-400">
                              No reply yet. Please check back later.
                            </p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </ScrollReveal>
            </TabsContent>
          </Tabs>

          {/* Info Section */}
          <ScrollReveal delay={0.2}>
            <Card className="mt-8 bg-muted/50">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">How It Works:</h3>
                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                  <li>Write your message in the form above</li>
                  <li>Click "Send Anonymously" - no personal information is collected</li>
                  <li>Save the unique code you receive</li>
                  <li>Use the "Check Reply" tab to see if the school has responded</li>
                </ol>
              </CardContent>
            </Card>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AnonymousMessagesPage;
