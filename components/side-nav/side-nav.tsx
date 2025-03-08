
"use client";

import { usePathname } from "next/navigation";
import NavItem from "./side-nav-item";
import { useEffect, useState } from "react";

export default function SideNav() {
    const navItems = [
      {
        path: "/timeline",
        label: "タイムライン",
        icon: "home",
      },
      {
        path: "/diary/new",
        label: "日記を書く",
        icon: "book-open",
      },
      {
        path: "/profile",
        label: "プロフィール",
        icon: "user",
      },
      {
        path: "/settings",
        label: "設定",
        icon: "settings",
        subItems: [
          {
            path: "/settings/password",
            label: "アカウント",
            icon: "user",
          },
        ],
      },
    ];

    const pathname = usePathname();
    const currentFullPath = pathname + (typeof window !== "undefined" ? window.location.hash : "")

    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    useEffect(() => {
      const activeItem = navItems.find(
        (item) => item.subItems && item.subItems.some((sub) => sub.path === currentFullPath)
      );
      if (activeItem) setExpandedMenu(activeItem.path);
    }, [pathname]);

    const toggleMenu = (path: string) => {
      setExpandedMenu(expandedMenu === path ? null : path);
    };

    return (
      <aside className="h-full w-64 border-r border-r-foreground/10 hidden md:block">
        <div className="flex h-full flex-col py-8">
          <div className="mb-8 px-6">
            <h2 className="font-semibold text-lg">メニュー</h2>
          </div>
          <nav className="flex-1">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <NavItem
                key={item.path}
                path={item.path}
                label={item.label}
                icon={item.icon}
                subItems={item.subItems}
                isExpanded={expandedMenu === item.path}
                onToggle={() => toggleMenu(item.path)}
              />
            ))}
          </ul>
          </nav>
        </div>
      </aside>
    );
  }
