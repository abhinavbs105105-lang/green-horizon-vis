import { GraduationCap, Target, Eye, Award, Quote } from 'lucide-react';

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              About Our School
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              Nurturing excellence since our inception, VIS stands as a pillar of quality education in Hathras.
            </p>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Objective */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-card rounded-xl p-8 shadow-card hover:shadow-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Eye className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Our Vision</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                To be a premier educational institution that fosters academic excellence, 
                character development, and global citizenship, preparing students to thrive 
                in an ever-changing world.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-card hover:shadow-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Our Mission</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                To provide a nurturing and stimulating learning environment that encourages 
                intellectual curiosity, creativity, and personal growth while instilling 
                values of integrity, respect, and responsibility.
              </p>
            </div>

            <div className="bg-card rounded-xl p-8 shadow-card hover:shadow-hover transition-all duration-300">
              <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                <Award className="h-7 w-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-bold text-foreground mb-4">Our Objective</h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                To develop well-rounded individuals who possess strong academic foundations, 
                critical thinking skills, and the confidence to pursue their passions and 
                make meaningful contributions to society.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* School Motto */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Quote className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6 italic">
              "Knowledge and Punctuality for a Bright and Harmonious Life."
            </h2>
            <p className="font-body text-muted-foreground text-lg max-w-2xl mx-auto">
              Our motto encapsulates our belief that academic excellence, combined with 
              discipline and time management, forms the foundation for a successful and fulfilling life.
            </p>
          </div>
        </div>
      </section>

      {/* Classes Offered */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Classes Offered
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              We offer comprehensive education from early childhood through secondary level
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {['Nursery', 'LKG', 'UKG', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10'].map((className, index) => (
              <div 
                key={index}
                className="bg-card rounded-lg p-4 shadow-soft text-center hover:shadow-hover transition-all duration-300 hover:bg-primary hover:text-primary-foreground group"
              >
                <GraduationCap className="h-6 w-6 mx-auto mb-2 text-primary group-hover:text-primary-foreground" />
                <span className="font-body font-medium text-sm">{className}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="py-20 bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="font-body font-semibold text-accent text-sm uppercase tracking-wider">
                Principal's Message
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mt-2 mb-6">
                A Message from Our Principal
              </h2>
              <div className="font-body text-primary-foreground/90 space-y-4 leading-relaxed">
                <p>
                  Dear Parents and Students,
                </p>
                <p>
                  Welcome to Vinayak International School! As the Principal, I am delighted to share 
                  our vision of providing an exceptional educational experience that prepares students 
                  for the challenges and opportunities of the 21st century.
                </p>
                <p>
                  At VIS, we believe that every child has unique potential waiting to be discovered 
                  and nurtured. Our dedicated faculty works tirelessly to create an environment where 
                  curiosity is encouraged, creativity is celebrated, and character is built.
                </p>
                <p>
                  We are committed to academic excellence while ensuring our students develop into 
                  compassionate, responsible, and well-rounded individuals. I invite you to join our 
                  VIS family and be part of this transformative educational journey.
                </p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="bg-primary-foreground/10 backdrop-blur-sm rounded-2xl p-8 max-w-sm text-center">
                <div className="w-32 h-32 rounded-full bg-primary-foreground/20 mx-auto mb-6 flex items-center justify-center">
                  <GraduationCap className="h-16 w-16" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-2">Kareena Tayal Singh</h3>
                <p className="font-body text-primary-foreground/70">Principal</p>
                <p className="font-body text-primary-foreground/70 text-sm mt-1">
                  Vinayak International School
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
