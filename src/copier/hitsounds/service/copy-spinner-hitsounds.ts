import type { Spinner, StandardBeatmap } from "osu-standard-stable";
import type { HitsoundableTimeLineObject, Options } from "src/copier/types";

import { HitSample, HitSound } from "osu-classes";
import { findNearestHitObject } from "src/copier/utils";

export type CopySpinnerHitsoundsParams = {
  dragableHitsoundObjects: HitsoundableTimeLineObject[];
  hitObject: Spinner;
  key: number;
  hitsoundedBeatmap: StandardBeatmap;
  options: Options;
};

export const copySpinnerHitsounds = ({
  dragableHitsoundObjects,
  hitObject,
  hitsoundedBeatmap,
  key,
  options,
}: CopySpinnerHitsoundsParams) => {
  const clickableSpinnerSound = findNearestHitObject({
    hitsoundableTimeLineObject: dragableHitsoundObjects,
    startTime: hitObject.endTime,
    threshold: options.timingThreshold,
  });

  if (!clickableSpinnerSound && options.overwriteNotDefined) {
    hitsoundedBeatmap.hitObjects[key].samples = [new HitSample()];
    hitsoundedBeatmap.hitObjects[key].hitSound = HitSound.None;
  }

  if (clickableSpinnerSound) {
    hitsoundedBeatmap.hitObjects[key].samples = clickableSpinnerSound.HitSample;
    hitsoundedBeatmap.hitObjects[key].hitSound = clickableSpinnerSound.HitSound;
  }
  return;
};
