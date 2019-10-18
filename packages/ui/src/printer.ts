export function printer(content: string): void {
    const myWindow = window.open("", "", "width=400,height=600");
    if (myWindow) {
        myWindow.document.write(content);
        myWindow.document.close();
        myWindow.focus();
        myWindow.print();
        myWindow.close();
    }
}
