import * as uuidV1 from 'uuid/v1';
import * as uuidV5 from 'uuid/v5';

export class UUID {
  //timestamp
  public static uuidV1() {
    return uuidV1();
  }

  /**
   * usage example: uuidV5('domain', uuidV1())
   * @param name
   * @param namespace should be UUID string or a 16 byte array
   */
  public static uuidV5(name: string, namespace: string) {
    return uuidV5(name, namespace);
  }

  public static NumberUuidV1(): string {
    const uuid = UUID.uuidV1();
    let numStr = '';

    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charAt(i);

      if (Number.isNaN(+char)) {
        numStr = numStr + char.charCodeAt(0);
      } else {
        numStr = numStr + char;
      }
    }

    return numStr;
  }
}
