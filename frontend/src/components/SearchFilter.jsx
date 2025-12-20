import { Search, Tag, X } from 'lucide-react';

const SearchFilter = ({ 
  searchQuery = '', 
  keywordFilter = '', 
  onSearchChange, 
  onKeywordChange 
}) => {
  return (
    <div className="card-elevated p-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Text Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search transcript text..."
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="input-field pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Keyword Filter */}
        <div className="flex-1 relative">
          <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by keyword..."
            value={keywordFilter}
            onChange={(e) => onKeywordChange?.(e.target.value)}
            className="input-field pl-10 pr-10"
          />
          {keywordFilter && (
            <button
              onClick={() => onKeywordChange?.('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
