export interface Artwork {
  id: number;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  artist: string;
  category: string;
  categoryId: number;
  artistId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtworkFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
} 