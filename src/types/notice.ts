export interface Notice {
  id: string;
  title: string;
  message: string;
  pinned: boolean;
  publishedAt: string; // YYYY-MM-DD
  createdAt: string;
}
