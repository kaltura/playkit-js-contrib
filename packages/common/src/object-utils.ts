export class ObjectUtils {
  /**
   * @param {T} data - The data to copy.
   * @returns {T} - The copied data.
   */
  public static copyDeep<T extends Record<string, any>>(data: T): T {
    let node;
    if (Array.isArray(data)) {
      node = data.length > 0 ? data.slice(0) : [];
      node.forEach((e, i) => {
        if (
          (typeof e === 'object' && e !== {}) ||
          (Array.isArray(e) && e.length > 0)
        ) {
          node[i] = ObjectUtils.copyDeep(e);
        }
      });
    } else if (typeof data === 'object') {
      node = Object.assign({}, data);
      Object.keys(node).forEach(key => {
        if (
          (typeof node[key] === 'object' && node[key] !== {}) ||
          (Array.isArray(node[key]) && node[key].length > 0)
        ) {
          node[key] = ObjectUtils.copyDeep(node[key]);
        }
      });
    } else {
      node = data;
    }
    return node;
  }

  /**
   * @param {T} item - The item to check.
   * @returns {T} - Whether the item is an object.
   */
  public static isObject(item: any) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * @param {T} target - The target object.
   * @param {T} sources - The objects to merge.
   * @returns {T} - The merged object.
   */
  public static mergeDeep<T extends Record<string, any>>(
    target: Partial<T>,
    ...sources: Partial<T>[]
  ): Partial<T> {
    if (!sources.length) {
      return target;
    }
    const source = sources.shift();
    if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
      for (const key in source) {
        if (ObjectUtils.isObject(source[key])) {
          if (!target[key]) Object.assign(target, {[key]: {}});
          ObjectUtils.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, {[key]: source[key]});
        }
      }
    }
    return ObjectUtils.mergeDeep(target, ...sources);
  }

  public static mergeDefaults<T extends Record<string, any>>(
    target: Partial<T>,
    defaults: T,
    ...additional: Partial<T>[]
  ): T {
    return ObjectUtils.mergeDeep(target, defaults, ...additional) as T;
  }

  /**
   * source properties will override all equivalent properties in target. null or empty objects properties in source
   * will cause the removal of these properties in target.
   * all other data will be merged
   * @param initialObject
   * @param source
   */
  public static explicitFlatMerge<T extends Record<string, any>>(
    initialObject: Partial<T>,
    source: Partial<T>
  ): Partial<T> {
    const result = {...initialObject};
    Object.keys(source).forEach(key => {
      if (source[key] === null || Object.keys(source[key]).length === 0) {
        delete result[key];
      } else {
        // @ts-ignore
        // https://github.com/microsoft/TypeScript/issues/31661
        result[key] = source[key];
      }
    });
    return result;
  }

  public static get(
    obj: Record<string, any>,
    path: string,
    defaultValue: any
  ): unknown {
    function stringToPath(path: string) {
      const output = [];
      // Split to an array with dot notation
      path.split('.').forEach(item => {
        // Split to an array with bracket notation
        item.split(/\[([^}]+)\]/g).forEach(key => {
          // Push to the new array
          if (key.length > 0) {
            output.push(key);
          }
        });
      });
      return output;
    }

    // Get the path as an array
    const pathArray = stringToPath(path);

    let current = obj;

    // For each item in the path, dig into the object
    for (let i = 0; i < pathArray.length; i++) {
      // If the item isn't found, return the default (or null)
      if (!current[pathArray[i]]) return defaultValue;

      // Otherwise, update the current value
      current = current[pathArray[i]];
    }

    return current;
  }
}
