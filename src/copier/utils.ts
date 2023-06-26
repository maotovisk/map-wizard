import { HitSound, type HitSample } from "osu-classes";
import {
  Circle,
  Slider,
  SliderTail,
  SliderTick,
  Spinner,
  type StandardBeatmap,
} from "osu-standard-stable";
import type {
  FindNearestHitObjectParams,
  HitsoundableTimeLineObject,
} from "./types";

export const calculateSampleBitwise = (samples: HitSample[]) => {
  let bitwise = 0;
  samples.forEach((sample) => {
    const sampleBitwise = HitSound[sample.hitSound];
    bitwise += sampleBitwise;
  });
  return bitwise;
};

export const convertBeatmapToHitsoundableTimeLine = (
  beatmap: StandardBeatmap
): HitsoundableTimeLineObject[] => {
  let hitsoundableTimeLineObject = [];

  beatmap.hitObjects.forEach((hitObject) => {
    if (hitObject instanceof Circle) {
      hitsoundableTimeLineObject.push({
        startTime: hitObject.startTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: true,
      });
    } else if (hitObject instanceof Slider) {
      hitsoundableTimeLineObject.push({
        startTime: hitObject.startTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: false,
      });

      const nestedHitObjects = hitObject.nestedHitObjects.filter(
        (nestedHitObject) => !(nestedHitObject instanceof SliderTick)
      );

      (hitObject as Slider).nodeSamples.forEach((samples, key) => {
        hitsoundableTimeLineObject.push({
          startTime:
            nestedHitObjects[key] instanceof SliderTail
              ? Math.round(nestedHitObjects[key].startTime) +
                hitObject.legacyLastTickOffset
              : Math.round(nestedHitObjects[key].startTime),
          HitSample: samples,
          HitSound: calculateSampleBitwise(samples),
          clickable: true,
        });
      });
    } else if (hitObject instanceof Spinner) {
      hitsoundableTimeLineObject.push({
        startTime: hitObject.endTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: true,
      });
    }
  });

  return hitsoundableTimeLineObject;
};

export const findNearestHitObject = ({
  hitsoundableTimeLineObject,
  startTime,
  threshold,
}: FindNearestHitObjectParams): HitsoundableTimeLineObject => {
  return hitsoundableTimeLineObject.find(
    (object) =>
      startTime >= object.startTime - threshold &&
      startTime <= object.startTime + threshold
  );
};
