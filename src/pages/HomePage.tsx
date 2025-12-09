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
  MapPin,
  Award,
  Users,
  Star
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
  { value: '10+', label: 'Years of Excellence', icon: Award },
  { value: '50+', label: 'Qualified Teachers', icon: Users },
  { value: '1000+', label: 'Happy Students', icon: GraduationCap },
  { value: '100%', label: 'Parent Trust', icon: Star },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] md:min-h-[90vh] flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroCampus})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-dark/95 via-primary/90 to-primary/75" />
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-10 w-32 md:w-64 h-32 md:h-64 rounded-full bg-accent/10 blur-3xl animate-float" />
          <div className="absolute bottom-40 left-10 w-40 md:w-80 h-40 md:h-80 rounded-full bg-primary-foreground/5 blur-3xl animate-float delay-500" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10 py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-md rounded-full px-4 py-2 mb-6 animate-fade-in-down border border-primary-foreground/10">
              <GraduationCap className="h-4 w-4 md:h-5 md:w-5 text-accent" />
              <span className="text-primary-foreground/90 font-body text-xs md:text-sm">Nursery to Class 10th • CBSE Affiliated</span>
            </div>
            
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 md:mb-6 leading-tight">
              <span className="animate-fade-in-up inline-block">Vinayak International</span><br />
              <span className="animate-fade-in-up delay-100 inline-block text-accent">School, Hathras</span>
            </h1>
            
            <p className="text-primary-foreground/80 font-body text-base md:text-xl mb-6 md:mb-8 max-w-2xl animate-fade-in-up delay-200 leading-relaxed">
              <span className="text-accent font-semibold">"Growing Minds, Building Futures"</span> — 
              Knowledge and Punctuality for a Bright and Harmonious Life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-300">
              <Link to="/admissions">
                <Button variant="gold" size="xl" className="w-full sm:w-auto shadow-glow hover:shadow-hover transition-all duration-500 group">
                  Start Your Journey
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline-light" size="xl" className="w-full sm:w-auto backdrop-blur-sm">
                  Explore Our School
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6 mt-8 md:mt-12 animate-fade-in-up delay-400">
              <a href="tel:18008901770" className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors group">
                <div className="p-2 bg-primary-foreground/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Phone className="h-4 w-4" />
                </div>
                <span className="font-body text-sm">1800-890-1770</span>
              </a>
              <a href="mailto:admission@vinayakintschool.com" className="flex items-center gap-2 text-primary-foreground/80 hover:text-accent transition-colors group">
                <div className="p-2 bg-primary-foreground/10 rounded-lg group-hover:bg-accent/20 transition-colors">
                  <Mail className="h-4 w-4" />
                </div>
                <span className="font-body text-sm hidden sm:inline">admission@vinayakintschool.com</span>
                <span className="font-body text-sm sm:hidden">Email Us</span>
              </a>
            </div>
          </div>
        </div>

        {/* Stats Cards - Desktop */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 hidden lg:block">
          <div className="container mx-auto px-4">
            <div className="bg-card rounded-2xl shadow-hover p-6 xl:p-8 mx-auto max-w-5xl border border-border/50 backdrop-blur-sm">
              <div className="grid grid-cols-4 gap-6 xl:gap-8">
                {stats.map((stat, index) => (
                  <div 
                    key={index} 
                    className="text-center group animate-fade-in-up"
                    style={{ animationDelay: `${500 + index * 100}ms` }}
                  >
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-hero flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <div className="font-display text-2xl xl:text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="font-body text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats for Mobile */}
      <section className="lg:hidden bg-card py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-4 rounded-xl bg-secondary/50 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-gradient-hero flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="font-display text-xl font-bold text-primary mb-0.5">{stat.value}</div>
                <div className="font-body text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* School Name Banner */}
      <section className="py-6 bg-gradient-hero lg:hidden">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-xl font-bold text-primary-foreground animate-fade-in">
            Vinayak International School
          </h2>
          <p className="font-body text-primary-foreground/80 text-sm">Hathras, Uttar Pradesh</p>
        </div>
      </section>

      {/* Facilities Section */}
      <section className="py-16 md:py-24 lg:pt-40 bg-gradient-soft">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-16">
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary rounded-full text-sm font-body font-medium mb-4 animate-fade-in">
              World-Class Infrastructure
            </span>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up delay-100">
              Facilities at VIS
            </h2>
            <p className="font-body text-muted-foreground animate-fade-in-up delay-200">
              Our campus is equipped with modern amenities to provide a holistic educational experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
            {facilities.map((facility, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-4 md:p-6 shadow-card hover-lift group animate-fade-in-up cursor-pointer"
                style={{ animationDelay: `${200 + index * 75}ms` }}
              >
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3 md:mb-4 group-hover:bg-gradient-hero group-hover:scale-110 transition-all duration-400">
                  <facility.icon className="h-5 w-5 md:h-6 md:w-6 text-primary group-hover:text-primary-foreground transition-colors duration-400" />
                </div>
                <h3 className="font-display text-sm md:text-lg font-semibold text-foreground mb-1">
                  {facility.name}
                </h3>
                <p className="font-body text-xs md:text-sm text-muted-foreground">
                  {facility.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10 md:mt-12 animate-fade-in-up delay-700">
            <Link to="/facilities">
              <Button variant="outline" size="lg" className="group">
                View All Facilities
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* About Preview */}
      <section className="py-16 md:py-24 bg-background overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="animate-slide-in-right">
              <span className="text-primary font-body font-semibold text-sm uppercase tracking-wider">About VIS</span>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mt-2 mb-4 md:mb-6">
                A Legacy of Educational Excellence
              </h2>
              <p className="font-body text-muted-foreground mb-4 md:mb-6 leading-relaxed text-sm md:text-base">
                Vinayak International School stands as a beacon of quality education in Hathras. 
                Our commitment to nurturing young minds with the perfect blend of traditional values 
                and modern teaching methodologies sets us apart.
              </p>
              <p className="font-body text-muted-foreground mb-6 md:mb-8 leading-relaxed text-sm md:text-base">
                From Nursery to Class 10th, we provide a comprehensive curriculum designed to 
                develop well-rounded individuals ready to face the challenges of tomorrow.
              </p>
              <Link to="/about">
                <Button variant="default" size="lg" className="group shadow-soft">
                  Learn More About Us
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
            <div className="relative animate-slide-in-left">
              <div className="bg-gradient-hero rounded-2xl p-6 md:p-8 text-primary-foreground shadow-hover">
                <blockquote className="font-display text-xl sm:text-2xl md:text-3xl font-medium italic mb-4 md:mb-6 leading-relaxed">
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
              <div className="absolute -bottom-4 -right-4 w-20 md:w-24 h-20 md:h-24 bg-accent rounded-2xl -z-10 animate-float" />
              <div className="absolute -top-4 -left-4 w-16 md:w-20 h-16 md:h-20 bg-primary/20 rounded-2xl -z-10 animate-float delay-300" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-16 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-40 h-40 rounded-full bg-accent animate-float" />
          <div className="absolute bottom-0 right-1/4 w-60 h-60 rounded-full bg-primary-foreground/20 animate-float delay-500" />
        </div>
        <div className="container mx-auto px-4 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center lg:text-left animate-fade-in-up">
              <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-primary-foreground mb-2">
                Ready to Give Your Child the Best Education?
              </h2>
              <p className="font-body text-primary-foreground/80 text-sm md:text-base">
                Admissions open for the new academic session 2024-25
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-fade-in-up delay-200">
              <Link to="/admissions">
                <Button variant="gold" size="lg" className="shadow-glow hover-glow w-full sm:w-auto">
                  Apply for Admission
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline-light" size="lg" className="w-full sm:w-auto backdrop-blur-sm">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Preview */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-12">
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-4 animate-fade-in-up">
              Visit Our Campus
            </h2>
            <p className="font-body text-muted-foreground animate-fade-in-up delay-100">
              We'd love to show you around our beautiful campus
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { icon: MapPin, title: 'Our Address', content: 'Shree Ganesh City, Gijroli Bamba, Agra Road, Hathras, UP 204101' },
              { icon: Phone, title: 'Call Us', content: '1800-890-1770 (Toll-free)\n+91 70170 24003' },
              { icon: Mail, title: 'Email Us', content: 'enquiry@vinayakintschool.com\nadmission@vinayakintschool.com' },
            ].map((item, index) => (
              <div 
                key={index}
                className="bg-card rounded-xl p-5 md:p-6 shadow-card text-center hover-lift animate-fade-in-up"
                style={{ animationDelay: `${200 + index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-hero flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="font-display font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground whitespace-pre-line">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
