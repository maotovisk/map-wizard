import type { StandardBeatmap, StandardHitObject } from "osu-standard-stable";
import type { HitsoundableTimeLineObject, Options } from "src/copier/types";

import { HitSample, HitSound } from "osu-classes";
import { findNearestHitObject } from "../../utils";

export type CopyCircleHitsoundsParams = {
    hitObject: StandardHitObject;
    key: number;
    hitsoundedBeatmap: StandardBeatmap;
    clickableHitsoundObjects: HitsoundableTimeLineObject[];
    options: Options;
  };
  
export const copyCircleHitsounds = ({
    hitObject,
    hitsoundedBeatmap,
    clickableHitsoundObjects,
    key,
    options,
  }: CopyCircleHitsoundsParams) => {
    const clickableSound = findNearestHitObject({
      hitsoundableTimeLineObject: clickableHitsoundObjects,
      startTime: hitObject.startTime,
      threshold: options.timingThreshold,
    });
  
    if (!clickableSound && options.overwriteNotDefined) {
      hitsoundedBeatmap.hitObjects[key].samples = [new HitSample()];
      hitsoundedBeatmap.hitObjects[key].hitSound = HitSound.None;
    }
  
    if (clickableSound) {
      hitsoundedBeatmap.hitObjects[key].samples = clickableSound.HitSample;
      hitsoundedBeatmap.hitObjects[key].hitSound = clickableSound.HitSound;
    }
  
    return;
  };