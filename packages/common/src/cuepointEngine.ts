import { getContribLogger } from "./contrib-logger";

enum ChangeTypes {
    Show = "show",
    Hide = "hide"
}

type ChangeData<T extends Cuepoint> = {
    time: number;
    type: ChangeTypes;
    cuePoint: T;
};

const defaultReasonableSeekThreshold = 2000;

export interface Cuepoint {
    id: string;
    startTime: number;
    endTime?: number;
}

const logger = getContribLogger({
    module: "contrib-common",
    class: "CuepointEngine"
});

export class CuepointEngine<T extends Cuepoint> {
    protected cuepoints: T[];

    private reasonableSeekThreshold: number;
    private isFirstTime = true;
    protected enabled = true;
    private lastHandledTime: number | null = null;
    private lastHandledTimeIndex: number | null = null;
    private nextTimeToHandle: number | null = null;
    private cuepointChanges: ChangeData<T>[] = [];

    constructor(cuepoints: T[], reasonableSeekThreshold: number = defaultReasonableSeekThreshold) {
        logger.debug("executed", {
            method: "ctor"
        });
        this.reasonableSeekThreshold = Math.max(
            defaultReasonableSeekThreshold,
            reasonableSeekThreshold
        );
        this.cuepoints = cuepoints;
        this.prepareCuepoint();
    }

    public getSnapshot(time: number): T[] {
        const timeIndex = this.findClosestLastIndexByTime(time);
        logger.debug(`create snapshot based on time ${time}`, {
            method: "getSnapshot",
            data: {
                timeIndex
            }
        });
        return this.createCuepointSnapshot(timeIndex);
    }

    public updateTime(
        currentTime: number,
        forceSnapshot = false
    ): {
        snapshot?: T[];
        delta?: { show: T[]; hide: T[] };
    } {
        const { isFirstTime, lastHandledTime, nextTimeToHandle } = this;

        if (this.cuepointChanges.length === 0) {
            if (isFirstTime) {
                logger.info(`cuepoint list empty. will always return empty snapshot`, {
                    method: "updateTime"
                });
                this.isFirstTime = false;
            }
            return { snapshot: [] };
        }

        const userSeeked =
            !isFirstTime &&
            lastHandledTime !== null &&
            nextTimeToHandle !== null &&
            (lastHandledTime > currentTime ||
                currentTime - nextTimeToHandle > this.reasonableSeekThreshold);
        const hasChangesToHandle =
            isFirstTime ||
            (this.lastHandledTime !== null && this.lastHandledTime > currentTime) ||
            (this.nextTimeToHandle != null && currentTime >= this.nextTimeToHandle);
        const closestChangeIndex = this.findClosestLastIndexByTime(currentTime);
        const closestChangeTime =
            closestChangeIndex < 0 ? 0 : this.cuepointChanges[closestChangeIndex].time;

        if (!hasChangesToHandle) {
            if (forceSnapshot) {
                return {
                    snapshot: this.createCuepointSnapshot(closestChangeIndex)
                };
            }

            return { delta: this.createEmptyDelta() };
        }

        logger.debug(
            `has changes to handle. check if need to return snapshot instead of delta based on provided new time`,
            {
                method: "updateTime",
                data: {
                    currentTime,
                    closestChangeIndex,
                    closestChangeTime,
                    lastHandledTime,
                    nextTimeToHandle,
                    isFirstTime
                }
            }
        );

        if (isFirstTime || forceSnapshot || userSeeked) {
            logger.debug(`some conditions doesn't allow returning delta, return snapshot instead`, {
                method: "updateTime",
                data: { isFirstTime, userSeeked, forceSnapshot }
            });

            const snapshot = this.createCuepointSnapshot(closestChangeIndex);
            this.updateInternals(closestChangeTime, closestChangeIndex);

            return { snapshot };
        }

        const delta = this.createCuepointDelta(closestChangeIndex);
        this.updateInternals(closestChangeTime, closestChangeIndex);

        return { delta };
    }

    protected getCurrentCuepointSnapshot(): T[] {
        return this.lastHandledTimeIndex
            ? this.createCuepointSnapshot(this.lastHandledTimeIndex)
            : [];
    }

    private createCuepointSnapshot(targetIndex: number): T[] {
        if (
            !this.enabled ||
            targetIndex < 0 ||
            !this.cuepointChanges ||
            this.cuepointChanges.length === 0
        ) {
            logger.debug(`resulted with empty snapshot`, {
                method: "createCuepointSnapshot",
                data: {
                    targetIndex,
                    enabled: this.enabled,
                    cuepointCount: (this.cuepointChanges || []).length
                }
            });
            return [];
        }

        const snapshot: T[] = [];

        for (let index = 0; index <= targetIndex; index++) {
            const item = this.cuepointChanges[index];
            const cuepointIndex = snapshot.indexOf(item.cuePoint);
            if (item.type === ChangeTypes.Show) {
                if (cuepointIndex === -1) {
                    snapshot.push(item.cuePoint);
                }
            } else {
                if (cuepointIndex !== -1) {
                    snapshot.splice(cuepointIndex, 1);
                }
            }
        }

        logger.debug(`resulted snapshot`, {
            method: "createCuepointSnapshot",
            data: { snapshot }
        });
        return snapshot;
    }

    private createCuepointDelta(targetIndex: number): { show: T[]; hide: T[] } {
        if (!this.enabled || !this.cuepointChanges || this.cuepointChanges.length === 0) {
            logger.debug(`resulted with empty delta`, {
                method: "createCuepointDelta",
                data: {
                    enabled: this.enabled,
                    cuepointCount: (this.cuepointChanges || []).length
                }
            });
            return this.createEmptyDelta();
        }

        const { lastHandledTimeIndex } = this;

        if (lastHandledTimeIndex === null) {
            logger.debug(`invalid internal state. resulted with empty delta`, {
                method: "createCuepointDelta"
            });
            return this.createEmptyDelta();
        }

        const newCuepoint: T[] = [];
        const removedCuepoint: T[] = [];

        logger.info(`find cuepoint that were added or removed`, {
            method: "createCuepointDelta"
        });
        for (let index = lastHandledTimeIndex + 1; index <= targetIndex; index++) {
            const item = this.cuepointChanges[index];
            const cuepointIndex = newCuepoint.indexOf(item.cuePoint);
            if (item.type === ChangeTypes.Show) {
                if (cuepointIndex === -1) {
                    newCuepoint.push(item.cuePoint);
                }
            } else {
                if (cuepointIndex !== -1) {
                    logger.info(
                        `cuepoint was marked with type ${item.type} at ${
                            item.time
                        }. remove from new cuepoint list as it wasn't visible yet`,
                        {
                            method: "createCuepointDelta",
                            data: { cuepoint: item.cuePoint }
                        }
                    );

                    newCuepoint.splice(cuepointIndex, 1);
                } else if (removedCuepoint.indexOf(item.cuePoint) === -1) {
                    logger.info(
                        `cuepoint was marked with type ${item.type} at ${
                            item.time
                        }. add to removed cuepoint list`,
                        {
                            method: "createCuepointDelta",
                            data: { cuepoint: item.cuePoint }
                        }
                    );
                    removedCuepoint.push(item.cuePoint);
                }
            }
        }

        logger.debug(`resulted delta`, {
            method: "createCuepointDelta",
            data: {
                newCuepoint,
                removedCuepoint
            }
        });

        return { show: newCuepoint, hide: removedCuepoint };
    }

    private updateInternals(time: number, timeIndex: number) {
        const { cuepointChanges } = this;

        if (!cuepointChanges || cuepointChanges.length === 0) {
            return;
        }

        const isIndexOfLastChange = timeIndex >= cuepointChanges.length - 1;
        const isIndexBeforeTheFirstChange = timeIndex === null;
        this.lastHandledTime = time;
        this.lastHandledTimeIndex = timeIndex;
        this.nextTimeToHandle = isIndexBeforeTheFirstChange
            ? cuepointChanges[0].time
            : isIndexOfLastChange
            ? cuepointChanges[cuepointChanges.length - 1].time
            : cuepointChanges[timeIndex + 1].time;
        this.isFirstTime = false;
        logger.debug(`update inner state with new time and index`, {
            method: "updateInternals",
            data: {
                lastHandledTime: this.lastHandledTime,
                lastHandledTimeIndex: this.lastHandledTimeIndex,
                nextTimeToHandle: this.nextTimeToHandle
            }
        });
    }

    private createEmptyDelta(): {
        show: T[];
        hide: T[];
    } {
        return { show: [], hide: [] };
    }

    private binarySearch(items: ChangeData<T>[], value: number): number | null {
        if (!items || items.length === 0) {
            // empty array, no index to return
            return null;
        }

        if (value < items[0].time) {
            // value less then the first item. return -1
            return -1;
        }
        if (value > items[items.length - 1].time) {
            // value bigger then the last item, return last item index
            return items.length - 1;
        }

        let lo = 0;
        let hi = items.length - 1;

        while (lo <= hi) {
            let mid = Math.floor((hi + lo + 1) / 2);

            if (value < items[mid].time) {
                hi = mid - 1;
            } else if (value > items[mid].time) {
                lo = mid + 1;
            } else {
                return mid;
            }
        }

        return Math.min(lo, hi); // return the lowest index which represent the last visual item
    }

    private findClosestLastIndexByTime(time: number): number {
        const changes = this.cuepointChanges;
        let closestIndex = this.binarySearch(changes, time);

        if (closestIndex === null) {
            return -1;
        }

        const changesLength = changes.length;
        while (closestIndex < changesLength - 1 && changes[closestIndex + 1].time === time) {
            closestIndex++;
        }

        return closestIndex;
    }

    private prepareCuepoint() {
        (this.cuepoints || []).forEach(cuepoint => {
            if (
                cuepoint.startTime !== null &&
                typeof cuepoint.startTime !== "undefined" &&
                cuepoint.startTime >= 0
            ) {
                this.cuepointChanges.push({
                    time: cuepoint.startTime,
                    type: ChangeTypes.Show,
                    cuePoint: cuepoint as T // NOTICE: it is the responsability of this engine not to return cuepoint without layout
                });
            }

            if (
                cuepoint.endTime !== null &&
                typeof cuepoint.endTime !== "undefined" &&
                cuepoint.endTime >= 0
            ) {
                this.cuepointChanges.push({
                    time: cuepoint.endTime,
                    type: ChangeTypes.Hide,
                    cuePoint: cuepoint as T // NOTICE: it is the responsability of this engine not to return cuepoint without layout
                });
            }
        });

        this.cuepointChanges.sort((a, b) => {
            return a.time < b.time ? -1 : a.time === b.time ? 0 : 1;
        });

        logger.debug(`tracking ${this.cuepointChanges.length} changes`, {
            method: "prepareCuepoint",
            data: {
                changes: this.cuepointChanges
            }
        });
    }
}
