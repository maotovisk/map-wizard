import { HitSample, HitSound } from "osu-classes";
import {
  SliderTail,
  type Slider,
  StandardBeatmap,
  SliderTick,
} from "osu-standard-stable";
import type { HitsoundableTimeLineObject, Options } from "src/copier/types";
import { findNearestHitObject } from "../../utils";

export type CopySliderHitsoundsParams = {
  clickableHitsoundObjects: HitsoundableTimeLineObject[];
  dragableHitsoundObjects: HitsoundableTimeLineObject[];
  hitObject: Slider;
  key: number;
  hitsoundedBeatmap: StandardBeatmap;
  options: Options;
};

export const copySliderHitsounds = ({
  clickableHitsoundObjects,
  dragableHitsoundObjects,
  hitObject,
  hitsoundedBeatmap,
  key,
  options,
}: CopySliderHitsoundsParams) => {
  const nestedHitObjects = hitObject.nestedHitObjects.filter(
    (nestedHitObject) => !(nestedHitObject instanceof SliderTick)
  );

  hitObject.nodeSamples.forEach((sample, key_ns: number) => {
    const nho = nestedHitObjects[key_ns];
    const clickableSound = findNearestHitObject({
      hitsoundableTimeLineObject: clickableHitsoundObjects,
      startTime:
        nho instanceof SliderTail
          ? Math.round(nho.startTime) + hitObject.legacyLastTickOffset
          : Math.round(nho.startTime),
      threshold: options.timingThreshold,
    });

    if (!clickableSound && options.overwriteNotDefined) {
      const newSample = new HitSample();
      newSample.hitSound = HitSound[HitSound.None];

      (hitsoundedBeatmap.hitObjects[key] as Slider).nodeSamples[key_ns] = [
        newSample,
      ];
    }
    if (clickableSound) {
      (hitsoundedBeatmap.hitObjects[key] as Slider).nodeSamples[key_ns] =
        clickableSound.HitSample;
    }
    return;
  });

  const dragableSound = findNearestHitObject({
    hitsoundableTimeLineObject: dragableHitsoundObjects,
    startTime: hitObject.startTime,
    threshold: options.timingThreshold,
  });

  if (!dragableSound && options.overwriteNotDefined) {
    const newSample = new HitSample();
    newSample.hitSound = HitSound[HitSound.None];

    hitsoundedBeatmap.hitObjects[key].samples = [newSample];
    hitsoundedBeatmap.hitObjects[key].hitSound = HitSound.None;
  }

  if (dragableSound) {
    hitsoundedBeatmap.hitObjects[key].samples = dragableSound.HitSample;
    hitsoundedBeatmap.hitObjects[key].hitSound = dragableSound.HitSound;
  }

  return;
};
