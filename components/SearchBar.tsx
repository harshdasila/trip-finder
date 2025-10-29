import { Search, X } from "lucide-react";

export const SearchBar = ({ searchQuery, setSearchQuery, handleSearch }: any) => {
  return (
    <div className="flex-1 max-w-md">
      <div className="relative flex items-center">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search trips by name or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="w-full pl-12 pr-12 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-400 shadow-sm hover:shadow-md"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-14 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={handleSearch}
          className="ml-2 p-2.5 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Search className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
