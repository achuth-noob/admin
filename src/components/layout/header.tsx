"use client";

import { Button } from "@/components/ui/button";
import { UserCircle } from "lucide-react";

export function Header() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40 lg:h-[60px]">
      <div className="w-full flex-1">
        <form>
          <div className="relative">
            {/* Search Placeholder */}
          </div>
        </form>
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
         <UserCircle className="h-6 w-6" />
        <span className="sr-only">Toggle user menu</span>
      </Button>
    </header>
  );
}
