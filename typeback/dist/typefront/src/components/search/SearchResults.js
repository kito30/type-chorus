"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchResults;
const MusicSearchCard_1 = require("./MusicSearchCard");
function SearchResults({ isLoading, error, results, debouncedQuery, onSelect, }) {
    return (<>
      {(isLoading || error || (debouncedQuery && debouncedQuery.trim().length >= 2)) && (<div className="mt-3 rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm max-h-96 overflow-auto">
          {isLoading && (<div className="px-4 py-3 text-sm">Searching…</div>)}
          {error && (<div className="px-4 py-3 text-sm text-red-600">{error}</div>)}
          {!isLoading && !error && results.length > 0 && (<ul>
              {results.map((r) => (<li key={r.id}>
                  <MusicSearchCard_1.default result={r} onSelect={onSelect}/>
                </li>))}
            </ul>)}
          {!isLoading && !error && debouncedQuery && debouncedQuery.trim().length >= 2 && results.length === 0 && (<div className="px-4 py-3 text-sm text-gray-600">No results</div>)}
        </div>)}
    </>);
}
//# sourceMappingURL=SearchResults.js.map