export class ObjectUtils {
    /**
     * @param {any} data - The data to copy.
     * @returns {any} - The copied data.
     */
    public static copyDeep(data: any): any {
        let node;
        if (Array.isArray(data)) {
            node = data.length > 0 ? data.slice(0) : [];
            node.forEach((e, i) => {
                if ((typeof e === "object" && e !== {}) || (Array.isArray(e) && e.length > 0)) {
                    node[i] = ObjectUtils.copyDeep(e);
                }
            });
        } else if (typeof data === "object") {
            //@ts-ignore
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
     * @param {any} item - The item to check.
     * @returns {boolean} - Whether the item is an object.
     */
    public static isObject(item: any) {
        return item && typeof item === "object" && !Array.isArray(item);
    }

    /**
     * @param {any} target - The target object.
     * @param {any} sources - The objects to merge.
     * @returns {Object} - The merged object.
     */
    public static mergeDeep(target: any, ...sources): Object {
        if (!sources.length) {
            return target;
        }
        const source = sources.shift();
        if (ObjectUtils.isObject(target) && ObjectUtils.isObject(source)) {
            for (const key in source) {
                if (ObjectUtils.isObject(source[key])) {
                    //@ts-ignore
                    if (!target[key]) Object.assign(target, { [key]: {} });
                    ObjectUtils.mergeDeep(target[key], source[key]);
                } else {
                    //@ts-ignore
                    Object.assign(target, { [key]: source[key] });
                }
            }
        }
        return ObjectUtils.mergeDeep(target, ...sources);
    }
}