import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Dribbble, 
  Palette, 
  Waves, 
  Theater, 
  Trees, 
  BookOpen, 
  Laptop,
  GraduationCap,
  ArrowRight,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import heroCampus from '@/assets/hero-campus.jpg';

const facilities = [
  { icon: Monitor, name: 'Smart Boards', desc: 'Interactive digital learning' },
  { icon: Dribbble, name: 'Sports & Playground', desc: 'Physical fitness activities' },
  { icon: Waves, name: 'Swimming Pool', desc: 'Aquatic training facility' },
  { icon: Palette, name: 'Art & Craft', desc: 'Creative expression studio' },
  { icon: Theater, name: 'Theatre', desc: 'Performing arts venue' },
  { icon: Trees, name: 'Green Campus', desc: 'Eco-friendly environment' },
  { icon: BookOpen, name: 'Library', desc: 'Extensive book collection' },
  { icon: Laptop, name: 'Computer Lab', desc: 'Modern IT infrastructure' },
];

const stats = [
  { value: '10+', label: 'Years of Excellence' },
  { value: '50+', label: 'Qualified Teachers' },
  { value: '1000+', label: 'Happy Students' },
  { value: '100%', label: 'Parent Trust' },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCampus})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark/95 via-primary/85 to-primary/70" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6 animate-fade-in">
              <GraduationCap className="h-5 w-5 text-accent" />
              <span className="text-primary-foreground/90 font-body text-sm">Nursery to Class 10th</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight animate-fade-in-up">
              Growing Minds,<br />
              <span className="text-accent">Building Futures</span>
            </h1>
            
            <p className="text-primary-foreground/80 font-body text-lg md:text-xl mb-8 max-w-2xl animate-fade-in-up delay-100">
              Knowledge and Punctuality for a Bright and Harmonious Life. 
              Join Vinayak International School for an exceptional educational journey.
            </p>
            
            <div className="flex flex-wrap gap-4 animate-fade-in-up delay-200">
              <Link to="/admissions">
                <Button variant="gold" size="xl">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline-light" size="xl">
                  Explore Our School
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 mt-12 animate-fade-in-up delay-300">
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span className="font-body text-sm">1800-890-1770</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span className="font-body text-sm">admission@vinayakintschool.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 hidden lg:block">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-2xl shadow-card p-8 mx-auto max-w-4xl">
              <div className="grid grid-cols-4 gap-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-display text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="font-body text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats for Mobile */}
      <section className="lg:hidden bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="font-display text-2xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="font-body text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-24 lg:pt-40 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              World-Class Facilities
            </h2>
            <p className="font-body text-muted-foreground">
              Our campus is equipped with modern amenities to provide a holistic educational experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-6 shadow-card hover:shadow-hover transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
                  <facility.icon className="h-6 w-6 text-primary group-hover:text-primary-foreground transition-colors" />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {facility.name}
                </h3>
                <p className="font-body text-sm text-muted-foreground">
                  {facility.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">About VIS</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mt-2 mb-6">
                A Legacy of Educational Excellence
              </h2>
              <p className="font-body text-muted-foreground mb-6 leading-relaxed">
                Vinayak International School stands as a beacon of quality education in Hathras. 
                Our commitment to nurturing young minds with the perfect blend of traditional values 
                and modern teaching methodologies sets us apart.
              </p>
              <p className="font-body text-muted-foreground mb-8 leading-relaxed">
                From Nursery to Class 10th, we provide a comprehensive curriculum designed to 
                develop well-rounded individuals ready to face the challenges of tomorrow.
              </p>
              <Link to="/about">
                <Button variant="default" size="lg">
                  Learn More About Us
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            <div className="relative">
              <div className="bg-gradient-hero rounded-2xl p-8 text-primary-foreground">
                <blockquote className="font-display text-2xl md:text-3xl font-medium italic mb-6">
                  "Knowledge and Punctuality for a Bright and Harmonious Life."
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="font-body font-semibold">VIS Motto</div>
                    <div className="font-body text-sm text-primary-foreground/70">Our Guiding Principle</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent rounded-2xl -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-hero">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h2 className="font-display text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Ready to Give Your Child the Best Education?
              </h2>
              <p className="font-body text-primary-foreground/80">
                Admissions open for the new academic session
              </p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link to="/admissions">
                <Button variant="gold" size="lg">
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-light" size="lg">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
              Visit Our Campus
            </h2>
            <p className="font-body text-muted-foreground">
              We'd love to show you around our beautiful campus
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Our Address</h3>
              <p className="font-body text-sm text-muted-foreground">
                Shree Ganesh City, Gijroli Bamba, Agra Road, Hathras, UP 204101
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Call Us</h3>
              <p className="font-body text-sm text-muted-foreground">
                1800-890-1770 (Toll-free)<br />+91 70170 24003
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">Email Us</h3>
              <p className="font-body text-sm text-muted-foreground">
                enquiry@vinayakintschool.com<br />admission@vinayakintschool.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
