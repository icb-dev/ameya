export type ProjectStatus = "ongoing" | "completed";

export interface ProjectMeta {
  slug: string;
  project_name: string;
  status: ProjectStatus;
  sector: string;
  city: string;
  project_type: string;
  project_logo: string;
  project_thumbnail: string;
  featured?: "yes" | "no";
}

// HERO
export interface HeroSectionData {
  logo: string;
  background_banner: string;
}

// OVERVIEW (generic – used by commercial + edit page)
export interface OverviewSectionData {
  heading: string;
  description: string;
  image: string; // Keep for backward compatibility
  images?: string[]; // New: multiple images support
  // Optional list of key features (primarily used for residential edit)
  key_features?: string[];
}
 
  export interface HighlightsSectionData {
    highlights: string[];
    image: string;
    size: string;
    type: string;
    description: string;
  }
  

  // SINGLE MIX CARD
export interface MixItem {
    image: string;
    title: string;
    description: string;
  }
  
  // MIX SECTION
  export interface MixSectionData {
    items: MixItem[];
  }
  

  // SINGLE AMENITY
export interface AmenityItem {
    image: string;
    name: string;
  }
  
  // AMENITIES SECTION
  export interface AmenitiesSectionData {
    items: AmenityItem[];
  }

  // LOCATION SECTION
  
// LOCATION ADVANTAGE TYPES

export interface LocationItem {
  name: string;
  distance_time: string;
}

export interface LocationSectionData {
  locations: LocationItem[];
  map_url: string;
}


// GALLERY SECTION
export interface GallerySectionData {
  images: string[];
 
}
// SINGLE MEDIA URL
export interface MediaUrlItem {
  url: string;
}

// MEDIA / VIDEO SECTION
export interface MediaSectionData {
  items: MediaUrlItem[];
}

// SINGLE FAQ
export interface FaqItem {
  question: string;
  answer: string;
}

// FAQ SECTION
export interface FaqSectionData {
  items: FaqItem[];
}

// RERA SECTION (common to commercial and residential)
export interface ReraSectionData {
  rera: string;
}

/* =========================
   Residential Project types
========================= */

// RESIDENTIAL HERO (same structure as generic hero)
export interface ResidentialHeroSectionData {
  logo: string;
  background_banner: string;
}

// RESIDENTIAL OVERVIEW
export interface ResidentialOverviewSectionData {
  heading: string;
  description: string;
  // Dynamic list of key features / bullets
  key_features: string[];
  // Single primary image (uploaded dynamically) - kept for backward compatibility
  image: string;
  // Multiple images support
  images?: string[];
}

// RESIDENTIAL PROJECT HIGHLIGHTS
export interface ResidentialHighlightItem {
  image: string;
  title: string;
  description: string;
}

export interface ResidentialHighlightsSectionData {
  // Dynamic list of highlight cards
  items: ResidentialHighlightItem[];
}

// IMMERSIVE TOUR SECTION
export interface ImmersiveTourSectionData {
  // Optional primary URL (e.g. 360 tour)
  url1: string;
  // Secondary / generic URL
  url: string;
  // Preview image for the tour
  image: string;
}

// RESIDENTIAL AMENITIES
// Reuse AmenityItem / AmenitiesSectionData from above
export type ResidentialAmenityItem = AmenityItem;
export type ResidentialAmenitiesSectionData = AmenitiesSectionData;

// LOCATION ADVANTAGE
// Reuse LocationItem but expose a more explicit alias for clarity
export type ResidentialLocationItem = LocationItem;

export interface ResidentialLocationSectionData {
  locations: ResidentialLocationItem[];
  // Map location / embed URL
  map_location: string;
}

// UNIT LAYOUT
export interface UnitLayoutItem {
  title: string;
  description: string;
}

export interface UnitLayoutSectionData {
  // Dynamic list of layout cards
  items: UnitLayoutItem[];
}

// RESIDENTIAL GALLERY
export interface ResidentialGallerySectionData {
  // Multiple gallery images
  images: string[];
  // Multiple YouTube (or other video) links
  youtube_links: string[];
}

// RESIDENTIAL FAQS
export type ResidentialFaqItem = FaqItem;

export interface ResidentialFaqSectionData {
  items: ResidentialFaqItem[];
}

