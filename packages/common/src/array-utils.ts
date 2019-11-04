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
}
