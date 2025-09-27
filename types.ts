import type { ReactNode } from 'react';

export interface Review {
  id: string;
  author: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface FacultyMember {
  id:string;
  name: string;
  title: string;
  email: string;
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Location {
  id:string;
  name:string;
  description: string;
  position: {
    x: number; // percentage
    y: number; // percentage
  };
  streetViewImage: string | null;
  icon?: ReactNode;
  iconId?: string;
  color?: string;
  // New fields for the Department Navigator panel
  shortName?: string;
  rating?: number;
  building?: string;
  timings?: string;
  tags?: string[];
  phone?: string;
  email?: string;
  // Richer data fields
  faculty?: FacultyMember[];
  notices?: Notice[];
  reviews?: Review[];
}

export type Theme = 'light' | 'dark';

export type ViewMode = 'classic' | 'futuristic';

export type FuturisticTab = 'Campus Map' | 'Street View' | 'Upload 360°' | '360 View';

export type User = {
  uid: string;
  type: 'guest' | 'admin';
  name: string;
} | null;
