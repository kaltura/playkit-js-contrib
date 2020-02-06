export function downloadContent(content: string, name: string): void {
  const blob = new Blob([content], {type: 'text/plain;charset=utf-8;'});
  const anchor = document.createElement('a');
  if (window.navigator.msSaveBlob) {
    // IE
    window.navigator.msSaveOrOpenBlob(blob, name);
  } else if (navigator.userAgent.search('Firefox') !== -1) {
    // Firefox
    anchor.style.display = 'none';
    anchor.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('download', name);
    anchor.click();
    anchor.remove();
  } else {
    // Chrome
    anchor.setAttribute('href', URL.createObjectURL(blob));
    anchor.setAttribute('target', '_blank');
    anchor.setAttribute('download', name);
    anchor.click();
  }
}

export function printContent(content: string): void {
  const printWindow = window.open('', '', 'width=400,height=600');
  if (printWindow) {
    printWindow.document.write(content);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  }
}
