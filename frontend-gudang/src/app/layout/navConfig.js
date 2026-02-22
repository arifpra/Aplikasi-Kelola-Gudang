import {
  Boxes,
  ClipboardCheck,
  Factory,
  LayoutDashboard,
  Package,
  ShieldCheck,
  ShoppingCart,
  Ruler,
  Warehouse,
  MapPin,
  Handshake,
} from 'lucide-react';
import { PERMISSIONS } from '../../shared/constants/permissions';

export const NAV = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    requiredPerm: null,
  },
  {
    key: 'master-data',
    label: 'Master Data',
    icon: Boxes,
    path: '/master-data',
    requiredPerm: PERMISSIONS.MASTERDATA_READ,
    children: [
      {
        key: 'master-data-products',
        label: 'Products',
        icon: Package,
        path: '/master-data/products',
        requiredPerm: PERMISSIONS.MASTERDATA_READ,
      },
      {
        key: 'master-data-uom',
        label: 'UOM',
        icon: Ruler,
        path: '/master-data/uom',
        requiredPerm: PERMISSIONS.MASTERDATA_READ,
      },
      {
        key: 'master-data-warehouses',
        label: 'Warehouses',
        icon: Warehouse,
        path: '/master-data/warehouses',
        requiredPerm: PERMISSIONS.MASTERDATA_READ,
      },
      {
        key: 'master-data-locations',
        label: 'Locations',
        icon: MapPin,
        path: '/master-data/locations',
        requiredPerm: PERMISSIONS.MASTERDATA_READ,
      },
      {
        key: 'master-data-partners',
        label: 'Partners',
        icon: Handshake,
        path: '/master-data/partners',
        requiredPerm: PERMISSIONS.MASTERDATA_READ,
      },
    ],
  },
  {
    key: 'purchasing',
    label: 'Purchasing',
    icon: ShoppingCart,
    path: '/purchasing',
    requiredPerm: null,
    children: [
      {
        key: 'purchasing-grn-read',
        label: 'GRN Inbox',
        icon: ClipboardCheck,
        path: '/purchasing/grn',
        requiredPerm: PERMISSIONS.GRN_READ,
      },
      {
        key: 'purchasing-grn-write',
        label: 'GRN Drafts',
        icon: ClipboardCheck,
        path: '/purchasing/grn-drafts',
        requiredPerm: PERMISSIONS.GRN_WRITE,
      },
    ],
  },
  {
    key: 'inventory',
    label: 'Inventory',
    icon: Warehouse,
    path: '/inventory',
    requiredPerm: PERMISSIONS.STOCK_READ,
    children: [
      {
        key: 'inventory-stock-overview',
        label: 'Stock Overview',
        icon: Warehouse,
        path: '/inventory/stock-overview',
        requiredPerm: PERMISSIONS.STOCK_READ,
      },
    ],
  },
  {
    key: 'manufacturing',
    label: 'Manufacturing',
    icon: Factory,
    path: '/manufacturing',
    requiredPerm: null,
    children: [
      {
        key: 'manufacturing-overview',
        label: 'Overview',
        icon: Factory,
        path: '/manufacturing',
        requiredPerm: null,
      },
    ],
  },
  {
    key: 'compliance',
    label: 'Compliance',
    icon: ShieldCheck,
    path: '/compliance',
    requiredPerm: null,
    children: [
      {
        key: 'compliance-overview',
        label: 'Overview',
        icon: ShieldCheck,
        path: '/compliance',
        requiredPerm: null,
      },
    ],
  },
];
