import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export function WelcomePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup on initial load
    setIsOpen(true);
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md text-center border-2 border-primary/20 bg-gradient-to-br from-background to-secondary/30">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 rounded-full hover:bg-destructive/10"
          onClick={() => setIsOpen(false)}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <DialogHeader className="pt-6">
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            A Demo Website Created by Shivam Singh.
          </DialogTitle>
        </DialogHeader>
        <div className="py-6">
          <p className="text-muted-foreground">Welcome to our website!</p>
        </div>
        <Button onClick={() => setIsOpen(false)} className="w-full">
          Continue
        </Button>
      </DialogContent>
    </Dialog>
  );
}
