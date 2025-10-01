import Link from "next/link";
import { Github, Linkedin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-background border-t mt-auto">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">
              WellNourish AI
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Transform your health with AI-powered personalized nutrition and
              diet planning. Making healthy living accessible and achievable for
              everyone.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-red-500 fill-current" />
              <span>for better health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <div className="flex flex-col space-y-3">
              <Link
                href="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/disclaimer"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Medical Disclaimer
              </Link>
            </div>
          </div>

          {/* Developer & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Developer</h3>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Developed by{" "}
                <span className="font-medium text-foreground">
                  Ashutosh Swamy
                </span>
              </p>
              <div className="flex gap-4">
                <Link
                  href="https://github.com/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  aria-label="GitHub Profile"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </Link>
                <Link
                  href="https://linkedin.com/in/ashutoshswamy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                  aria-label="LinkedIn Profile"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t mt-8 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} WellNourish AI. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Not a substitute for professional medical advice. Always consult
              healthcare providers.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
