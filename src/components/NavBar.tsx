"use client";
import Link from "next/link";
import { usePathname } from 'next/navigation'

export default function NavBar() {
  type NavItem = {
    title: string;
    path: string;
  };

  const navigation: NavItem[] = [
    {
      title: "Home",
      path: "/",
    },
    {
      title: "Contacts",
      path: "/contacts",
    },
    {
      title: "Proposals",
      path: "/proposals",
    },
  ];

  const pathname = usePathname()

  return (
    <nav className="bg-blue-500 text-white h-12 flex items-center justify-center gap-12">
      {navigation.map((navItem) => (
        <Link key={navItem.title} href={navItem.path}>
          <div className={pathname === navItem.path ? "underline font-bold" : "font-bold"}>{navItem.title}</div>
        </Link>
      ))}
    </nav>
  );
}
