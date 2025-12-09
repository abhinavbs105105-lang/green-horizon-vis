import { GraduationCap, Award, BookOpen, Users } from 'lucide-react';

const departments = [
  { name: 'Pre-Primary', teachers: 8 },
  { name: 'Primary', teachers: 15 },
  { name: 'Mathematics', teachers: 6 },
  { name: 'Science', teachers: 8 },
  { name: 'English', teachers: 5 },
  { name: 'Hindi', teachers: 4 },
  { name: 'Social Studies', teachers: 4 },
  { name: 'Computer Science', teachers: 3 },
  { name: 'Physical Education', teachers: 3 },
  { name: 'Arts & Music', teachers: 4 },
];

const facultyFeatures = [
  {
    icon: GraduationCap,
    title: 'Qualified Educators',
    description: 'All our teachers hold advanced degrees and teaching certifications from recognized institutions.',
  },
  {
    icon: Award,
    title: 'Experienced Professionals',
    description: 'Our faculty brings years of teaching experience and subject matter expertise.',
  },
  {
    icon: BookOpen,
    title: 'Continuous Training',
    description: 'Regular professional development workshops keep our teachers updated with modern methodologies.',
  },
  {
    icon: Users,
    title: 'Dedicated Support',
    description: 'Small class sizes ensure personalized attention for every student.',
  },
];

export default function FacultyPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Faculty & Staff
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              Meet the dedicated educators who shape the future of our students.
            </p>
          </div>
        </div>
      </section>

      {/* Faculty Features */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Excellence in Teaching
            </h2>
            <p className="font-body text-muted-foreground">
              Our faculty is the backbone of VIS. We take pride in our team of highly qualified 
              and passionate educators who go above and beyond to ensure student success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {facultyFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 text-center group"
              >
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Departments
            </h2>
            <p className="font-body text-muted-foreground">
              Specialized faculty across all subject areas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
            {departments.map((dept, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-5 shadow-soft text-center hover:shadow-hover transition-all duration-300 hover:-translate-y-1"
              >
                <h3 className="font-display font-semibold text-foreground mb-1">
                  {dept.name}
                </h3>
                <p className="font-body text-sm text-primary font-medium">
                  {dept.teachers} Teachers
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="inline-flex items-center gap-8 bg-card rounded-2xl p-8 shadow-card">
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-primary">50+</div>
                <div className="font-body text-muted-foreground">Total Faculty</div>
              </div>
              <div className="w-px h-16 bg-border" />
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-primary">10+</div>
                <div className="font-body text-muted-foreground">Departments</div>
              </div>
              <div className="w-px h-16 bg-border" />
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-primary">1:20</div>
                <div className="font-body text-muted-foreground">Teacher Ratio</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Join Our Team */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Join Our Teaching Family
          </h2>
          <p className="font-body text-primary-foreground/80 max-w-2xl mx-auto mb-6">
            Are you a passionate educator looking for an opportunity to make a difference? 
            We are always looking for talented individuals to join our team.
          </p>
          <p className="font-body text-primary-foreground/90">
            Send your resume to: <span className="font-semibold">careers@vinayakintschool.com</span>
          </p>
        </div>
      </section>
    </div>
  );
}
