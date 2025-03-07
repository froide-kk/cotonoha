import NavItem from "./side-nav-item";

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
      },
    ];
  
    return (
      <aside className="h-full w-64 border-r border-r-foreground/10 hidden md:block">
        <div className="flex h-full flex-col py-8">
          <div className="mb-8 px-6">
            <h2 className="font-semibold text-lg">メニュー</h2>
          </div>
          <nav className="flex-1">
            <ul className="space-y-1 px-2">
              {navItems.map((item) => (
                <NavItem key={item.path} path={item.path} label={item.label} icon={item.icon} />
              ))}
            </ul>
          </nav>
        </div>
      </aside>
    );
  }