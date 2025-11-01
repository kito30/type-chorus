"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
const react_router_dom_1 = require("react-router-dom");
const App_1 = require("./App");
require("./styles/style.css");
client_1.default.createRoot(document.getElementById("root")).render(<react_router_dom_1.BrowserRouter>
    <App_1.default />
  </react_router_dom_1.BrowserRouter>);
//# sourceMappingURL=main.js.map