import { addCssRule, CssRule } from "./services/stylesheet";

// Component()
// - Geeft html met uniek data-am-cid (component id)
// - Subscribed op "after-render-event" met "cid"
// - De "after-render" krijgt het element mee, hierdoor kun je in de after render alle event handlers opzetten
// - Je kunt child elementen altijd een data-am-pcid geven (parent-component-id) 
// - Kan specifieke functies hebben, die iets met het component doen, kan op basis van "cid" of element zijn dat kan de dev zelf beslissen.

// am.subscribe()
// am.unsubscribe() 
// am.publish()
// am.refresh(component: fn, cid: string) => Dit is een rerender van het hele component

// am.render()
// Het zetten van de innerhtml moet je via een specifieke am.render() functie doen.
// Deze vraagt alle data-cids op voor rendering en vergelijkt deze met de data-cids na rendering.
// Voor alle data-cids die verdwenen zijn, wordt het "after-render" event, "unsubscribed".
// Voor alle data-cids die er zijn, wordt het "after-render" event, "published".

console.log("geladen!");

let instances = 0;
const name = "endless-scroll";

const pageHeader: CssRule = {
    selector: name,
    style: {
        display: "block"
    }
};
addCssRule(pageHeader);

export function endlessScroll(records: IRecord): string 
{
    const cid = instances += 1;

    let childs = "";
    for(let i=0; i < 10000; i++) {
        childs += `<div>Dit is element ${i}</div>\n`;
    }

    const result = `<${name} data-cid="${cid}">${childs}</${name}>`;

    return result;
}

export interface IRecord
{
    id: number;
}
