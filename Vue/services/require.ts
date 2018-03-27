
// We use an indirect eval call to execute code in the global scope.
// http://perfectionkills.com/global-eval-what-are-the-options/
const windowAsAny = window as any;
const globalEval = windowAsAny["eval"];

namespace nano {
    'use strict';

    /**
     * This loader can load ES6 modules, commonjs modules, and namespace "modules".
     * 
     * This loader is based on require1k.
     * 
     * Notes
     * - To load app modules, start path with a ".", e.g. "./my-module"
     * - To load "node_modules", do NOT prefix the path, e.g. "jquery/dist/jquery"
     * 
     */

    // When the process of loading a module is started, a ModuleInfo object will be added to this index, to prevent "repetitive" loading of modules.
    const MODULES: ModuleInfoIndex = {};

    // Used to load stylesheets only once.
    const stylesheets: StylesheetIndex = {};

    // An "base" element is added to the header to correctly resolve relative paths.
    const baseElement: HTMLBaseElement = document.createElement("base");
    const headElement: HTMLHeadElement = document.head;
    headElement.appendChild(baseElement);

    // This "anchor" element is only used to resolve relative paths to absolute url paths.
    // E.g. "./app" will resolve to "https://my-app.com/app.js".
    const relativeElement: HTMLAnchorElement = document.createElement("a");

    function getCacheBustedUrl(relative: string): string {
        const relativeAfterSlashStrip = (relative[0] === "/") ? relative.substring(1) : relative;
        // Split url into folder and filename, so we can inject cachebustingToken.
        const startsWithADot = (relativeAfterSlashStrip[0] === ".");
        // If relative does not start with a ".", module is located in "node_modules" folder.
        const relativeAfterNodeCheck = startsWithADot ? relativeAfterSlashStrip : "./node_modules/" + relativeAfterSlashStrip;
        const lastIndexOfSlash = relativeAfterNodeCheck.lastIndexOf("/");
        const constainsSlash = (lastIndexOfSlash > -1);
        const filename = constainsSlash ? relativeAfterNodeCheck.substring(lastIndexOfSlash + 1) : relativeAfterNodeCheck;
        const rawFolder = constainsSlash ? relativeAfterNodeCheck.substring(0, lastIndexOfSlash) : "/";
        let folder = (rawFolder[0] === "/") ? rawFolder.substring(1) : rawFolder;
        
        // TODO: add data-cachebustingToken to script tag, so we can also supply the cachebustingToken.
        // Determine cache busted url.
        let cachebustingToken = localStorage.getItem("cachebustingToken") || "";
        const appPart: string = folder.toLowerCase().substring(0, 5);
        if (cachebustingToken && appPart === "./app") {
            let restOfPath = folder.substring(5);
            if (restOfPath.length > 0 && restOfPath[0] === "/") {
                restOfPath = restOfPath.substring(1);
            }

            folder = `./App/v-${cachebustingToken}/${restOfPath}`;
            if (folder[folder.length - 1] === "/") {
                folder = folder.substring(0, folder.length - 1);
            }
        }
        const cacheBustedUrl = `${folder}/${filename}`;

        // Should always return an url that starts with "./".
        return cacheBustedUrl;
    }

    // Loads the given module and all of it dependencies, recursively
    // - module         The module object
    // - callback       Called when everything has been loaded
    // - parentLocation Location of the parent directory to look in. Only given
    // for non-relative dependencies
    // - id             The name of the dependency. Only used for non-relative
    // dependencies
    function deepLoad(moduleInfo: ModuleInfo, callback: any, parentLocation?: any, id?: any) {
        // If this module is already loading then don't proceed.
        // This is a bug.
        // If a module is requested but not loaded then the module isn't ready,
        // but we callback as if it is. Oh well, 1k!
        if (moduleInfo.g) {
            return callback(moduleInfo.e, moduleInfo);
        }

        const location = moduleInfo.g = moduleInfo.l;

        const request = new XMLHttpRequest();
        request.onload = function (): any {

            if (request.status === 200 || moduleInfo.t) {
                // Should really use an object and then Object.keys to avoid
                // duplicate dependencies. But that costs bytes.
                const deps: string[] = [];

                // The regex contains a bug, it will also load "dynamic" dependencies direct.
                // In TypeScript, const mod = await import("./common/my-mod");
                // Will "compile" to:
                // const mod = yield Promise.resolve().then(() => require("./common/my-mod"));
                // Which will be found by the regex.
                (moduleInfo.t = moduleInfo.t || request.response).replace(/(?:^|[^\w\$_.])require\s*\(\s*["']([^"']*)["']\s*\)/g,
                    function addDependency(_: string, id: string) {

                        // TODO: RLI voor de buildstraat toch weer aangezet, omdat we vanaf nu wel werken met modules.
                        // Alleen relatieve urls behandelen
                        if (id[0] === ".") {
                            deps.push(id);
                        }
                    }
                );

                let count = deps.length;

                // Function declarations are not allowed inside blocks in strict mode when targeting 'ES3' or 'ES5'. So we use a variable.
                const loaded = function () {
                    // We call loaded straight away below in case there
                    // are no dependencies. Putting this check first
                    // and the decrement after saves us an `if` for that
                    // special case
                    if (!count--) {
                        callback(undefined, moduleInfo);
                    }
                };

                deps.map(function (dep: string) {
                    deepLoad(
                        resolveModuleOrGetExports(moduleInfo.l, dep),
                        loaded,
                        // If it doesn't begin with a ".", then we're searching
                        // node_modules, so pass in the info to make this
                        // possible
                        dep[0] !== "." ? location + "/../" : undefined,
                        dep
                    );
                });
                loaded();
            } else {
                // parentLocation is only given if we're searching in node_modules
                if (parentLocation) {
                    // Recurse up the tree trying to find the dependency
                    // (generating 404s on the way)
                    deepLoad(
                        moduleInfo.n = resolveModuleOrGetExports(parentLocation += "../", id),
                        callback,
                        parentLocation,
                        id
                    );
                } else {
                    moduleInfo.e = request;
                    callback(request, moduleInfo);
                }
            }
        };

        // If the module already has text because we're using a factory
        // function, then there's no need to load the file!
        if (moduleInfo.t) {
            request.onload(null);
        } else {
            request.open("GET", location, true);
            request.send();
        }
    }

    /**
     * 
     * @param relative
     * @param fileExtension - e.g. ".css" or ".js"
     * @param base
     */
    function resolve(relative: string, fileExtension: string, base?: string): string {
        baseElement.href = base || "";
        // If the relative url doesn't begin with a ".", then it's in node_modules
        const cacheBustedUrl: string = getCacheBustedUrl(relative);
        relativeElement.href = cacheBustedUrl;

        const resolved = relativeElement.href + fileExtension;
        baseElement.href = "";

        return resolved;
    }

    // Save bytes by combining two functions
    // - resolveModule which resolves a given relative path against the given
    //   base, and returns an existing or new module object
    // - getExports which returns the existing exports or runs the factory to
    //   create the exports for a module
    function resolveModuleOrGetExports(baseOrModule: any, relative?: any, evalWithoutFunctionWrapper?: boolean): any {


        // This should really be after the relative check, but because we are
        // `throw`ing, it messes up the optimizations. If we are being called
        // as resolveModule then the string `base` won't have the `e` property,
        // so we're fine.
        if (baseOrModule.e) {
            throw baseOrModule.e;
        }

        // If 2 arguments are given, then we are resolving modules...
        if (relative) {
            const resolved: string = resolve(relative, ".js", baseOrModule);

            return (MODULES[resolved] = MODULES[resolved] || { evalWithoutFunctionWrapper: evalWithoutFunctionWrapper, l: resolved });
        }

        // ...otherwise we are getting the exports

        // Is this module a redirect to another one?
        if (baseOrModule.n) {
            return resolveModuleOrGetExports(baseOrModule.n);
        }

        if (!baseOrModule["exports"]) {
            // Wrap the text of a loaded module in a function that takes the following parameters:
            // - require: function - Is needed by nodejs modules.
            // - exports: 
            // - module:
            // Then execute this function.

            let moduleText: string = baseOrModule.evalWithoutFunctionWrapper ? baseOrModule.t : "(function(require, " + "exports" + ", module){" + baseOrModule.t + "\n})";

            // To make debugging of TypeScript files or minified JavaScript files possible, we must add special comments at te bottom of the module text.
            moduleText += "\n//# sourceURL=" + baseOrModule.l;
            moduleText += "\n//# sourceMappingURL=" + baseOrModule.l + ".map";

            if (baseOrModule.evalWithoutFunctionWrapper) {
                baseOrModule["exports"] = executeGlobalEval(moduleText, baseOrModule.l);
            } else {
                (baseOrModule.f || executeGlobalEval(moduleText, baseOrModule.l))(
                    // The require function will be called by a module to load dependencies.
                    // Parameter "path", will be the unresolved path to a dependent module.s
                    function require(path: string) {
                        return resolveModuleOrGetExports(resolveModuleOrGetExports(baseOrModule.l, path));
                    }, // require
                    baseOrModule["exports"] = {}, // exports
                    baseOrModule // module
                );
            }
        }

        return baseOrModule["exports"];
    }

    function executeGlobalEval(moduleText: string, modulePath: string): any {
        console.log(`eval [${modulePath}]`);
        return globalEval(moduleText);
    }

    export function requireCss(relative: string, callback?: () => void): void {

        // Convert the given url, to the correct cache busted url.
        const href = resolve(relative, ".css");

        // Only load stylesheet once.
        if (!stylesheets[href]) {
            stylesheets[href] = href;

            // Load stylesheet by adding a "link" tag to the head of the document.
            const link: HTMLLinkElement = document.createElement("link");
            link.href = resolve(relative, ".css");
            link.rel = "stylesheet";
            link.type = "text/css";
            headElement.appendChild(link);

            if (callback) {
                callback();
            }
        }
    }

    export function requireAllJs(urls: string[], callback?: (err: any, mod: any) => void): void {

        const base = ""; // Use the location of the html file that loaded this script as base for url resolving.

        // This function will load the given JavaScript file as a normal JavaScript.
        // The text in the file will evaluated "as is" without wrapping it in a function.
        // A wrapper is used, when loading a JavaScript file as a module, to prevent polution of the global namespace, see requireJsModule.
        const evalWithoutFunctionWrapper: boolean = true;

        const totalUrlsToLoad = urls.length;
        let urlsToLoad = urls.length;
        for (let i = 0; i < totalUrlsToLoad; i++) {
            deepLoad(
                resolveModuleOrGetExports(base, urls[i], evalWithoutFunctionWrapper),
                function deepLoadCallback(err: any, module: any): any {
                    let evaledModule: any;
                    try {
                        evaledModule = resolveModuleOrGetExports(module, undefined, module.evalWithoutFunctionWrapper);
                    } catch (_err) {
                        err = _err;
                    }
                    urlsToLoad = urlsToLoad - 1;
                    if (callback && !urlsToLoad) {
                        callback(err, evaledModule);
                    }
                    if (err) {
                        throw err;
                    }
                }
            );
        }
    }

    export function requireAllJsModules(urls: string[], callback?: (err: any, mod: any) => void): void {

        const base = ""; // Use the location of the html file that loaded this script as base for url resolving.

        // This function will load the given JavaScript file as a normal JavaScript.
        // The text in the file will evaluated "as is" without wrapping it in a function.
        // A wrapper is used, when loading a JavaScript file as a module, to prevent polution of the global namespace, see requireJsModule.
        const evalWithoutFunctionWrapper: boolean = false;

        const totalUrlsToLoad = urls.length;
        let urlsToLoad = urls.length;
        for (let i = 0; i < totalUrlsToLoad; i++) {
            deepLoad(
                resolveModuleOrGetExports(base, urls[i], evalWithoutFunctionWrapper),
                function deepLoadCallback(err: any, module: any): any {
                    let evaledModule: any;
                    try {
                        evaledModule = resolveModuleOrGetExports(module, undefined, module.evalWithoutFunctionWrapper);
                    } catch (_err) {
                        err = _err;
                    }
                    urlsToLoad = urlsToLoad - 1;
                    if (callback && !urlsToLoad) {
                        callback(err, evaledModule);
                    }
                    if (err) {
                        throw err;
                    }
                }
            );
        }
    }

    export function requireJs(relative: string, callback?: (err: any, mod: any) => void): void {
        
        const base = ""; // Use the location of the html file that loaded this script as base for url resolving.

        // This function will load the given JavaScript file as a normal JavaScript.
        // The text in the file will evaluated "as is" without wrapping it in a function.
        // A wrapper is used, when loading a JavaScript file as a module, to prevent polution of the global namespace, see requireJsModule.
        const evalWithoutFunctionWrapper: boolean = true;

        deepLoad(
            resolveModuleOrGetExports(base, relative, evalWithoutFunctionWrapper),
            function deepLoadCallback(err: any, module: any): any {
                let evaledModule: any;
                try {
                    evaledModule = resolveModuleOrGetExports(module, undefined, module.evalWithoutFunctionWrapper);
                } catch (_err) {
                    err = _err;
                }
                if (callback) {
                    callback(err, evaledModule);
                }
                if (err) {
                    throw err;
                }
            }
        );
    }

    export function requireJsModule(relative: string, callback?: (err: any, mod: any) => void): void {
        const base = ""; // Use the location of the html file that loaded this script as base for url resolving.

        // The JavaScript file to load contains a module, so we must add a function wrapper, to load the module correctly
        const evalWithoutFunctionWrapper: boolean = false;

        deepLoad(
            resolveModuleOrGetExports("", relative, evalWithoutFunctionWrapper),
            function deepLoadCallback(err: any, module: any): any {
                let evaledModule: any;
                try {
                    evaledModule = resolveModuleOrGetExports(module, undefined, module.evalWithoutFunctionWrapper);
                } catch (_err) {
                    err = _err;
                }
                if (callback) {
                    callback(err, evaledModule);
                }
                if (err) {
                    throw err;
                }
            }
        );
    }

    // When this file is loaded, it will automatically start the module load process here.
    // The module loading process is started by finding the first "script" tag with a custom data attribute "data-main".
    // The value of the custom data attribute "data-main" will be used to load the first module.
    const scriptElement = <HTMLScriptElement>document.querySelector("script[data-main]");
    if (scriptElement) {

        // Get path to the first module to load.
        const path: string = scriptElement.dataset.main;
        requireJsModule(path);
    }

    interface ModuleInfo {
        e?: any;         // booleany - Error, truthy if there was an error (probably a 404) loading the module
        evalWithoutFunctionWrapper?: boolean; // When true, the text of the javascript file will not be wrapped by a function.
        exports?: any;   // object   - The exports of the module!
        f?: any;         // function - Factory, a function to use instead of eval'ing module.t
        g?: any;         // booleany - LoadinG, truthy if this module has been requested for loading before. Used to prevent the same module being loaded twice
        l?: any;         // string   - Location, the url location of this module
        n?: any;         // object   - Module object, Next, instead of using this module, use the object pointed to by this property. Used for dependencies in other packages
        t?: string;      // string   - Text, the text content of the module
    }

    type StylesheetIndex = {
        [key: string]: string
    };

    type DependencyIndex = {
        [key: string]: string
    };

    // The "key" of each entry, will be the "absolute path" to the module e.g. https://my-app.com/app
    // The "value" of each entry,  will be a "ModuleInfo" object.
    type ModuleInfoIndex = {
        [key: string]: ModuleInfo
    };
}