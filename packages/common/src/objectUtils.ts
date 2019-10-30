export class ObjectUtils {
    /**
     * @param {T} data - The data to copy.
     * @returns {T} - The copied data.
     */
    public static copyDeep<T extends Object>(data: T): T {
        let node;
        if (Array.isArray(data)) {
            node = data.length > 0 ? data.slice(0) : [];
            node.forEach((e, i) => {
                if ((typeof e === "object" && e !== {}) || (Array.isArray(e) && e.length > 0)) {
                    node[i] = ObjectUtils.copyDeep(e);
                }
            });
        } else if (typeof data === "object") {
            node = Object.assign({}, data);
            Object.keys(node).forEach(key => {
                if (
                    (typeof node[key] === "object" && node[key] !== {}) ||
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
        return item && typeof item === "object" && !Array.isArray(item);
    }

    /**
     * @param {T} target - The target object.
     * @param {T} sources - The objects to merge.
     * @returns {T} - The merged object.
     */
    public static mergeDeep<T extends Object>(
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
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    ObjectUtils.mergeDeep(target[key], source[key]);
                } else {
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return ObjectUtils.mergeDeep(target, ...sources);
    }

    public static mergeDefaults<T extends Object>(
        source: Partial<T>,
        defaults: T,
        ...additional: Partial<T>[]
    ): T {
        return ObjectUtils.mergeDeep(source, defaults, ...additional) as T;
    }
}
