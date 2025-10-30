export default function SearchBar() {
  return (
      <div className="w-full max-w-2xl flex items-center gap-3 rounded-full bg-white text-gray-900 border border-gray-200 shadow-sm px-5 py-3 focus-within:ring-2 focus-within:ring-blue-500">
        <input className="w-full bg-transparent outline-none placeholder:text-gray-400 text-base" placeholder="Search" autoFocus />
        <button className="bg-blue-500 text-white px-2 py-2 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </button>
      </div>
  )
}


