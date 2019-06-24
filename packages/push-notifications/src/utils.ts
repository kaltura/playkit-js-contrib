export class Utils {
    public static isEmptyObject(obj: Object) {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
}
