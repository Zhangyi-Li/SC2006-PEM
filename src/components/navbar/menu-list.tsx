/** @format */

import {
  Star,
  FileSliders,
  BellDot,
  MapPin,
  Settings,
  LucideIcon,
} from "lucide-react";

type Menu = {
  href: string;
  label: string;
  active: boolean;
  icon: LucideIcon;
};

export function getMenuList(pathname: string): Menu[] {
  return [
    {
      href: "/home",
      label: "Rating",
      active: pathname.includes("/home"),
      icon: Star,
    },
    {
      href: "/rating-config",
      label: "Rating Config",
      active: pathname === "/rating-config",
      icon: FileSliders,
    },
    {
      href: "/notification",
      label: "Notification",
      active: pathname.includes("/notification"),
      icon: BellDot,
    },
    {
      href: "/map",
      label: "Map",
      active: pathname === "/map",
      icon: MapPin,
    },
    {
      href: "/setting",
      label: "Setting",
      active: pathname.includes("/setting"),
      icon: Settings,
    },
  ];
}
