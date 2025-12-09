import { FileText, Download, BookOpen, Calendar, Users, Shirt } from 'lucide-react';
import { Button } from '@/components/ui/button';

const downloads = [
  {
    icon: BookOpen,
    title: 'Academic Syllabus',
    description: 'Complete syllabus for all classes from Nursery to Class 10',
    files: ['Syllabus 2024-25 (Nursery-UKG)', 'Syllabus 2024-25 (Class 1-5)', 'Syllabus 2024-25 (Class 6-10)'],
  },
  {
    icon: Calendar,
    title: 'Time Tables',
    description: 'Class-wise daily schedule and examination timetables',
    files: ['Daily Timetable', 'Exam Schedule 2024-25'],
  },
  {
    icon: FileText,
    title: 'School Policies',
    description: 'Important school policies and guidelines for parents',
    files: ['Code of Conduct', 'Leave Policy', 'Anti-Bullying Policy'],
  },
  {
    icon: Shirt,
    title: 'Uniform Guidelines',
    description: 'Complete uniform specifications for all seasons',
    files: ['Summer Uniform', 'Winter Uniform', 'Sports Uniform'],
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
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Parent Resources
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              Access important documents, guidelines, and resources for parents.
            </p>
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Downloads
            </h2>
            <p className="font-body text-muted-foreground">
              Download important documents and resources
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {downloads.map((item, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300"
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
                      {item.files.map((file, i) => (
                        <Button 
                          key={i}
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start gap-2"
                        >
                          <Download className="h-4 w-4" />
                          {file}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uniform Guidelines */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Uniform Guidelines
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Students are expected to wear the prescribed uniform neatly and properly at all times
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {uniformDetails.map((uniform, index) => (
              <div key={index} className="bg-card rounded-xl p-6 shadow-card">
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
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Users className="h-12 w-12 text-primary-foreground mx-auto mb-4" />
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
