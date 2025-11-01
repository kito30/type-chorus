"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const Search_1 = require("../components/search/Search");
const react_router_dom_1 = require("react-router-dom");
const logo_svg_1 = require("../../assets/logo.svg");
const Home = () => {
    return (<div className="min-h-screen flex flex-col bg-(--color-home-bg) text-(--color-text)">
      <header className="flex items-center justify-between w-full px-6 py-4">
        <div className="pl-4">
          <react_router_dom_1.Link to="/" className="text-(--color-text) font-semibold hover:text-gray-300">Type Chorus</react_router_dom_1.Link>
        </div>
        <div className="">
          <react_router_dom_1.Link to="/profile" className="flex items-center justify-center rounded-full transition-all duration-200 ease-in-out hover:scale-150 hover:opacity-80 hover:-translate-x-3">
            <img src="https://cdn-icons-png.flaticon.com/512/847/847969.png" alt="Profile" className="w-10 h-10 object-cover rounded-full"/>
          </react_router_dom_1.Link>
        </div>
      </header>
   
      <main className="flex-1 flex flex-col items-center justify-center">
          <img src={logo_svg_1.default} alt="Logo" className="w-2xl"/>
          <Search_1.default />
      </main>
    </div>);
};
exports.default = Home;
//# sourceMappingURL=Home.js.map