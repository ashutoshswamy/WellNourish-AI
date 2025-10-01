import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto safe-area-bottom">
      <div className="container-fluid py-6 xs:py-8 md:py-10 max-w-6xl mx-auto px-4 xs:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 gap-6">
          {/* Left side - App info */}
          <div className="text-center md:text-left">
            <p className="text-sm xs:text-base text-muted-foreground">
              © 2025 WellNourish AI. Transform your health with AI.
            </p>
          </div>

          {/* Right side - Developer info */}
          <div className="text-center md:text-right">
            <p className="text-sm xs:text-base text-muted-foreground mb-2 xs:mb-3">
              Developed by{" "}
              <span className="font-medium text-foreground">
                Ashutosh Swamy
              </span>
            </p>
            <div className="flex justify-center md:justify-end space-x-4 xs:space-x-6">
              <Link
                href="https://github.com/ashutoshswamy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors touch-target-large a11y-focus rounded-md p-1"
                aria-label="GitHub Profile"
              >
                <Github className="h-5 w-5 xs:h-6 xs:w-6" />
              </Link>
              <Link
                href="https://linkedin.com/in/ashutoshswamy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors touch-target-large a11y-focus rounded-md p-1"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="h-5 w-5 xs:h-6 xs:w-6" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
