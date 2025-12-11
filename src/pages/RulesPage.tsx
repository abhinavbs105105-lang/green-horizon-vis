import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Scale, BookOpen, Clock, GraduationCap, Users, Building } from 'lucide-react';

interface SchoolRule {
  id: string;
  title: string;
  content: string;
  category: string;
  order_index: number;
}

const categoryIcons: Record<string, any> = {
  attendance: Clock,
  'dress-code': Users,
  conduct: Scale,
  academics: GraduationCap,
  facilities: Building,
  general: BookOpen,
};

const categoryLabels: Record<string, string> = {
  attendance: 'Attendance',
  'dress-code': 'Dress Code',
  conduct: 'Conduct',
  academics: 'Academics',
  facilities: 'Facilities',
  general: 'General',
};

export default function RulesPage() {
  const [rules, setRules] = useState<SchoolRule[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    const { data, error } = await supabase
      .from('school_rules')
      .select('*')
      .order('order_index', { ascending: true });

    if (!error && data) {
      setRules(data);
    }
    setLoading(false);
  };

  const groupedRules = rules.reduce((acc, rule) => {
    if (!acc[rule.category]) {
      acc[rule.category] = [];
    }
    acc[rule.category].push(rule);
    return acc;
  }, {} as Record<string, SchoolRule[]>);

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
              Guidelines
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              School Rules & Regulations
            </h1>
            <p className="font-body text-primary-foreground/80 text-base md:text-lg">
              At Vinayak International School, we believe in creating a disciplined and nurturing environment 
              that fosters academic excellence and personal growth.
            </p>
          </div>
        </div>
      </section>

      {/* Rules Content */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid gap-8 md:gap-12">
              {Object.entries(groupedRules).map(([category, categoryRules], categoryIndex) => {
                const Icon = categoryIcons[category] || BookOpen;
                return (
                  <div 
                    key={category} 
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${categoryIndex * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center shadow-soft">
                        <Icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h2 className="font-display text-xl md:text-2xl font-bold text-foreground capitalize">
                        {categoryLabels[category] || category}
                      </h2>
                    </div>
                    
                    <div className="grid gap-4">
                      {categoryRules.map((rule, index) => (
                        <div 
                          key={rule.id}
                          className="bg-card rounded-xl p-5 md:p-6 shadow-card hover:shadow-hover transition-all duration-300 hover-lift group"
                          style={{ animationDelay: `${(categoryIndex * 100) + (index * 50)}ms` }}
                        >
                          <div className="flex items-start gap-4">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                              <span className="font-display font-bold text-primary text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                                {rule.title}
                              </h3>
                              <p className="font-body text-muted-foreground text-sm md:text-base leading-relaxed">
                                {rule.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {!loading && rules.length === 0 && (
            <div className="text-center py-20 animate-fade-in">
              <Scale className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-float" />
              <p className="font-body text-muted-foreground text-lg">
                School rules will be published soon.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-card max-w-3xl mx-auto text-center animate-fade-in-up">
            <h3 className="font-display text-lg md:text-xl font-semibold text-foreground mb-4">
              Important Notice
            </h3>
            <p className="font-body text-muted-foreground text-sm md:text-base">
              These rules are designed to ensure a safe, respectful, and productive learning environment 
              for all students. Parents are requested to read these guidelines with their children and 
              ensure compliance. Violations may result in disciplinary action as deemed appropriate by 
              the school administration.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
