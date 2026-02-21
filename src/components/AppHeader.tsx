import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
import { Car, Bell, User, LogOut, Calendar, Settings, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const AppHeader = () => {
  // const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [notifications] = useState(3);

  const navItems = [
    { label: "Dashboard", path: "/" },
    { label: "My Bookings", path: "/bookings" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
            <Car className="w-6 h-6 text-white" />
          </div>
          <span className="font-orbitron text-xl font-bold text-foreground hidden sm:block">
            AutoAI
          </span>
        </div>

        {/* Nav Links */}
        { (
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Button
                key={item.path}
                variant="ghost"
                onClick={() => navigate(item.path)}
                className={`px-4 ${
                  location.pathname === item.path
                    ? "text-cyber-cyan bg-cyber-cyan/10"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Button>
            ))}
          </nav>
        )}

        {/* Right side */}
        <div className="flex items-center gap-2">
          { (
            <>
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="w-5 h-5 text-muted-foreground" />
                {notifications > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 px-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-foreground">
                      {"Parth"}
                    </span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-card border-border">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="font-medium text-foreground">{"Parth"}</p>
                    <p className="text-sm text-muted-foreground">{"Parth"}</p>
                  </div>
                  <DropdownMenuItem onClick={() => navigate("/bookings")} className="cursor-pointer">
                    <Calendar className="w-4 h-4 mr-2" />
                    My Bookings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem  className="cursor-pointer text-red-400">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) 
          // : (
          //   <Button
          //     onClick={() => navigate("/auth")}
          //     className="bg-gradient-to-r from-cyber-cyan to-cyber-purple text-background font-medium"
          //   >
          //     Sign In
          //   </Button>
          // )
          }
        </div>
      </div>
    </header>
  );
};
