/// <reference path="../../common/player-internals.d.ts" />

declare module "*.scss" {
    const content: { [className: string]: string };
    export = content;
}
