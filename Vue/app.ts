import { endlessScroll } from "./endless-scroll";
import { render } from "./services/render";
import { addCssRule, CssRule } from "./services/stylesheet";

console.log("app - started");

const pageHeader: CssRule = {
    selector: "page-header",
    style: {
        display: "block"
    }
};
addCssRule(pageHeader);

const pageContent: CssRule = {
    selector: "page-content",
    style: {
        display: "block"
    }
};
addCssRule(pageContent);

console.time("rendering");
render("page-content", endlessScroll(null));
console.timeEnd("rendering");