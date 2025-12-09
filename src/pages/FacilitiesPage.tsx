import { 
  Monitor, 
  Dribbble, 
  Waves, 
  Palette, 
  Theater, 
  Trees, 
  BookOpen, 
  Laptop,
  Bus,
  Utensils,
  Shield,
  Stethoscope
} from 'lucide-react';

const facilities = [
  {
    icon: Monitor,
    name: 'Smart Boards',
    description: 'Interactive digital whiteboards in every classroom for enhanced visual learning and student engagement.',
    features: ['Touch-enabled screens', 'Multimedia support', 'Internet connectivity'],
  },
  {
    icon: Dribbble,
    name: 'Sports & Playground',
    description: 'Expansive playground with facilities for cricket, football, basketball, and other outdoor activities.',
    features: ['Multi-sport courts', 'Athletics track', 'Indoor games room'],
  },
  {
    icon: Waves,
    name: 'Swimming Pool',
    description: 'Well-maintained swimming pool with trained instructors for aquatic sports and swimming lessons.',
    features: ['Certified coaches', 'Safety equipment', 'Regular maintenance'],
  },
  {
    icon: Palette,
    name: 'Art & Craft Studio',
    description: 'Dedicated creative space equipped with all materials for painting, sculpting, and handicrafts.',
    features: ['Art supplies', 'Exhibition space', 'Craft workshops'],
  },
  {
    icon: Theater,
    name: 'Theatre & Auditorium',
    description: 'State-of-the-art auditorium for cultural events, performances, and school functions.',
    features: ['Professional lighting', 'Sound system', '500+ seating'],
  },
  {
    icon: Trees,
    name: 'Green Campus',
    description: 'Eco-friendly campus with lush gardens, trees, and open spaces for nature-based learning.',
    features: ['Botanical garden', 'Eco-club', 'Nature trails'],
  },
  {
    icon: BookOpen,
    name: 'Library',
    description: 'Well-stocked library with thousands of books, periodicals, and digital resources.',
    features: ['Reading hall', 'Reference section', 'E-library access'],
  },
  {
    icon: Laptop,
    name: 'Computer Lab',
    description: 'Modern computer laboratory with high-speed internet and latest software for digital literacy.',
    features: ['Latest computers', 'Educational software', 'Coding classes'],
  },
  {
    icon: Bus,
    name: 'Transport',
    description: 'Safe and reliable transport service covering major routes across Hathras and nearby areas.',
    features: ['GPS tracking', 'Trained drivers', 'Wide coverage'],
  },
  {
    icon: Utensils,
    name: 'Cafeteria',
    description: 'Hygienic cafeteria serving nutritious and delicious meals prepared fresh daily.',
    features: ['Balanced menu', 'Hygienic kitchen', 'Affordable prices'],
  },
  {
    icon: Shield,
    name: 'Security',
    description: 'Round-the-clock security with CCTV surveillance ensuring a safe learning environment.',
    features: ['CCTV cameras', '24/7 guards', 'Visitor management'],
  },
  {
    icon: Stethoscope,
    name: 'Medical Room',
    description: 'On-campus medical facility with first-aid and a trained nurse for student health care.',
    features: ['First-aid kit', 'Trained nurse', 'Emergency protocols'],
  },
];

export default function FacilitiesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-hero py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Our Facilities
            </h1>
            <p className="font-body text-primary-foreground/80 text-lg">
              World-class infrastructure designed to support holistic development and academic excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Facilities Grid */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything Your Child Needs
            </h2>
            <p className="font-body text-muted-foreground">
              From modern classrooms to recreational facilities, we provide everything 
              necessary for a complete educational experience.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                    <facility.icon className="h-7 w-7 text-primary group-hover:text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                      {facility.name}
                    </h3>
                    <p className="font-body text-sm text-muted-foreground mb-4">
                      {facility.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {facility.features.map((feature, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 bg-secondary rounded-md font-body text-xs text-secondary-foreground"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-soft">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
            See Our Facilities in Person
          </h2>
          <p className="font-body text-muted-foreground max-w-2xl mx-auto">
            Schedule a campus tour to experience our world-class facilities firsthand. 
            Contact our admissions office at <span className="text-primary font-semibold">1800-890-1770</span>
          </p>
        </div>
      </section>
    </div>
  );
}
