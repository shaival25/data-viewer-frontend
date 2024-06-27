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

  { caption: 'Tables' },
  {
    title: 'Basic Table',
    href: '/tables/basic-table',
    icon: <Icon.Codepen />,
    id: 4.1,
    collapisble: false,
  },
  {
    title: 'React Table',
    href: '/tables/react-table',
    icon: <Icon.Disc />,
    id: 4.2,
    collapisble: false,
  },
  {
    title: 'Bootstrap Datatable',
    href: '/tables/data-table',
    icon: <Icon.HardDrive />,
    id: 4.3,
    collapisble: false,
  },
  { caption: 'Charts' },
  {
    title: 'Apexchart',
    href: '/charts/apex',
    icon: <Icon.Loader />,
    id: 5.1,
    collapisble: false,
  },
  {
    title: 'ChartJs',
    href: '/charts/chartjs',
    icon: <Icon.PieChart />,
    id: 5.2,
    collapisble: false,
  },
  { caption: 'Extra' },

  {
    title: 'Widget',
    href: '/widget',
    icon: <Icon.Grid />,
    id: 6.4,
    collapisble: false,
  },

  {
    title: 'Vector Map',
    href: '/map/vector',
    icon: <Icon.Map />,
    id: 6.3,
    collapisble: false,
  },

  {
    title: 'DD Menu',
    href: '/',
    id: 7,
    collapisble: true,
    icon: <Icon.Disc />,
    children: [
      {
        title: 'Simple dd 1',
        href: '/',
        icon: <Icon.Disc />,
      },
      {
        title: 'Simple dd 2',
        href: '/',
        icon: <Icon.Disc />,
      },
      {
        title: 'Simple dd 3',
        href: '/',
        icon: <Icon.Disc />,
        children: [
          {
            title: 'Simple dd 1.1',
            href: '/alerts',
            icon: <Icon.Disc />,
          },
        ],
      },
    ],
  },
];

export default SidebarData;
