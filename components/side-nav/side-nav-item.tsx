
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, User, Settings, Bell, Monitor, Palette, Globe, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface NavItemProps {
  path: string;
  label: string;
  icon: string;
  subItems?: { path: string; label: string; icon: string }[];
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function NavItem({ path, label, icon, subItems, isExpanded, onToggle }: NavItemProps) {
  //現在のURLのパス名を返す
  const pathname = usePathname();
  // //現在のURLのパス名とサイドバーで選択したパス名が一致するか確認する
  // const isActive = pathname === path;

  const currentFullPath = pathname + (typeof window !== "undefined" ? window.location.hash : "");
  // console.log(currentFullPath)

  // サブアイテムの状態を管理
  const [activeSubItem, setActiveSubItem] = useState<string | null>(null);

  const isActive =
  pathname === path ||
  (subItems && subItems.some((sub) => currentFullPath === sub.path));

  const handleSubComponent = (subItemPath: string) => {
    setActiveSubItem(subItemPath); // サブアイテムのパスをアクティブにする
  };

  const IconComponent = (iconName: string) => {
    switch (iconName) {
      case "home":
        return <Home className="mr-3 h-5 w-5" />;
      case "book-open":
        return <BookOpen className="mr-3 h-5 w-5" />;
      case "user":
        return <User className="mr-3 h-5 w-5" />;
      case "settings":
        return <Settings className="mr-3 h-5 w-5" />;
      case "bell":
        return <Bell className="mr-3 h-5 w-5" />;
      case "monitor":
        return <Monitor className="mr-3 h-5 w-5" />;
      case "palette":
        return <Palette className="mr-3 h-5 w-5" />;
      case "globe":
        return <Globe className="mr-3 h-5 w-5" />;
      default:
        return <Home className="mr-3 h-5 w-5" />;
    }
  };
 
  return (
    <li>
       {subItems ? (
        <>
          <button
            className={`flex justify-between items-center w-full p-3 rounded-lg text-sm font-medium transition-colors ${
              isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground"
            }`}
            onClick={onToggle}
          >
            <div className="flex items-center">
              {IconComponent(icon)}
              <span>{label}</span>
            </div>
            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>

          {/* サブメニュー */}
          {isExpanded && (
            <ul className="ml-6 mt-2 space-y-1">
              {subItems.map((subItem) => {
                const isSubItemActive = activeSubItem === subItem.path || pathname.startsWith(subItem.path);
                return (
                  <li key={subItem.path}>
                    <Link
                      href={subItem.path}
                      onClick={() => handleSubComponent(subItem.path)}
                      className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isSubItemActive
                          ? "bg-primary text-primary-foreground"
                          : "text-foreground/70 hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      {IconComponent(subItem.icon)}
                      <span>{subItem.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )  : (
        <Link
          href={path}
          className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
            isActive ? "bg-primary text-primary-foreground" : "text-foreground/70 hover:bg-muted hover:text-foreground"
          }`}
        >
          {IconComponent(icon)}
          <span>{label}</span>
        </Link>
      )}
    </li>
  );
}
