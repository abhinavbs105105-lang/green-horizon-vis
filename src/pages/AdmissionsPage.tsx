import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Phone, Mail, MapPin, FileText, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';

const classes = ['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'];

const admissionSchema = z.object({
  studentName: z.string().min(2, 'Student name must be at least 2 characters').max(100),
  parentName: z.string().min(2, 'Parent name must be at least 2 characters').max(100),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(15),
  classApplying: z.string().min(1, 'Please select a class'),
});

export default function AdmissionsPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    email: '',
    phone: '',
    classApplying: '',
    dateOfBirth: '',
    address: '',
    previousSchool: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      admissionSchema.parse(formData);
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

    const { error } = await supabase.from('admission_forms').insert({
      student_name: formData.studentName,
      parent_name: formData.parentName,
      email: formData.email,
      phone: formData.phone,
      class_applying: formData.classApplying,
      date_of_birth: formData.dateOfBirth,
      address: formData.address,
      previous_school: formData.previousSchool || null,
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
        title: "Application Submitted!",
        description: "We will contact you shortly regarding your admission inquiry.",
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
            Application Submitted Successfully!
          </h2>
          <p className="font-body text-muted-foreground mb-6">
            Thank you for your interest in Vinayak International School. 
            Our admissions team will contact you within 2-3 business days.
          </p>
          <Button onClick={() => setIsSubmitted(false)} className="animate-fade-in delay-300">
            Submit Another Application
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
              Join Us
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Admissions
            </h1>
            <p className="font-body text-primary-foreground/80 text-base md:text-lg">
              Begin your child's journey towards excellence. Apply for admission today.
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Contact Info */}
            <div className="space-y-6 animate-fade-in-up">
              <h2 className="font-display text-xl md:text-2xl font-bold text-foreground">
                Admission Enquiries
              </h2>
              
              <div className="space-y-4">
                {[
                  { icon: Phone, title: 'Toll-Free Number', lines: ['1800-890-1770', '+91 70170 24003'] },
                  { icon: Mail, title: 'Email', lines: ['admission@vinayakintschool.com'] },
                  { icon: MapPin, title: 'Visit Us', lines: ['Shree Ganesh City, Gijroli Bamba,', 'Agra Road, Hathras, UP 204101'] },
                ].map((item, index) => (
                  <div 
                    key={index}
                    className="flex items-start gap-4 p-4 bg-card rounded-lg shadow-soft hover:shadow-card transition-all duration-300 hover-lift"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <item.icon className="h-5 w-5 text-primary mt-1" />
                    <div>
                      <h3 className="font-body font-semibold text-foreground">{item.title}</h3>
                      {item.lines.map((line, i) => (
                        <p key={i} className="font-body text-muted-foreground text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-primary/5 rounded-lg p-6 animate-fade-in-up delay-300">
                <h3 className="font-display font-semibold text-foreground mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Admission Process
                </h3>
                <ol className="space-y-2 font-body text-sm text-muted-foreground">
                  {[
                    'Fill the online application form',
                    'Submit required documents',
                    'Attend interaction session',
                    'Complete fee payment',
                    'Collect admission confirmation',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-semibold text-primary">{i + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Application Form */}
            <div className="lg:col-span-2 animate-fade-in-up delay-200">
              <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card">
                <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-6">
                  Online Application Form
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name *</Label>
                      <Input
                        id="studentName"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="Enter student's full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="parentName">Parent/Guardian Name *</Label>
                      <Input
                        id="parentName"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="Enter parent's full name"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="Enter email address"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="Enter phone number"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="classApplying">Applying for Class *</Label>
                      <Select
                        value={formData.classApplying}
                        onValueChange={(value) => setFormData({ ...formData, classApplying: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                          {classes.map((cls) => (
                            <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input
                        id="dob"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="previousSchool">Previous School (if any)</Label>
                    <Input
                      id="previousSchool"
                      value={formData.previousSchool}
                      onChange={(e) => setFormData({ ...formData, previousSchool: e.target.value })}
                      placeholder="Enter previous school name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></span>
                        Submitting...
                      </span>
                    ) : (
                      'Submit Application'
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
