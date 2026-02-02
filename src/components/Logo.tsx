import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center", className)}>
      <svg
        viewBox="0 0 64 64"
        className={cn(sizeClasses[size], "flex-shrink-0")}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" className="fill-primary" />
        
        {/* Inner glow */}
        <circle cx="32" cy="32" r="26" className="fill-primary/80" />
        
        {/* Open book - left page */}
        <path
          d="M32 20C32 20 26 18 20 18C17 18 14 18.5 12 19V44C14 43.5 17 43 20 43C26 43 32 45 32 45V20Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* Open book - right page */}
        <path
          d="M32 20C32 20 38 18 44 18C47 18 50 18.5 52 19V44C50 43.5 47 43 44 43C38 43 32 45 32 45V20Z"
          fill="white"
          opacity="0.85"
        />
        
        {/* Book spine shadow */}
        <path
          d="M32 20V45"
          stroke="currentColor"
          strokeWidth="1"
          className="text-primary/30"
        />
        
        {/* Left page text lines */}
        <line x1="16" y1="24" x2="28" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/40" />
        <line x1="16" y1="29" x2="26" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/40" />
        <line x1="16" y1="34" x2="27" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/40" />
        <line x1="16" y1="39" x2="24" y2="39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/40" />
        
        {/* Right page text lines */}
        <line x1="36" y1="24" x2="48" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/30" />
        <line x1="38" y1="29" x2="48" y2="29" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/30" />
        <line x1="37" y1="34" x2="48" y2="34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/30" />
        <line x1="40" y1="39" x2="48" y2="39" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-primary/30" />
        
        {/* Decorative star/sparkle */}
        <path
          d="M50 12L51 15L54 16L51 17L50 20L49 17L46 16L49 15L50 12Z"
          className="fill-accent"
        />
        
        {/* Small accent dot */}
        <circle cx="14" cy="14" r="2" className="fill-white/60" />
      </svg>
    </div>
  );
}
