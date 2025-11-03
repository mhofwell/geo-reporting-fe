import { ChevronsUpDown, LogOut, SlidersHorizontal, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

interface UserProfileSidebarProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  onNavigateToAccountSettings?: () => void;
  onNavigateToPreferences?: () => void;
  onLogout?: () => void;
}

export function UserProfileSidebar({
  user,
  onNavigateToAccountSettings,
  onNavigateToPreferences,
  onLogout
}: UserProfileSidebarProps) {
  const defaultUser = {
    name: 'GEO User',
    email: 'user@example.com',
    avatar: undefined,
  };

  const currentUser = user || defaultUser;
  const initials = currentUser.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{currentUser.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {currentUser.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side="bottom"
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="rounded-lg">{initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{currentUser.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {currentUser.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onNavigateToAccountSettings}
              className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <User className="mr-2 h-4 w-4" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onNavigateToPreferences}
              className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Preferences
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onLogout}
              className="cursor-pointer focus:bg-sidebar-accent focus:text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
