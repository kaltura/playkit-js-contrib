export function downloader(content: string, name: string): void {
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    link.setAttribute("download", name);
    link.click();
}
