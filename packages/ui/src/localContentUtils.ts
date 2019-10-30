export function downloadContent(content: string, name: string): void {
    const link = document.createElement("a");
    link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    link.setAttribute("download", name);
    link.click();
}

export function printContent(content: string): void {
    const printWindow = window.open("", "", "width=400,height=600");
    if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}
