import { log } from "./logger";
import { ScaleCalculation, scaleVideo } from "./scaleVideo";

enum ChangeTypes {
  Show = "show",
  Hide = "hide"
}
export type PlayerSize = { width: number; height: number };
export type VideoSize = { width: number; height: number };
type ChangeData<T extends Cuepoint> = {
  time: number;
  type: ChangeTypes;
  cuePoint: T;
};

const reasonableSeekThreshold = 2000;

export interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Cuepoint {
  id: string;
  startTime: number;
  endTime?: number;
}

export class CuepointEngine<T extends Cuepoint> {
  protected cuepoints: T[];

  private isFirstTime = true;
  protected enabled = false;
  private lastHandledTime: number | null = null;
  private lastHandledTimeIndex: number | null = null;
  private nextTimeToHandle: number | null = null;
  private cuepointChanges: ChangeData<T>[] = [];

  constructor(cuepoints: T[]) {
    log("debug", "CuepointEngine:ctor", "executed");
    this.cuepoints = cuepoints;
    this.prepareCuepoint();
  }

  public getSnapshot(time: number): T[] {
    const timeIndex = this.findClosestLastIndexByTime(time);
    log(
      "debug",
      "CuepointEngine:getSnapshot",
      `create snapshot based on time ${time}`,
      {
        timeIndex
      }
    );
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
        log(
          "log",
          "CuepointEngine:updateTime",
          `cuepoint list empty. will always return empty snapshot`
        );
        this.isFirstTime = false;
      }
      return { snapshot: [] };
    }

    const userSeeked =
      !isFirstTime &&
      lastHandledTime !== null &&
      nextTimeToHandle !== null &&
      (lastHandledTime > currentTime ||
        currentTime - nextTimeToHandle > reasonableSeekThreshold);
    const hasChangesToHandle =
      isFirstTime ||
      (this.lastHandledTime !== null && this.lastHandledTime > currentTime) ||
      (this.nextTimeToHandle != null && currentTime >= this.nextTimeToHandle);
    const closestChangeIndex = this.findClosestLastIndexByTime(currentTime);
    const closestChangeTime =
      closestChangeIndex < 0
        ? 0
        : this.cuepointChanges[closestChangeIndex].time;

    if (!hasChangesToHandle) {
      // log('log', 'updateTime', `new time is between handled time and next time to handle, assume no delta`);

      if (forceSnapshot) {
        return {
          snapshot: this.createCuepointSnapshot(closestChangeIndex)
        };
      }

      return { delta: this.createEmptyDelta() };
    }

    log(
      "debug",
      "CuepointEngine:updateTime",
      `has changes to handle. check if need to return snapshot instead of delta based on provided new time`,
      {
        currentTime,
        closestChangeIndex,
        closestChangeTime,
        lastHandledTime,
        nextTimeToHandle,
        isFirstTime
      }
    );

    if (isFirstTime || forceSnapshot || userSeeked) {
      log(
        "debug",
        "CuepointEngine:updateTime",
        `some conditions doesn't allow returning delta, return snapshot instead`,
        { isFirstTime, userSeeked, forceSnapshot }
      );

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
      log(
        "log",
        "CuepointEngine:createCuepointSnapshot",
        `resulted with empty snapshot`,
        {
          targetIndex,
          enabled: this.enabled,
          cuepointCount: (this.cuepointChanges || []).length
        }
      );
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

    log("log", "CuepointEngine:createCuepointSnapshot", "resulted snapshot", {
      snapshot
    });
    return snapshot;
  }

  private createCuepointDelta(targetIndex: number): { show: T[]; hide: T[] } {
    if (
      !this.enabled ||
      !this.cuepointChanges ||
      this.cuepointChanges.length === 0
    ) {
      log(
        "log",
        "CuepointEngine:createCuepointDelta",
        `resulted with empty delta`,
        {
          enabled: this.enabled,
          cuepointCount: (this.cuepointChanges || []).length
        }
      );
      return this.createEmptyDelta();
    }

    const { lastHandledTimeIndex } = this;

    if (lastHandledTimeIndex === null) {
      log(
        "log",
        "CuepointEngine:createCuepointDelta",
        `invalid internal state. resulted with empty delta`
      );
      return this.createEmptyDelta();
    }

    const newCuepoint: T[] = [];
    const removedCuepoint: T[] = [];

    log(
      "log",
      "CuepointEngine:createCuepointDelta",
      `find cuepoint that were added or removed`
    );
    for (let index = lastHandledTimeIndex + 1; index <= targetIndex; index++) {
      const item = this.cuepointChanges[index];
      const cuepointIndex = newCuepoint.indexOf(item.cuePoint);
      if (item.type === ChangeTypes.Show) {
        if (cuepointIndex === -1) {
          newCuepoint.push(item.cuePoint);
        }
      } else {
        if (cuepointIndex !== -1) {
          log(
            "log",
            "CuepointEngine:createCuepointDelta",
            `cuepoint was marked with type ${item.type} at ${
              item.time
            }. remove from new cuepoint list as it wasn't visible yet`,
            { cuepoint: item.cuePoint }
          );
          newCuepoint.splice(cuepointIndex, 1);
        } else if (removedCuepoint.indexOf(item.cuePoint) === -1) {
          log(
            "log",
            "CuepointEngine:createCuepointDelta",
            `cuepoint was marked with type ${item.type} at ${
              item.time
            }. add to removed cuepoint list`,
            { cuepoint: item.cuePoint }
          );
          removedCuepoint.push(item.cuePoint);
        }
      }
    }

    log("log", "CuepointEngine:createCuepointDelta", "resulted delta", {
      newCuepoint,
      removedCuepoint
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
    log(
      "debug",
      "CuepointEngine:updateInternals",
      `update inner state with new time and index`,
      {
        lastHandledTime: this.lastHandledTime,
        lastHandledTimeIndex: this.lastHandledTimeIndex,
        nextTimeToHandle: this.nextTimeToHandle
      }
    );
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
    while (
      closestIndex < changesLength - 1 &&
      changes[closestIndex + 1].time === time
    ) {
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

    log(
      "debug",
      "CuepointEngine:prepareCuepoint",
      `tracking ${this.cuepointChanges.length} changes`,
      this.cuepointChanges
    );
  }
}
