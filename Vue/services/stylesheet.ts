import { toSnakeCase } from "../helpers/text/to-snake-case";

const _rules: any = {};

/**
 * An am app contains only one app stylesheet.
 * IClass extends IRule
 * IClass will be added as a IRule by setting the IClass.selector based on IClass.name.
 */
export function addCssClass(cssClass: CssClass): void {
    const selector = `.${cssClass.name}`;
    if (!_rules[selector]) {
        const rule: CssRule = {
            selector,
            style: cssClass.style
        };
        addCssRule(rule);
    }
}

/**
 * An am app contains only one app stylesheet.
 * Rules are added only once to the app stylesheet based on Rule.selector.
 */
export function addCssRule(rule: CssRule): void {
    const selector = rule.selector;
    if (!_rules[selector]) {
        let properties = "";
        const style = rule.style;
        const keys = Object.keys(style);
        const keyCount = keys.length;
        for (let i = 0; i < keyCount; i++) {
            const key = keys[i];
            const value = (style as any)[key];
            const snake = toSnakeCase(key);

            if (key[0] !== "_") {
                properties += `${snake}:${value};`;
            }
        }

        if (styleSheet["insertRule"]) {
            styleSheet.insertRule(`${selector} { ${properties} }`, 0);
        }
        else if (styleSheet["addRule"] ) {
            styleSheet.addRule(`${selector}`, properties, 0);
        }
        _rules[selector] = rule;
        
        rule.rendered = true;
    }
}

function create(id: string): CSSStyleSheet {
    if (!id) { throw new Error("Please provide id."); }

    // Create the <style> tag
    const head = document.head || document.getElementsByTagName('head')[0];
    const style = document.createElement("style") as any;
    style.id = id;
    style.type = "text/css";

    if (style.styleSheet) {
        // IE8
        style.styleSheet.cssText = "";
    } else {
        // WebKit hack
        style.appendChild(document.createTextNode(""));
    }

    // Add the <style> element to the page
    head.appendChild(style);

    // IE8 support (style.styleSheet)
    return style.sheet || style.styleSheet as CSSStyleSheet;
}

// TODO: Remove stylesheet if it exists before creating.

// One time creation of the am stylesheet.
const styleSheet: CSSStyleSheet = create("am");

export interface CssClass {
    name: string;
    rendered?: boolean;
    style: Style;
}

export interface CssRule {
    rendered?: boolean;
    selector: string;
    style: Style;
}

export type BoxSizing =
"content-box" |
"border-box" |
// global values
"inherit" |
"initial" |
"unset";

export type Cursor =
"auto" |
"pointer" |

// global values
"inherit" |
"initial" |
"unset";

export type Display =
// outside values
"block" |
"inline" |
"run-in" |

// inside values
"flow" |
"flow-root" |
"table" |
"flex" |
"grid" |
"ruby" |
"subgrid" |

// outside and inside values
"block flow" |
"inline table" |
"flex run-in" |

// listitem values
"list-item" |
"list-item block" |
"list-item inline" |
"list-item flow" |
"list-item flow-root" |
"list-item block flow" |
"list-item block flow-root" |
"flow list-item block" |

// internal values
"table-row-group" |
"table-header-group" |
"table-footer-group" |
"table-row" |
"table-cell" |
"table-column-group" |
"table-column" |
"table-caption" |
"ruby-base" |
"ruby-text" |
"ruby-base-container" |
"ruby-text-container" |

// box values
"contents" |
"none" |

// legacy values
"inline-block" |
"inline-list-item" |
"inline-table" |
"inline-flex" |
"inline-grid" |

// global values
"inherit" |
"initial" |
"unset";

export type Float = "left" | "right" | "none" | "initial" | "inherit";

export type Overflow =
"auto" |    // Let the browser decide
"hidden" |  // Content is clipped, with no scrollbars   
"scroll" |  // Content is clipped, with scrollbars
"visible" | // Content is not clipped
// global values
"inherit" |
"initial" |
"unset";
export type TextAlign = 
/* Keyword values */
"left" |
"right" |
"center" |
"justify" |
"justify-all" |
"start" |
"end" |
"match-parent" |

/* Block alignment values (Non-standard syntax) */
"-moz-center" |
"-webkit-center" |

/* Global values */
"inherit" |
"initial" |
"unset";

export interface Style {
alignContent?: string | null;
alignItems?: string | null;
alignSelf?: string | null;
alignmentBaseline?: string | null;
animation?: string | null;
animationDelay?: string | null;
animationDirection?: string | null;
animationDuration?: string | null;
animationFillMode?: string | null;
animationIterationCount?: string | null;
animationName?: string | null;
animationPlayState?: string | null;
animationTimingFunction?: string | null;
backfaceVisibility?: string | null;
background?: string | null;
backgroundAttachment?: string | null;
backgroundClip?: string | null;
backgroundColor?: string | null;
backgroundImage?: string | null;
backgroundOrigin?: string | null;
backgroundPosition?: string | null;
backgroundPositionX?: string | null;
backgroundPositionY?: string | null;
backgroundRepeat?: string | null;
backgroundSize?: string | null;
baselineShift?: string | null;
border?: string | null;
borderBottom?: string | null;
borderBottomColor?: string | null;
borderBottomLeftRadius?: string | null;
borderBottomRightRadius?: string | null;
borderBottomStyle?: string | null;
borderBottomWidth?: string | null;
borderCollapse?: string | null;
borderColor?: string | null;
borderImage?: string | null;
borderImageOutset?: string | null;
borderImageRepeat?: string | null;
borderImageSlice?: string | null;
borderImageSource?: string | null;
borderImageWidth?: string | null;
borderLeft?: string | null;
borderLeftColor?: string | null;
borderLeftStyle?: string | null;
borderLeftWidth?: string | null;
borderRadius?: string | null;
borderRight?: string | null;
borderRightColor?: string | null;
borderRightStyle?: string | null;
borderRightWidth?: string | null;
borderSpacing?: string | null;
borderStyle?: string | null;
borderTop?: string | null;
borderTopColor?: string | null;
borderTopLeftRadius?: string | null;
borderTopRightRadius?: string | null;
borderTopStyle?: string | null;
borderTopWidth?: string | null;
borderWidth?: string | null;
bottom?: string | null;
boxShadow?: string | null;
boxSizing?: BoxSizing | null;
breakAfter?: string | null;
breakBefore?: string | null;
breakInside?: string | null;
captionSide?: string | null;
clear?: string | null;
clip?: string | null;
clipPath?: string | null;
clipRule?: string | null;
color?: string | null;
colorInterpolationFilters?: string | null;
columnCount?: any;
columnFill?: string | null;
columnGap?: any;
columnRule?: string | null;
columnRuleColor?: any;
columnRuleStyle?: string | null;
columnRuleWidth?: any;
columnSpan?: string | null;
columnWidth?: any;
columns?: string | null;
content?: string | null;
counterIncrement?: string | null;
counterReset?: string | null;
float?: Float | null;
cssText?: string;
cursor?: Cursor | null;
direction?: string | null;
display?: Display | null;
dominantBaseline?: string | null;
emptyCells?: string | null;
enableBackground?: string | null;
fill?: string | null;
fillOpacity?: string | null;
fillRule?: string | null;
filter?: string | null;
flex?: string | null;
flexBasis?: string | null;
flexDirection?: string | null;
flexFlow?: string | null;
flexGrow?: string | null;
flexShrink?: string | null;
flexWrap?: string | null;
floodColor?: string | null;
floodOpacity?: string | null;
font?: string | null;
fontFamily?: string | null;
fontFeatureSettings?: string | null;
fontSize?: string | null;
fontSizeAdjust?: string | null;
fontStretch?: string | null;
fontStyle?: string | null;
fontVariant?: string | null;
fontWeight?: string | null;
glyphOrientationHorizontal?: string | null;
glyphOrientationVertical?: string | null;
height?: string | null;
imeMode?: string | null;
justifyContent?: string | null;
kerning?: string | null;
left?: string | null;
letterSpacing?: string | null;
lightingColor?: string | null;
lineHeight?: string | null;
listStyle?: string | null;
listStyleImage?: string | null;
listStylePosition?: string | null;
listStyleType?: string | null;
margin?: string | null;
marginBottom?: string | null;
marginLeft?: string | null;
marginRight?: string | null;
marginTop?: string | null;
marker?: string | null;
markerEnd?: string | null;
markerMid?: string | null;
markerStart?: string | null;
mask?: string | null;
maxHeight?: string | null;
maxWidth?: string | null;
minHeight?: string | null;
minWidth?: string | null;
msContentZoomChaining?: string | null;
msContentZoomLimit?: string | null;
msContentZoomLimitMax?: any;
msContentZoomLimitMin?: any;
msContentZoomSnap?: string | null;
msContentZoomSnapPoints?: string | null;
msContentZoomSnapType?: string | null;
msContentZooming?: string | null;
msFlowFrom?: string | null;
msFlowInto?: string | null;
msFontFeatureSettings?: string | null;
msGridColumn?: any;
msGridColumnAlign?: string | null;
msGridColumnSpan?: any;
msGridColumns?: string | null;
msGridRow?: any;
msGridRowAlign?: string | null;
msGridRowSpan?: any;
msGridRows?: string | null;
msHighContrastAdjust?: string | null;
msHyphenateLimitChars?: string | null;
msHyphenateLimitLines?: any;
msHyphenateLimitZone?: any;
msHyphens?: string | null;
msImeAlign?: string | null;
msOverflowStyle?: string | null;
msScrollChaining?: string | null;
msScrollLimit?: string | null;
msScrollLimitXMax?: any;
msScrollLimitXMin?: any;
msScrollLimitYMax?: any;
msScrollLimitYMin?: any;
msScrollRails?: string | null;
msScrollSnapPointsX?: string | null;
msScrollSnapPointsY?: string | null;
msScrollSnapType?: string | null;
msScrollSnapX?: string | null;
msScrollSnapY?: string | null;
msScrollTranslation?: string | null;
msTextCombineHorizontal?: string | null;
msTextSizeAdjust?: any;
msTouchAction?: string | null;
msTouchSelect?: string | null;
msUserSelect?: string | null;
msWrapFlow?: string;
msWrapMargin?: any;
msWrapThrough?: string;
opacity?: string | null;
order?: string | null;
orphans?: string | null;
outline?: string | null;
outlineColor?: string | null;
outlineStyle?: string | null;
outlineWidth?: string | null;
overflow?: Overflow;
overflowX?: Overflow;
overflowY?: Overflow;
padding?: string | null;
paddingBottom?: string | null;
paddingLeft?: string | null;
paddingRight?: string | null;
paddingTop?: string | null;
pageBreakAfter?: string | null;
pageBreakBefore?: string | null;
pageBreakInside?: string | null;
perspective?: string | null;
perspectiveOrigin?: string | null;
pointerEvents?: string | null;
position?: string | null;
quotes?: string | null;
resize?: string | null;
right?: string | null;
rubyAlign?: string | null;
rubyOverhang?: string | null;
rubyPosition?: string | null;
stopColor?: string | null;
stopOpacity?: string | null;
stroke?: string | null;
strokeDasharray?: string | null;
strokeDashoffset?: string | null;
strokeLinecap?: string | null;
strokeLinejoin?: string | null;
strokeMiterlimit?: string | null;
strokeOpacity?: string | null;
strokeWidth?: string | null;
tableLayout?: string | null;
textAlign?: TextAlign;
textAlignLast?: string | null;
textAnchor?: string | null;
textDecoration?: string | null;
textIndent?: string | null;
textJustify?: string | null;
textKashida?: string | null;
textKashidaSpace?: string | null;
textOverflow?: string | null;
textShadow?: string | null;
textTransform?: string | null;
textUnderlinePosition?: string | null;
top?: string | null;
touchAction?: string | null;
transform?: string | null;
transformOrigin?: string | null;
transformStyle?: string | null;
transition?: string | null;
transitionDelay?: string | null;
transitionDuration?: string | null;
transitionProperty?: string | null;
transitionTimingFunction?: string | null;
unicodeBidi?: string | null;
verticalAlign?: string | null;
visibility?: string | null;
webkitAlignContent?: string | null;
webkitAlignItems?: string | null;
webkitAlignSelf?: string | null;
webkitAnimation?: string | null;
webkitAnimationDelay?: string | null;
webkitAnimationDirection?: string | null;
webkitAnimationDuration?: string | null;
webkitAnimationFillMode?: string | null;
webkitAnimationIterationCount?: string | null;
webkitAnimationName?: string | null;
webkitAnimationPlayState?: string | null;
webkitAnimationTimingFunction?: string | null;
webkitAppearance?: string | null;
webkitBackfaceVisibility?: string | null;
webkitBackgroundClip?: string | null;
webkitBackgroundOrigin?: string | null;
webkitBackgroundSize?: string | null;
webkitBorderBottomLeftRadius?: string | null;
webkitBorderBottomRightRadius?: string | null;
webkitBorderImage?: string | null;
webkitBorderRadius?: string | null;
webkitBorderTopLeftRadius?: string | null;
webkitBorderTopRightRadius?: string | null;
webkitBoxAlign?: string | null;
webkitBoxDirection?: string | null;
webkitBoxFlex?: string | null;
webkitBoxOrdinalGroup?: string | null;
webkitBoxOrient?: string | null;
webkitBoxPack?: string | null;
webkitBoxSizing?: string | null;
webkitColumnBreakAfter?: string | null;
webkitColumnBreakBefore?: string | null;
webkitColumnBreakInside?: string | null;
webkitColumnCount?: any;
webkitColumnGap?: any;
webkitColumnRule?: string | null;
webkitColumnRuleColor?: any;
webkitColumnRuleStyle?: string | null;
webkitColumnRuleWidth?: any;
webkitColumnSpan?: string | null;
webkitColumnWidth?: any;
webkitColumns?: string | null;
webkitFilter?: string | null;
webkitFlex?: string | null;
webkitFlexBasis?: string | null;
webkitFlexDirection?: string | null;
webkitFlexFlow?: string | null;
webkitFlexGrow?: string | null;
webkitFlexShrink?: string | null;
webkitFlexWrap?: string | null;
webkitJustifyContent?: string | null;
webkitOrder?: string | null;
webkitPerspective?: string | null;
webkitPerspectiveOrigin?: string | null;
webkitTapHighlightColor?: string | null;
webkitTextFillColor?: string | null;
webkitTextSizeAdjust?: any;
webkitTransform?: string | null;
webkitTransformOrigin?: string | null;
webkitTransformStyle?: string | null;
webkitTransition?: string | null;
webkitTransitionDelay?: string | null;
webkitTransitionDuration?: string | null;
webkitTransitionProperty?: string | null;
webkitTransitionTimingFunction?: string | null;
webkitUserModify?: string | null;
webkitUserSelect?: string | null;
webkitWritingMode?: string | null;
whiteSpace?: string | null;
widows?: string | null;
width?: string | null;
wordBreak?: string | null;
wordSpacing?: string | null;
wordWrap?: string | null;
writingMode?: string | null;
zIndex?: string | null;
zoom?: string | null;
}