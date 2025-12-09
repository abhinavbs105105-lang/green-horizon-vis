import { Monitor, BookOpen, GraduationCap, Users, Brain, Palette } from 'lucide-react';

const curriculumFeatures = [
  {
    icon: Monitor,
    title: 'Smart Learning',
    description: 'Interactive smart boards and digital classrooms enhance the learning experience with multimedia content and real-time engagement.',
  },
  {
    icon: Brain,
    title: 'Critical Thinking',
    description: 'Our curriculum emphasizes analytical skills, problem-solving, and creative thinking to prepare students for future challenges.',
  },
  {
    icon: Palette,
    title: 'Holistic Development',
    description: 'Beyond academics, we focus on arts, sports, and extracurricular activities for well-rounded personality development.',
  },
  {
    icon: Users,
    title: 'Collaborative Learning',
    description: 'Group projects and team activities foster communication skills, leadership qualities, and social development.',
  },
];

const classStructure = [
  {
    level: 'Pre-Primary',
    classes: ['Nursery', 'LKG', 'UKG'],
    description: 'Foundation years focusing on play-based learning, motor skills, and social development.',
    color: 'bg-accent/20',
  },
  {
    level: 'Primary',
    classes: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
    description: 'Building fundamental academic skills in languages, mathematics, science, and social studies.',
    color: 'bg-primary/10',
  },
  {
    level: 'Middle School',
    classes: ['Class 6', 'Class 7', 'Class 8'],
    description: 'Deepening subject knowledge with specialized teaching and practical learning approaches.',
    color: 'bg-sage',
  },
  {
    level: 'Secondary',
    classes: ['Class 9', 'Class 10'],
    description: 'Board examination preparation with comprehensive subject mastery and career guidance.',
    color: 'bg-emerald-light',
  },
];

export default function AcademicsPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Academics
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              A comprehensive curriculum designed to nurture curious minds and build strong foundations.
            </p>
          </div>
        </div>
      </section>

      {/* Curriculum Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Curriculum Approach
            </h2>
            <p className="font-body text-muted-foreground">
              We blend traditional academic excellence with modern teaching methodologies, 
              leveraging technology to create engaging and effective learning experiences.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {curriculumFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <feature.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
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

      {/* Class Structure */}
      <section className="py-20 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Class-wise Structure
            </h2>
            <p className="font-body text-muted-foreground max-w-2xl mx-auto">
              Our educational journey is structured to progressively build knowledge and skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {classStructure.map((level, index) => (
              <div 
                key={index}
                className={`rounded-2xl p-8 ${level.color}`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="h-8 w-8 text-primary" />
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {level.level}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {level.classes.map((cls, i) => (
                    <span 
                      key={i}
                      className="px-3 py-1 bg-card rounded-full font-body text-sm text-foreground shadow-soft"
                    >
                      {cls}
                    </span>
                  ))}
                </div>
                <p className="font-body text-muted-foreground text-sm">
                  {level.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Smart Learning */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">
                Technology-Enhanced Learning
              </span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                Smart Classrooms for Smart Students
              </h2>
              <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                Every classroom at VIS is equipped with state-of-the-art smart boards and 
                digital learning tools. Our teachers use interactive presentations, educational 
                videos, and online resources to make learning more engaging and effective.
              </p>
              <ul className="space-y-3">
                {[
                  'Interactive digital whiteboards in every classroom',
                  'Well-equipped computer lab with latest systems',
                  'E-learning resources and digital library access',
                  'Audio-visual learning aids for better retention',
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 font-body text-foreground">
                    <BookOpen className="h-5 w-5 text-primary flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-hero rounded-2xl p-12 text-center">
              <Monitor className="h-24 w-24 text-primary-foreground mx-auto mb-6" />
              <h3 className="font-display text-2xl font-bold text-primary-foreground mb-2">
                100% Digital Classrooms
              </h3>
              <p className="font-body text-primary-foreground/80">
                Embracing technology for enhanced learning
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
