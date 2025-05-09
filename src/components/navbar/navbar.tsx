/** @format */
"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { getMenuList } from "./menu-list";

export default function NavBar() {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-[9999] flex h-16 w-full items-center justify-around bg-background shadow-[0_-2px_4px_rgba(0,0,0,0.1)] md:h-16">
      {menuList.map(({ href, label, icon: Icon, active }, index) => (
        <Link
          key={index}
          href={href}
          className="flex flex-col items-center justify-center gap-1 text-sm font-medium text-muted-foreground hover:text-primary focus:text-primary p-2 "
          prefetch={false}
        >
          {<Icon size={24} color={cn(active ? "#25D366" : "#000")} />}
          <p className={cn(active ? "text-green-500" : "text-black")}>
            {label}
          </p>
        </Link>
      ))}
    </nav>
  );
}
