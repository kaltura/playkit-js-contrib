import { ComponentChild, ComponentChildren } from "preact";

export function getFirstChild(children?: ComponentChildren): ComponentChild | null {
    if (!children) {
        return null;
    }

    if (Array.isArray(children)) {
        if (children.length === 0) {
            return null;
        }

        if (children.length > 1) {
            console.warn("PresetItem support only single children, rendering only the first child");
        }

        return children[0];
    }

    return children;
}
