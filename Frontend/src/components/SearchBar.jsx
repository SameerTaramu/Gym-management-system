import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSearchedClasses } from "../features/classes/classSlice";
import { Search } from "lucide-react";
import ClassCard from "./ClassCard";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const { searchedClasses, isLoading, isError, message } = useSelector(
    (state) => state.classes
  );

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      dispatch(fetchSearchedClasses(query.trim()));
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <form onSubmit={handleSearch} className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for classes (e.g., yoga, cardio)..."
          className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 text-white px-6 py-3 rounded-full hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Search size={20} />
          Search
        </button>
      </form>

      {isLoading && <p className="text-center text-gray-500">Searching...</p>}
      {isError && <p className="text-center text-red-500">{message}</p>}

      {searchedClasses.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Search Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchedClasses.map((cls) => (
              <ClassCard key={cls._id} classData={cls} />
            ))}
          </div>
        </div>
      )}

      {searchedClasses.length === 0 && query && !isLoading && !isError && (
        <p className="text-center text-gray-500">No classes found for "{query}"</p>
      )}
    </div>
  );
};

export default SearchBar;