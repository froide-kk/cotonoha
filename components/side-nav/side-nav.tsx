
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
        path: "/diary",
        label: "日記",
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
            path: "/settings#account",
            label: "アカウント",
            icon: "user",
          },
          {
            path: "/settings#notifications",
            label: "通知",
            icon: "bell",
          },
          {
            path: "/settings#display",
            label: "表示",
            icon: "monitor",
          },
          {
            path: "/settings#theme",
            label: "テーマ",
            icon: "palette",
          },
          {
            path: "/settings#language",
            label: "言語",
            icon: "globe",
          },
        ],
      },
    ];
    console.log('テスト')

    const pathname = usePathname();
    const currentFullPath = pathname + (typeof window !== "undefined" ? window.location.hash : "");
    console.log(currentFullPath)
    // //パスの先頭が"/settings"で始まるか
    // const [settingsExpanded, setSettingsExpanded] = useState(pathname.startsWith("/settings"))

    // // 現在のパスがアイテムのパスと一致するか、またはサブアイテムのパスと一致するかをチェック
    // const isActiveItem = (item: any) => {
    //   if (pathname === item.path) return true
    //   if (item.subItems && item.subItems.some((subItem: any) => pathname + window.location.hash === subItem.path))
    //     return true
    //   return false
    //   }

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
    // // 設定メニューの展開/折りたたみを切り替える
    // const toggleSettingsMenu = () => {
    //   setSettingsExpanded(!settingsExpanded)
    // }

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
