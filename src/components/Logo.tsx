import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <svg
        viewBox="0 0 64 64"
        className={cn(sizeClasses[size], "flex-shrink-0")}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Book base */}
        <rect
          x="8"
          y="12"
          width="48"
          height="40"
          rx="3"
          className="fill-primary/20"
        />
        
        {/* Left page */}
        <path
          d="M32 14V50C32 50 24 48 16 48C14 48 12 48.5 10 49V15C12 14.5 14 14 16 14C24 14 32 14 32 14Z"
          className="fill-primary"
        />
        
        {/* Right page */}
        <path
          d="M32 14V50C32 50 40 48 48 48C50 48 52 48.5 54 49V15C52 14.5 50 14 48 14C40 14 32 14 32 14Z"
          className="fill-primary/80"
        />
        
        {/* Page lines left */}
        <path d="M16 22H28" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 28H26" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 34H24" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 40H22" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
        
        {/* Page lines right */}
        <path d="M36 22H48" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M38 28H48" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M40 34H48" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        <path d="M42 40H48" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
        
        {/* Spine highlight */}
        <path
          d="M32 14V50"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        
        {/* Decorative leaf/growth element */}
        <circle cx="32" cy="8" r="4" className="fill-accent" />
        <path
          d="M32 8C32 8 28 4 32 0C36 4 32 8 32 8Z"
          className="fill-primary"
        />
      </svg>
    </div>
  );
}
