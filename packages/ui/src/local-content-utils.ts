export function downloadContent(content: string, name: string): void {
  const blob = new Blob([content], {type: 'text/plain;charset=utf-8;'});
  const anchor = document.createElement('a');
  if (window.navigator.msSaveBlob) {
    // IE
    window.navigator.msSaveOrOpenBlob(blob, name);
    return;
  }
  if (navigator.userAgent.search('Firefox') !== -1) {
    // Firefox
    anchor.style.display = 'none';
    anchor.setAttribute(
      'href',
      'data:text/plain;charset=utf-8,' + encodeURIComponent(content)
    );
  } else {
    // Chrome
    anchor.setAttribute('href', URL.createObjectURL(blob));
  }
  anchor.setAttribute('target', '_blank');
  anchor.setAttribute('download', name);
  anchor.click();
  anchor.remove();
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

export function timeSince(date: any) {
  if (typeof date !== 'object') {
    date = new Date(date);
  }
  const currentDate: any = new Date();
  const seconds = Math.floor((currentDate - date) / 1000);
  let intervalType;
  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) {
    intervalType = 'year';
  } else {
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      intervalType = 'month';
    } else {
      interval = Math.floor(seconds / 86400);
      if (interval >= 1) {
        intervalType = 'day';
      } else {
        interval = Math.floor(seconds / 3600);
        if (interval >= 1) {
          intervalType = 'hour';
        } else {
          interval = Math.floor(seconds / 60);
          if (interval >= 1) {
            intervalType = 'minute';
          } else {
            interval = -1;
            intervalType = 'a moment';
          }
        }
      }
    }
  }

  if (interval > 1 || interval === 0) {
    intervalType += 's';
  }

  return `${interval >= 0 ? interval : ''} ${intervalType} ago`;
}
