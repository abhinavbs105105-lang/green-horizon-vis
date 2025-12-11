import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FileText, Download, BookOpen, Calendar, Users, Shirt, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ParentResource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  file_type: string;
  category: string;
}

const defaultDownloads = [
  {
    icon: BookOpen,
    title: 'Academic Syllabus',
    description: 'Complete syllabus for all classes from Nursery to Class 10',
    category: 'syllabus',
  },
  {
    icon: Calendar,
    title: 'Time Tables',
    description: 'Class-wise daily schedule and examination timetables',
    category: 'timetable',
  },
  {
    icon: FileText,
    title: 'School Policies',
    description: 'Important school policies and guidelines for parents',
    category: 'policies',
  },
  {
    icon: Shirt,
    title: 'Forms & Documents',
    description: 'Download required forms and documents',
    category: 'forms',
  },
];

const uniformDetails = [
  {
    title: 'Summer Uniform (April - October)',
    boys: ['White shirt with school logo', 'Navy blue trousers', 'Black leather shoes', 'White socks'],
    girls: ['White shirt with school logo', 'Navy blue skirt/pinafore', 'Black leather shoes', 'White socks', 'Navy blue ribbon'],
  },
  {
    title: 'Winter Uniform (November - March)',
    boys: ['White shirt with school logo', 'Navy blue trousers', 'Navy blue sweater with logo', 'Black leather shoes', 'Navy socks'],
    girls: ['White shirt with school logo', 'Navy blue skirt/pinafore', 'Navy blue sweater with logo', 'Black leather shoes', 'Navy socks', 'Navy blue ribbon'],
  },
];

export default function ParentsPage() {
  const [resources, setResources] = useState<ParentResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from('parent_resources')
      .select('*')
      .order('uploaded_at', { ascending: false });

    if (!error && data) {
      setResources(data);
    }
    setLoading(false);
  };

  const getResourcesByCategory = (category: string) => {
    return resources.filter(r => r.category === category);
  };

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-16 md:py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-accent animate-float" />
          <div className="absolute bottom-10 right-20 w-60 h-60 rounded-full bg-primary-foreground/20 animate-float delay-300" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-3xl animate-fade-in-up">
            <span className="inline-block px-4 py-1.5 bg-accent/20 text-accent rounded-full text-sm font-body font-medium mb-4">
              For Parents
            </span>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Parent Resources
            </h1>
            <p className="font-body text-primary-foreground/80 text-base md:text-lg">
              Access important documents, guidelines, and resources for parents.
            </p>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-12 md:py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12 animate-fade-in-up">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Downloads
            </h2>
            <p className="font-body text-muted-foreground">
              Download important documents and resources
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {defaultDownloads.map((item, index) => {
                const categoryResources = getResourcesByCategory(item.category);
                return (
                  <div 
                    key={index}
                    className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 hover-lift animate-fade-in-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <item.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                          {item.title}
                        </h3>
                        <p className="font-body text-sm text-muted-foreground mb-4">
                          {item.description}
                        </p>
                        <div className="space-y-2">
                          {categoryResources.length > 0 ? (
                            categoryResources.map((resource) => (
                              <a 
                                key={resource.id}
                                href={resource.file_url}
                                download={resource.file_name}
                                className="block"
                              >
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full justify-start gap-2 hover:bg-primary/5"
                                >
                                  <Download className="h-4 w-4" />
                                  {resource.title}
                                </Button>
                              </a>
                            ))
                          ) : (
                            <div className="text-center py-3 bg-secondary/50 rounded-lg">
                              <FolderOpen className="h-5 w-5 text-muted-foreground mx-auto mb-1" />
                              <p className="text-xs text-muted-foreground">Coming soon</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* General Resources */}
          {getResourcesByCategory('general').length > 0 && (
            <div className="mt-12 max-w-4xl mx-auto animate-fade-in-up delay-400">
              <h3 className="font-display text-xl font-semibold text-foreground mb-6 text-center">
                General Resources
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {getResourcesByCategory('general').map((resource) => (
                  <a 
                    key={resource.id}
                    href={resource.file_url}
                    download={resource.file_name}
                    className="block"
                  >
                    <div className="bg-card rounded-lg p-4 shadow-soft hover:shadow-card transition-all duration-300 hover-lift">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-medium text-foreground truncate">{resource.title}</h4>
                          <p className="font-body text-xs text-muted-foreground truncate">{resource.file_name}</p>
                        </div>
                        <Download className="h-4 w-4 text-primary flex-shrink-0" />
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Uniform Guidelines */}
      <section className="py-12 md:py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
              Uniform Guidelines
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Students are expected to wear the prescribed uniform neatly and properly at all times
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {uniformDetails.map((uniform, index) => (
              <div 
                key={index} 
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <h3 className="font-display text-lg font-semibold text-foreground mb-6">
                  {uniform.title}
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-body font-semibold text-primary mb-3">Boys</h4>
                    <ul className="space-y-2">
                      {uniform.boys.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-body font-semibold text-primary mb-3">Girls</h4>
                    <ul className="space-y-2">
                      {uniform.girls.map((item, i) => (
                        <li key={i} className="flex items-center gap-2 font-body text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Parent Portal Info */}
      <section className="py-12 md:py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-12 w-12 text-primary-foreground mx-auto mb-4 animate-float" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Parent-Teacher Collaboration
          </h2>
          <p className="font-body text-primary-foreground/80 max-w-2xl mx-auto mb-6">
            We believe in strong parent-teacher partnerships. Regular PTMs, parent workshops, 
            and open communication channels ensure you stay connected with your child's progress.
          </p>
          <p className="font-body text-primary-foreground/90">
            For any queries, contact us at <span className="font-semibold">enquiry@vinayakintschool.com</span>
          </p>
        </div>
      </section>
    </div>
  );
}
