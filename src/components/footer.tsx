import Link from "next/link";
import { Github, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto safe-area-bottom">
      <div className="container mx-auto px-4 xs:px-6 sm:px-8 py-8 xs:py-10 md:py-12 max-w-7xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 xs:gap-8 md:gap-10">
          {/* Company Info */}
          <div className="space-y-3 xs:space-y-4">
            <h3 className="text-base xs:text-lg md:text-xl font-semibold text-foreground">
              WellNourish AI
            </h3>
            <p className="text-sm xs:text-base text-muted-foreground leading-relaxed max-w-md">
              Transform your health with AI-powered personalized nutrition and
              diet planning. Making healthy living accessible and achievable for
              everyone.
            </p>
            <div className="flex items-center gap-2 text-xs xs:text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-3 w-3 xs:h-4 xs:w-4 text-red-500 fill-current" />
              <span>for better health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 xs:space-y-4">
            <h3 className="text-base xs:text-lg md:text-xl font-semibold text-foreground">
              Legal
            </h3>
            <div className="flex flex-col space-y-2 xs:space-y-3">
              <Link
                href="/terms"
                className="text-sm xs:text-base text-muted-foreground hover:text-primary transition-colors touch-target focus-ring rounded"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm xs:text-base text-muted-foreground hover:text-primary transition-colors touch-target focus-ring rounded"
              >
                Privacy Policy
              </Link>
              <Link
                href="/disclaimer"
                className="text-sm xs:text-base text-muted-foreground hover:text-primary transition-colors touch-target focus-ring rounded"
              >
                Medical Disclaimer
              </Link>
            </div>
          </div>

          {/* Developer & Social */}
          <div className="space-y-3 xs:space-y-4">
            <h3 className="text-base xs:text-lg md:text-xl font-semibold text-foreground">
              Developer
            </h3>
            <div className="space-y-2 xs:space-y-3">
              <p className="text-sm xs:text-base text-muted-foreground">
                Developed by{" "}
                <span className="font-medium text-foreground">
                  Ashutosh Swamy
                </span>
              </p>
              <div className="flex flex-wrap gap-3 xs:gap-4">
                <Link
                  href="https://github.com/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm xs:text-base text-muted-foreground hover:text-primary transition-colors touch-target focus-ring rounded px-1"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-4 w-4 xs:h-5 xs:w-5" />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm xs:text-base text-muted-foreground hover:text-primary transition-colors touch-target focus-ring rounded px-1"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4 xs:h-5 xs:w-5" />
                  <span>LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 xs:mt-10 md:mt-12 pt-6 xs:pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 xs:gap-4">
            <p className="text-xs xs:text-sm text-muted-foreground text-center sm:text-left">
              © {new Date().getFullYear()} WellNourish AI. All rights reserved.
            </p>
            <p className="text-xs xs:text-sm text-muted-foreground text-center sm:text-right max-w-md">
              Not a substitute for professional medical advice. Always consult
              healthcare providers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
