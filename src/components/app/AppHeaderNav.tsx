'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { SheetClose } from "@/components/ui/sheet"

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/generate", label: "Generate" },
  { href: "/my-plans", label: "My Plans" },
  { href: "/profile", label: "Profile" },
];

export function AppHeaderNav() {
  const pathname = usePathname()

  return (
    <nav className="flex items-center space-x-2 lg:space-x-4">
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "relative px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname.startsWith(link.href)
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {link.label}
          {pathname.startsWith(link.href) && (
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

export function AppHeaderNavMobile() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => (
                <SheetClose asChild key={link.href}>
                    <Link
                        href={link.href}
                        className={cn(
                            "flex items-center gap-4 px-2.5",
                            pathname.startsWith(link.href)
                                ? "text-foreground"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        {link.label}
                    </Link>
                </SheetClose>
            ))}
        </>
    )
}
