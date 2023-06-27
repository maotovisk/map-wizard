import type {
  FindNearestHitObjectParams,
  HitsoundableTimeLineObject,
} from "./types";

import {
  Circle,
  Slider,
  SliderTail,
  SliderTick,
  Spinner,
  type StandardBeatmap,
} from "osu-standard-stable";
import { HitSound, HitSample, SampleSet } from "osu-classes";

export const calculateSampleBitwise = (samples: HitSample[]) => {
  let bitwise = 0;
  samples.forEach((sample) => {
    const sampleBitwise = HitSound[sample.hitSound];
    bitwise += sampleBitwise;
  });
  return bitwise;
};

const resetUndefinedHitsoundSamples = (samples: HitSample[]) => {
  // This is a temporary workaround for a bug with the parser library that we are using,
  // which causes undefined hitsounds to be considered Normal hitsounds
  // when the hit object is a slider.

  if (
    samples.length == 1 &&
    samples[0].volume === 100 &&
    samples[0].sampleSet === SampleSet[SampleSet.Normal]
  ) {
    const newSample = new HitSample();

    newSample.sampleSet = SampleSet[SampleSet.None];

    samples = [newSample];
  }
};

export const convertBeatmapToHitsoundableTimeLine = (
  beatmap: StandardBeatmap
): HitsoundableTimeLineObject[] => {
  const hitsoundableTimeLineObject: Array<HitsoundableTimeLineObject> = [];

  beatmap.hitObjects.forEach((hitObject) => {
    if (hitObject instanceof Circle) {
      hitsoundableTimeLineObject.push({
        startTime: hitObject.startTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: true,
      });

      return;
    }

    if (hitObject instanceof Slider) {
      resetUndefinedHitsoundSamples(hitObject.samples);

      hitsoundableTimeLineObject.push({
        startTime: hitObject.startTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: false,
      });

      const nestedHitObjects = hitObject.nestedHitObjects.filter(
        (nestedHitObject) => !(nestedHitObject instanceof SliderTick)
      );

      hitObject.nodeSamples.forEach((samples, key) => {
        resetUndefinedHitsoundSamples(samples);

        const keyStartTime = Math.round(nestedHitObjects[key].startTime);
        const newHitSoundBitwise = calculateSampleBitwise(samples);

        hitsoundableTimeLineObject.push({
          startTime:
            nestedHitObjects[key] instanceof SliderTail
              ? keyStartTime + hitObject.legacyLastTickOffset
              : keyStartTime,
          HitSample: samples,
          HitSound: newHitSoundBitwise,
          clickable: true,
        });
      });

      return;
    }

    if (hitObject instanceof Spinner) {
      hitsoundableTimeLineObject.push({
        startTime: hitObject.endTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: true,
      });

      return;
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
