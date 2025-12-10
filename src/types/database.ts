// Database Types for Multi-tenant Career Site Builder

export interface Company {
  id: string
  name: string
  created_at: string
}

export interface CompanyUser {
  id: string
  user_id: string
  company_id: string
  role: 'owner' | 'admin' | 'editor'
  email: string
  created_at: string
}

export interface CompanyProfile {
  company_id: string
  company_name: string
  tagline: string | null
  description: string | null
  logo_url: string | null
  favicon_url: string | null
  primary_color: string | null
  secondary_color: string | null
  hero_title: string | null
  hero_subtitle: string | null
  hero_description: string | null
  hero_cta_label: string | null
  hero_background_url: string | null
  social_preview_url: string | null
  updated_at: string
}

export interface LifeSection {
  company_id: string
  heading: string | null
  description_primary: string | null
  description_secondary: string | null
  image_url: string | null
  updated_at: string
}

export interface ValueItem {
  id: string
  company_id: string
  title: string
  description: string | null
  icon: string | null
  order_index: number
  updated_at: string
}

export interface Location {
  id: string
  company_id: string
  city: string
  country: string
  address: string | null
  map_url: string | null
  image_url: string | null
  order_index: number
  updated_at: string
}

export interface Perk {
  id: string
  company_id: string
  label: string
  description: string | null
  icon: string | null
  updated_at: string
}

export interface Testimonial {
  id: string
  company_id: string
  employee_name: string
  role: string
  quote: string
  avatar_url: string | null
  order_index: number
  updated_at: string
}

export interface Job {
  id: string
  company_id: string
  title: string
  department: string
  location: string
  work_type: 'remote' | 'hybrid' | 'onsite'
  employment_type: 'full-time' | 'part-time' | 'contract' | 'internship'
  description: string
  posted_at: string
  apply_url: string | null
  updated_at: string
}

// Helper types
export type UserRole = 'owner' | 'admin' | 'editor'
export type WorkType = 'remote' | 'hybrid' | 'onsite'
export type EmploymentType =
  | 'full-time'
  | 'part-time'
  | 'contract'
  | 'internship'

// Dashboard section identifier
export type DashboardSection =
  | 'profile'
  | 'life'
  | 'values'
  | 'locations'
  | 'perks'
  | 'testimonials'
  | 'jobs'
