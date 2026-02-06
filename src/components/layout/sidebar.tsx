"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Box,
  Cpu,
  FileCode,
  Settings,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Models",
    href: "/dashboard/models",
    icon: Box,
  },
  {
    title: "GPUs",
    href: "/dashboard/gpus",
    icon: Cpu,
  },
  {
    title: "Templates",
    href: "/dashboard/templates",
    icon: FileCode,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full border-r bg-gray-100/40 dark:bg-gray-800/40">
      <div className="flex h-14 items-center border-b px-6 lg:h-[60px]">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <span className="">OneInfer Admin</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-4 text-sm font-medium">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                  pathname === item.href
                    ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50"
                    : ""
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
          <Link
            href="/auth/signin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </Link>
      </div>
    </div>
  );
}
