
"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, User, Settings } from "lucide-react";

interface NavItemProps {
  path: string;
  label: string;
  icon: string;
}

export default function NavItem({ path, label, icon }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === path;
  
  const IconComponent = () => {
    switch (icon) {
      case "home":
        return <Home className="mr-3 h-5 w-5" />;
      case "book-open":
        return <BookOpen className="mr-3 h-5 w-5" />;
      case "user":
        return <User className="mr-3 h-5 w-5" />;
      case "settings":
        return <Settings className="mr-3 h-5 w-5" />;
      default:
        return <Home className="mr-3 h-5 w-5" />;
    }
  };

  return (
    <li>
      <Link
        href={path}
        className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
          isActive
            ? "bg-primary text-primary-foreground"
            : "text-foreground/70 hover:bg-muted hover:text-foreground"
        }`}
      >
        <IconComponent />
        <span>{label}</span>
      </Link>
    </li>
  );
}