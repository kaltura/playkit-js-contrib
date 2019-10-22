export function printer(content: string): void {
    const printWindow = window.open("", "", "width=400,height=600");
    if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }
}
