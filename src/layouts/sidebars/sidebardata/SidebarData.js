import * as Icon from 'react-feather';

const SidebarData = [
  { caption: 'Home' },
  {
    title: 'Competitors',
    href: '/competitors',
    icon: <Icon.Database />,
    collapisble: false,
    roles: ['admin', 'user'],
  },
  { title: 'Delete', href: '/delete', icon: <Icon.Trash2 />, collapisble: false, roles: ['admin'] },
  { title: 'Users', href: '/users', icon: <Icon.Users />, collapisble: false, roles: ['admin'] },
];

export default SidebarData;
