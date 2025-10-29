export default function SearchBar() {
  return (
    <div className="w-full flex flex-col items-center gap-3 px-4">
      <div className="w-full max-w-2xl flex items-center gap-3  bg-white text-gray-900 border border-gray-200 shadow-sm px-5 py-3 focus-within:ring-2 focus-within:ring-blue-500">
        <input
          className="w-full bg-transparent outline-none placeholder:text-gray-400 text-base"
          placeholder="Search"
          autoFocus
        />
      </div>
    </div>
  )
}


