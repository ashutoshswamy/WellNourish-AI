'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { BotMessageSquare, LayoutDashboard, NotebookText, User } from "lucide-react"

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/generate", label: "Generate", icon: BotMessageSquare },
  { href: "/my-plans", label: "My Plans", icon: NotebookText },
  { href: "/profile", label: "Profile", icon: User },
];

export function AppHeaderNav() {
  const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === link.href
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.label}
          {pathname === link.href && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
              layoutId="underline"
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
            />
          )}
        </Link>
      ))}
    </nav>
  )
}
