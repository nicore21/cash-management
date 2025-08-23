'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  ArrowRightLeft,
  Menu,
  Handshake,
  Clock,
  LogOut,
} from 'lucide-react';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/pending-work', label: 'Pending Work', icon: Clock },
  { href: '/transactions', label: 'Transactions', icon: ArrowRightLeft },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const navLinks = (
    <nav className="flex flex-col gap-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? 'secondary' : 'ghost'}
          className="w-full justify-start gap-2"
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        </Button>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-card lg:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-16 items-center border-b px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <Handshake className="h-6 w-6" />
              <span>Neelam Enterprises</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2 px-4">{navLinks}</div>
          <div className="mt-auto p-4 border-t">
              <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                  <LogOut className="h-4 w-4" />
                  Logout
              </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-16 items-center gap-4 border-b bg-card px-6 lg:hidden sticky top-0 z-30">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 flex flex-col">
               <SheetHeader className="border-b p-4">
                 <SheetTitle>
                  <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                    <Handshake className="h-6 w-6" />
                    <span>Neelam Enterprises</span>
                  </Link>
                 </SheetTitle>
              </SheetHeader>
              <div className="py-2 px-4 flex-1">{navLinks}</div>
              <div className="mt-auto p-4 border-t">
                 <Button variant="ghost" className="w-full justify-start gap-2" onClick={handleLogout}>
                      <LogOut className="h-4 w-4" />
                      Logout
                  </Button>
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">
              {navItems.find(item => item.href === pathname)?.label ?? 'Dashboard'}
            </h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
