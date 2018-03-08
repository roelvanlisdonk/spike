"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const endless_scroll_1 = require("./endless-scroll");
const render_1 = require("./services/render");
const stylesheet_1 = require("./services/stylesheet");
console.log("app - started");
const pageHeader = {
    selector: "page-header",
    style: {
        display: "block"
    }
};
stylesheet_1.addCssRule(pageHeader);
const pageContent = {
    selector: "page-content",
    style: {
        display: "block"
    }
};
stylesheet_1.addCssRule(pageContent);
console.time("rendering");
render_1.render("page-content", endless_scroll_1.endlessScroll(null));
console.timeEnd("rendering");
//# sourceMappingURL=app.js.map