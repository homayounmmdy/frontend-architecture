import { Input } from "@commerceos/ui/input";
import { Select } from "@commerceos/ui/select";
import type { Collection } from "../../domain/catalog.types";

interface SearchFiltersProps {
  search: string;
  category: string;
  status: string;
  collectionId: string;
  categories: string[];
  collections: Collection[];
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  onCollectionIdChange: (value: string) => void;
}

export function SearchFilters({
  search,
  category,
  status,
  collectionId,
  categories,
  collections,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onCollectionIdChange,
}: SearchFiltersProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Input placeholder="Search by product name" value={search} onChange={(event) => onSearchChange(event.target.value)} />
      <Select value={category} onChange={(event) => onCategoryChange(event.target.value)}>
        {categories.map((option) => (
          <option key={option} value={option}>
            {option === "all" ? "All categories" : option}
          </option>
        ))}
      </Select>
      <Select value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="all">All statuses</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="archived">Archived</option>
      </Select>
      <Select value={collectionId} onChange={(event) => onCollectionIdChange(event.target.value)}>
        <option value="all">All collections</option>
        {collections.map((collection) => (
          <option key={collection.id} value={collection.id}>
            {collection.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
