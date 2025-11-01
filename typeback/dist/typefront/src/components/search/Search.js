"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SearchBar;
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const lrc_1 = require("../../services/lrc");
const SearchInput_1 = require("./SearchInput");
const SearchResults_1 = require("./SearchResults");
function SearchBar() {
    const navigate = (0, react_router_dom_1.useNavigate)();
    const [query, setQuery] = (0, react_1.useState)('');
    const [results, setResults] = (0, react_1.useState)([]);
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const controllerRef = (0, react_1.useRef)(null);
    const debouncedQuery = useDebounce(query, 300);
    (0, react_1.useEffect)(() => {
        if (!debouncedQuery || debouncedQuery.trim().length < 2) {
            setResults([]);
            setError(null);
            return;
        }
        controllerRef.current?.abort();
        const controller = new AbortController();
        controllerRef.current = controller;
        setIsLoading(true);
        setError(null);
        (0, lrc_1.searchSongs)({ q: debouncedQuery })
            .then(setResults)
            .catch((e) => {
            if (e instanceof Error && e.name === 'AbortError')
                return;
            setError('Search failed. Please try again.');
        })
            .finally(() => setIsLoading(false));
        return () => controller.abort();
    }, [debouncedQuery]);
    return (<div className="w-full max-w-2xl">
      <SearchInput_1.default value={query} onChange={setQuery}/>
      <SearchResults_1.default isLoading={isLoading} error={error} results={results} debouncedQuery={debouncedQuery} onSelect={r => navigate(`/game/${r.id}`)}/>
    </div>);
}
function useDebounce(value, delayMs) {
    const [debounced, setDebounced] = (0, react_1.useState)(value);
    (0, react_1.useEffect)(() => {
        const id = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(id);
    }, [value, delayMs]);
    return debounced;
}
//# sourceMappingURL=Search.js.map