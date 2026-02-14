export interface CategorySaturation {
  count: number;
  level: 'CRITICA' | 'ALTA' | 'MEDIA' | 'BAJA' | 'NULA';
  names: string[];
}

export interface TerritorialDataBlock {
  saturation: unknown;
  oceanoAzul: string | null;
  oceanoRojo: string | null;
  restaurants?: unknown[];
  anchors?: unknown[];
}
