import { useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap } from 'lucide-react';
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
      <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <button 
              onClick={handleLogoClick}
              className="flex items-center gap-3 cursor-pointer transition-transform hover:scale-105"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-hero shadow-soft">
                <GraduationCap className="h-7 w-7 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-xl font-bold text-primary">
                  Vinayak International
                </h1>
                <p className="text-xs text-muted-foreground font-body">School, Hathras</p>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navItems.slice(0, 6).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg transition-colors font-body",
                    location.pathname === item.path
                      ? "bg-primary/10 text-primary"
                      : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                  )}
                >
                  {item.name}
                </Link>
              ))}
              <div className="relative group">
                <button className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg text-foreground/70 hover:text-foreground hover:bg-secondary transition-colors font-body">
                  More <ChevronDown className="h-4 w-4" />
                </button>
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-card rounded-lg shadow-card border border-border p-2 min-w-[180px]">
                    {navItems.slice(6).map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "block px-3 py-2 text-sm font-medium rounded-md transition-colors font-body",
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
            <div className="flex items-center gap-4">
              {isAdmin && (
                <Link to="/admin">
                  <Button variant="gold" size="sm" className="hidden sm:flex">
                    Admin Panel
                  </Button>
                </Link>
              )}
              <Link to="/admissions" className="hidden md:block">
                <Button variant="hero" size="default">
                  Apply Now
                </Button>
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="lg:hidden py-4 border-t border-border animate-fade-in">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm font-medium rounded-lg transition-colors font-body",
                      location.pathname === item.path
                        ? "bg-primary/10 text-primary"
                        : "text-foreground/70 hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-3 text-sm font-medium rounded-lg bg-accent/10 text-accent-foreground font-body"
                  >
                    Admin Panel
                  </Link>
                )}
                <Link to="/admissions" onClick={() => setIsOpen(false)} className="mt-2">
                  <Button variant="hero" className="w-full">
                    Apply Now
                  </Button>
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">Admin Access</DialogTitle>
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
