import type { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from '@/app/actions/auth'
import Link from 'next/link'
import { User as UserIcon, LogOut, Menu } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { AppHeaderNav, AppHeaderNavMobile } from '@/components/app/AppHeaderNav'

export function AppHeader({ user }: { user: User }) {
  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6">
      <Link href="/dashboard" className="flex items-center gap-2 mr-auto md:mr-6">
        <Logo className="h-8 w-8 text-primary" />
        <span className="font-bold font-headline text-lg hidden sm:inline-block">
          WellNourish AI
        </span>
      </Link>
      
      <div className="hidden md:flex">
         <AppHeaderNav />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user.user_metadata.avatar_url} alt={user.email} />
                <AvatarFallback>{getInitials(user.email || 'U')}</AvatarFallback>
              </Avatar>
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">My Account</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/profile">
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <form action={signOut}>
                <button type="submit" className="w-full">
                    <DropdownMenuItem>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </button>
            </form>
          </DropdownMenuContent>
        </DropdownMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open main menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-4 text-lg font-medium">
               <Link href="/dashboard" className="flex items-center gap-2 mb-4">
                  <Logo className="h-8 w-8 text-primary" />
                  <span className="font-bold font-headline text-lg">WellNourish AI</span>
               </Link>
               <AppHeaderNavMobile />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
