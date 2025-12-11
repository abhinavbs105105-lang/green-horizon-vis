import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAdmin } from '@/contexts/AdminContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Academics', path: '/academics' },
  { name: 'Faculty & Staff', path: '/faculty' },
  { name: 'Facilities', path: '/facilities' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Events & Notices', path: '/events' },
  { name: 'Rules', path: '/rules' },
  { name: 'Parent Resources', path: '/parents' },
  { name: 'Contact Us', path: '/contact' },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);
  const location = useLocation();
  const { isAdmin, setIsAdmin } = useAdmin();

  const handleLogoClick = () => {
    clickCountRef.current += 1;
    
    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }
    
    clickTimerRef.current = setTimeout(() => {
      clickCountRef.current = 0;
    }, 2000);

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      if (isAdmin) {
        setIsAdmin(false);
        toast({
          title: "Admin mode disabled",
          description: "You have logged out of admin mode.",
        });
      } else {
        setShowPasswordDialog(true);
      }
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'VIS-BEST') {
      setIsAdmin(true);
      setShowPasswordDialog(false);
      setPassword('');
      toast({
        title: "Admin mode enabled",
        description: "Welcome to the admin panel!",
      });
    } else {
      toast({
        title: "Invalid password",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Top Bar */}
      <div className="hidden md:block bg-gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5" />
                <span className="font-body">1800-890-1770 (Toll-Free)</span>
              </div>
              <span className="font-body hidden lg:block">enquiry@vinayakintschool.com</span>
            </div>
            <div className="font-body text-primary-foreground/80">
              Admissions Open for 2024-25
            </div>
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/80 transition-all duration-300">
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-2 sm:gap-3 cursor-pointer group"
            >
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-gradient-hero shadow-soft transition-transform duration-300 group-hover:scale-110">
                <GraduationCap className="h-5 w-5 sm:h-7 sm:w-7 text-primary-foreground" />
              </div>
              <div className="flex flex-col">
                <h1 className="font-display text-base sm:text-xl font-bold text-primary leading-tight">
                  Vinayak International
                </h1>
                <p className="text-[10px] sm:text-xs text-muted-foreground font-body">School, Hathras</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-2.5 xl:px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 font-body relative overflow-hidden group",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                  <span className={cn(
                    "absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300",
                    location.pathname === item.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  )} />
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 px-2.5 xl:px-3 py-2 text-sm font-medium rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary transition-all duration-300 font-body">
                  More <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  <div className="bg-card rounded-xl shadow-hover border border-border p-2 min-w-[200px] animate-fade-in">
                    {navItems.slice(6).map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "block px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-300 font-body",
                          location.pathname === item.path
                            ? "bg-primary/10 text-primary"
                            : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                        )}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </nav>

            {/* CTA Button & Mobile Menu */}
            <div className="flex items-center gap-2 sm:gap-4">
              {isAdmin && (
                <Link to="/admin" className="hidden sm:block">
                  <Button variant="gold" size="sm" className="animate-pulse-soft">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link to="/admissions" className="hidden md:block">
                <Button variant="hero" size="default" className="shadow-soft hover:shadow-hover transition-all duration-300">
                  Apply Now
                </Button>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-all duration-300"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className={cn(
            "lg:hidden overflow-hidden transition-all duration-500 ease-out",
            isOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
          )}>
            <nav className="py-4 border-t border-border flex flex-col gap-1">
              {navItems.map((item, index) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "px-4 py-3 text-sm font-medium rounded-lg transition-all duration-300 font-body animate-fade-in-up",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {item.name}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-sm font-medium rounded-lg bg-accent/10 text-accent-foreground font-body animate-fade-in-up"
                  style={{ animationDelay: '500ms' }}
                >
                  Admin Panel
                </Link>
              )}
              <Link to="/admissions" onClick={() => setIsOpen(false)} className="mt-2 animate-fade-in-up" style={{ animationDelay: '550ms' }}>
                <Button variant="hero" className="w-full">
                  Apply Now
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md animate-scale-in">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Admin Access</DialogTitle>
          </DialogHeader>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body"
            />
            <Button type="submit" className="w-full">
              Access Admin Panel
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
