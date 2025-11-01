"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_router_dom_1 = require("react-router-dom");
const Home_1 = require("./pages/Home");
const Profile_1 = require("./pages/Profile");
const Login_1 = require("./pages/Login");
const Game_1 = require("./pages/Game");
function App() {
    return (<react_router_dom_1.Routes>
      <react_router_dom_1.Route path="/" element={<Home_1.default />}/>
      <react_router_dom_1.Route path="/profile" element={<Profile_1.default />}/>
      <react_router_dom_1.Route path="/login" element={<Login_1.default />}/>
      <react_router_dom_1.Route path="/game/:id" element={<Game_1.default />}/>
    </react_router_dom_1.Routes>);
}
exports.default = App;
//# sourceMappingURL=App.js.map