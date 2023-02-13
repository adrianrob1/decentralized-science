export interface PaperDetails {
  cid: number;
  title?: string | null;
  authors?: string | null;
  abstract?: string | null;
  keywords?: string[] | null;
  date?: string | null;
  doi?: string | null;
  thumbnail?: string | null;
}

export interface PaperDetailsDTO {
  cid: any;
  filename: string;
  title?: string | null;
  authors?: string | null;
  abstract?: string | null;
  keywords?: string[] | null;
  date?: string | null;
  doi?: string | null;
  thumbnail?: string | null;
}