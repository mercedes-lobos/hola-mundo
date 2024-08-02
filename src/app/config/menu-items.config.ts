import { Injectable } from '@angular/core';

export enum Type {
  Link = 'link',
  Sub = 'sub',
  ExtLink = 'extLink',
  ExtTabLink = 'extTabLink',
}

export interface MenuTag {
  color: string; // background color
  value: string;
}

export interface MenuPermissions {
  only?: string | string[];
  except?: string | string[];
}

export interface MenuChildrenItem {
  route: string;
  name: string;
  type: Type;
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
}
export interface Menu {
  state: string;
  name: string;
  type: Type;
  icon: string;
  badge?: MenuTag;
  label?: MenuTag;
  children?: MenuChildrenItem[];
  permissions?: MenuPermissions;
}

const MENUITEMS = [
  {
    state: 'auth/login',
    name: 'Inicio',
    type: Type.Link,
    icon: 'home',
  },
  {
    state: 'profesional',
    name: 'Reempadronamiento',
    type: Type.Link,
    icon: 'account_circle',
  },
  {
    state: '',
    name: 'Mis Certificados',
    type: Type.Link,
    icon: 'web',
  },
  {
    state: '',
    name: 'Pagos',
    type: Type.Link,
    icon: 'monetization_on',
  },
  {
    state: '',
    name: 'Mesa de Ayuda',
    type: Type.Link,
    icon: 'help',
  },
  {
    state: 'documentos',
    name: 'Documentos Importantes',
    type: Type.Link,
    icon: 'archive',
  },
  {
    state: 'button',
    type: Type.Sub,
    name: 'Buttons',
    icon: 'crop_7_5',
    children: [
      {
        route: 'colors',
        name: 'colors',
        type: Type.Link,
      },
      {
        route: 'icons',
        name: 'icons',
        type: Type.Link,
      },
    ],
  },
];

@Injectable()
export class MenuItems {
  getMenuitem(): Menu[] {
    return MENUITEMS;
  }
}
