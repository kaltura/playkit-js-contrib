import {UUID} from './uuid';

const HashSeparatorText = 'HashSeparator';

export class KalturaLiveServices {
  public static getAnonymousUserId(userId: string): string {
    if (typeof Storage === 'undefined') {
      // No web storage Support, just generate and return a anonymous user id
      return KalturaLiveServices._generateAnonymousUserId(userId);
    }

    // Web storage is supported
    let anonymousUserId;
    anonymousUserId = localStorage.getItem('anonymousUserId');

    if (!anonymousUserId) {
      anonymousUserId = KalturaLiveServices._generateAnonymousUserId(userId);
      localStorage.setItem('anonymousUserId', anonymousUserId);
    }

    return anonymousUserId;
  }

  private static _generateAnonymousUserId(userId: string) {
    const numFromUuid = KalturaLiveServices._getNumberStringUuid();

    return `##${userId}${HashSeparatorText}${numFromUuid}##`;
  }

  private static _getNumberStringUuid(): string {
    const uuid = UUID.uuidV1();
    let numStr = '';

    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charAt(i);

      if (KalturaLiveServices.isNan(+char)) {
        numStr = numStr + char.charCodeAt(0);
      } else {
        numStr = numStr + char;
      }
    }

    return numStr;
  }

  private static isNan(value) {
    return value !== null && (value != value || +value != value);
  }
}
