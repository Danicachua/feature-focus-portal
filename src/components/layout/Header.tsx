
import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="flex h-16 items-center px-4 gap-4">
        <div className="flex-1 flex items-center gap-4">
          <div className="w-72 relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            <Input placeholder="Search products..." className="pl-8" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5 text-gray-500" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-purple-500" />
          </Button>
          <Avatar>
            <AvatarFallback className="bg-purple-100 text-purple-500">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
