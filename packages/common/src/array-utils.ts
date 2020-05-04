import {ObjectUtils} from './object-utils';

export class ArrayUtils {
  public static findIndex<T>(
    arr: Array<T>,
    comparator: (item: T) => boolean
  ): number {
    let index = 0;
    while (index < arr.length) {
      if (comparator(arr[index])) {
        return index;
      }
      index++;
    }
    return -1;
  }

  public static sortByKey<T>(array: Array<T>, key: string): Array<T> {
    return array.sort((a, b) => {
      const x = ObjectUtils.get(a, key, null);
      const y = ObjectUtils.get(b, key, null);
      return x < y ? -1 : x > y ? 1 : 0;
    });
  }
}
