export interface HousingProperty {
  id?: string;
  title: string;
  price_uf: number;
  price_clp?: number;
  m2_total: number;
  m2_built?: number;
  bedrooms?: number;
  bathrooms?: number;
  parking?: number;
  location: string;
  lat?: number;
  lng?: number;
  url: string;
  source: 'toctoc' | 'portal_inmobiliario' | 'sii';
  type: 'casa' | 'departamento' | 'terreno';
  last_seen?: Date;
}

export interface HousingAnalysis {
  properties: HousingProperty[];
  stats: {
    avg_uf_m2: number;
    sample_size: number;
    price_range: { min: number; max: number };
  };
  environment_score: number;
  investment_rating: 'A' | 'B' | 'C' | 'D';
  ai_synthesis?: string;
}

export interface BoundingBox {
  sw: { lat: number; lng: number };
  ne: { lat: number; lng: number };
}
