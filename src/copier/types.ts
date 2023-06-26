import type { ControlPointGroup, HitSample, HitSound } from "osu-classes";

export type Options = {
  copyVolumes: boolean;
  copySamplesetChanges: boolean;
  overwriteNotDefined: boolean;
  removeMuting: boolean;
  timingThreshold: number;
};

export type HitsoundableTimeLineObject = {
  startTime: number;
  HitSound: HitSound;
  HitSample: HitSample[];
  clickable: boolean;
};

export type FindNearestHitObjectParams = {
  hitsoundableTimeLineObject: HitsoundableTimeLineObject[];
  startTime: number;
  threshold: number;
};
