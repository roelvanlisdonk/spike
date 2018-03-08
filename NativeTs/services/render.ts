
export function render(selector: string, html: string): void {
    const element = document.querySelector(selector);

    element.innerHTML = html;
}