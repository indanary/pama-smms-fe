export const SidebarMenuList: SidebarMenu[] = [
  {
    route: '/',
    icon: 'dashboard',
    name: 'Dashboard',
  },
  {
    icon: 'list_alt',
    name: 'Booking',
    children: [
      {
        route: '/bookings',
        icon: 'list_alt',
        name: 'All Bookings',
        permission: ['super_admin', 'admin', 'planner', 'inventory', 'purchasing', 'warehouse'],
      },
      {
        route: '/bookings/outstanding',
        icon: 'list_alt',
        name: 'Outstanding Bookings',
        permission: ['super_admin', 'admin', 'planner', 'inventory', 'purchasing', 'warehouse'],
      },
    ],
  },
  {
    route: '/items',
    icon: 'inventory_2',
    name: 'Item Part',
    permission: ['super_admin', 'admin', 'planner', 'inventory', 'purchasing', 'warehouse'],
  },
  {
    route: '/users',
    icon: 'person',
    name: 'User',
    permission: ['super_admin', 'admin'],
  },
]
