import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import SideNav from "@/components/side-nav/side-nav";
import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Cotonoha",
  description: "日記を共有できる幸せなアプリケーション",
  icons: { icon: "/favicon.ico" }
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // ユーザーの認証状態とオンボーディング状態を確認
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // デフォルトではサイドメニューを表示しない
  let showSideNav = false;

  // ユーザーが認証済みの場合、オンボーディング状態を確認
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_onboarded")
      .eq("id", user.id)
      .single();

    // オンボーディングが完了している場合のみサイドメニューを表示
    showSideNav = profile?.is_onboarded === true;
  }

  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col">
            <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
              <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                <div className="flex gap-5 items-center font-semibold">
                  <Link href={"/"}>
                  <span className="flex items-center">
                    <img
                      src="/COTONOHA.png"
                      alt="Cotonoha"
                      className="w-14 h-14 mr-2"
                    />
                     Cotonoha
                  </span>
                 </Link>
                </div>
                <HeaderAuth />
              </div>
            </nav>

            <div className="flex flex-1 w-full max-w-7xl mx-auto">
              {/* 条件付きでサイドメニューを表示 */}
              {showSideNav ? <SideNav /> : null}
              <div className="flex-1 p-6 md:p-8">
                {children}
              </div>
            </div>

            <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
              <p>
                Powered by{" "}
                <a
                  href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
                  target="_blank"
                  className="font-bold hover:underline"
                  rel="noreferrer"
                  />             
              </p>
              <ThemeSwitcher />
            </footer>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}