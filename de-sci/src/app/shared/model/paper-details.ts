export interface PaperDetails {
  id: number;
  title?: string | null;
  authors?: string | null;
  abstract?: string | null;
  keywords?: string[] | null;
  date?: string | null;
  doi?: string | null;
  thumbnail?: string | null;
}

export interface PaperDetailsDTO {
  id: any;
  title?: string | null;
  authors?: string | null;
  abstract?: string | null;
  keywords?: string[] | null;
  date?: string | null;
  doi?: string | null;
  thumbnail?: string | null;
}