// ✅ Subcategory Type Definition
export interface SubCategory {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  slug: string;
  image: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    type: string; // e.g., "SERVICE"
  };
}

// ✅ Full API Response Type
export interface SubCategoryResponse {
  data: SubCategory[];
}
