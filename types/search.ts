export interface SearchFilters {
  query?: string;
  category?: string;
  sortBy?: string;
  tags?: string[];
  contentType?: "all" | "premium" | "free";
  authors?: string[];
  dateRange?: { from?: Date; to?: Date };
  voteRange?: { min: number; max: number };
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}
