"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { User, Bell, Monitor, Palette, Globe } from "lucide-react"

const items = [
  {
    title: "アカウント",
    href: "/settings#account",
    icon: User,
  },
  {
    title: "通知",
    href: "/settings#notifications",
    icon: Bell,
  },
  {
    title: "表示",
    href: "/settings#display",
    icon: Monitor,
  },
  {
    title: "テーマ",
    href: "/settings#theme",
    icon: Palette,
  },
  {
    title: "言語",
    href: "/settings#language",
    icon: Globe,
  },
]

export default function SettingsNav() {
  const pathname = usePathname()

  return (
    <nav className="grid items-start gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            buttonVariants({ variant: "ghost" }),
            pathname === item.href ? "bg-muted hover:bg-muted" : "hover:bg-transparent hover:underline",
            "justify-start",
          )}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}

