import { HitSound, HitSample, SampleSet } from "osu-classes";
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
  console.log(beatmap.hitObjects);

  beatmap.hitObjects.forEach((hitObject) => {
    if (hitObject instanceof Circle) {
      hitsoundableTimeLineObject.push({
        startTime: hitObject.startTime,
        HitSample: hitObject.samples,
        HitSound: hitObject.hitSound,
        clickable: true,
      });
    } else if (hitObject instanceof Slider) {
      // This is a temporary workaround for a bug with the parser library that we are using,
      // which causes undefined hitsounds to be considered Normal hitsounds
      // when the hit object is a slider.
      if (
        hitObject.samples.length == 1 &&
        hitObject.samples[0].volume === 100 &&
        hitObject.samples[0].sampleSet === SampleSet[SampleSet.Normal]
      ) {
        const newSample = new HitSample();
        newSample.sampleSet = SampleSet[SampleSet.None];

        hitObject.samples = [newSample];
      }

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
        if (
          samples.length == 1 &&
          samples[0].volume === 100 &&
          samples[0].sampleSet === SampleSet[SampleSet.Normal]
        ) {
          const newSample = new HitSample();
          newSample.sampleSet = SampleSet[SampleSet.None];

          samples = [newSample];
        }

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
