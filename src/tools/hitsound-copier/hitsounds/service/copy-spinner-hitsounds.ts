import type { Spinner, StandardBeatmap } from "osu-standard-stable";
import type { HitsoundableTimeLineObject, Options } from "../../types";

import { HitSample, HitSound } from "osu-classes";
import { findNearestHitObject } from "../../utils";

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
    const newSample = new HitSample();
    newSample.hitSound = HitSound[HitSound.None];

    hitsoundedBeatmap.hitObjects[key].samples = [newSample];
    hitsoundedBeatmap.hitObjects[key].hitSound = HitSound.None;
  }

  if (clickableSpinnerSound) {
    hitsoundedBeatmap.hitObjects[key].samples = clickableSpinnerSound.HitSample;
    hitsoundedBeatmap.hitObjects[key].hitSound = clickableSpinnerSound.HitSound;
  }
  return;
};
