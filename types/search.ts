export interface SearchFilters {
  query?: string;
  category?: string;
  sortBy?: string;
  dateRange?: string;
}

export interface SavedSearch {
  id: string;
  name: string;
  filters: SearchFilters;
  createdAt: Date;
}
