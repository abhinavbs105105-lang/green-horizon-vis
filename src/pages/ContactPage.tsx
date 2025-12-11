import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      contactSchema.parse(formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: error.errors[0].message,
          variant: "destructive",
        });
        return;
      }
    }

    setLoading(true);

    const { error } = await supabase.from('contact_forms').insert({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      message: formData.message,
    });

    setLoading(false);

    if (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } else {
      setIsSubmitted(true);
      toast({
        title: "Message Sent!",
        description: "We will get back to you shortly.",
      });
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4 animate-fade-in-up">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 animate-scale-in">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <h2 className="font-display text-2xl font-bold text-foreground mb-4">
            Thank You for Contacting Us!
          </h2>
          <p className="font-body text-muted-foreground mb-6">
            Your message has been received. Our team will respond within 24-48 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)} className="animate-fade-in delay-300">
            Send Another Message
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent animate-float" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-primary-foreground/20 animate-float delay-300" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-body font-medium mb-4">
              Get in Touch
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Contact Us
            </h1>
            <p className="font-body text-primary-foreground/80 text-base md:text-lg">
              We'd love to hear from you. Get in touch with us for any queries or visit our campus.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="animate-fade-in-up">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-8">
                Get in Touch
              </h2>

              <div className="space-y-5">
                {[
                  { icon: MapPin, title: 'Our Address', lines: ['Shree Ganesh City, Gijroli Bamba,', 'Agra Road, Hathras,', 'Uttar Pradesh - 204101'] },
                  { icon: Phone, title: 'Phone Numbers', lines: ['Toll-Free: 1800-890-1770', 'Office: +91 70170 24003'] },
                  { icon: Mail, title: 'Email Addresses', lines: ['General: enquiry@vinayakintschool.com', 'Admissions: admission@vinayakintschool.com'] },
                  { icon: Clock, title: 'Office Hours', lines: ['Monday - Saturday: 8:00 AM - 4:00 PM', 'Sunday: Closed'] },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-5 bg-card rounded-xl shadow-soft hover:shadow-card transition-all duration-300 hover-lift"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-foreground mb-1">{item.title}</h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="font-body text-muted-foreground text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card animate-fade-in-up delay-200">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
                Send us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Enter your name"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Subject of inquiry"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Your Message *</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Write your message here..."
                    rows={5}
                    required
                  />
                </div>

                <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>
                      Sending...
                    </span>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 md:py-16 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-4">
              Visit Our Campus
            </h2>
            <p className="font-body text-muted-foreground mb-8">
              Located in Shree Ganesh City on Agra Road, our campus is easily accessible 
              from all parts of Hathras and surrounding areas.
            </p>
            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3551.2067788261775!2d78.0538!3d27.5944!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDM1JzM5LjgiTiA3OMKwMDMnMTMuNyJF!5e0!3m2!1sen!2sin!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '300px' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Vinayak International School Location"
                  className="rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
