import { BeatmapDecoder, BeatmapEncoder } from "osu-parsers";
import {
  Circle,
  Slider,
  SliderTail,
  SliderTick,
  Spinner,
  StandardBeatmap,
  StandardRuleset,
} from "osu-standard-stable";
import {
  convertBeatmapToHitsoundableTimeLine,
  findNearestHitObject,
} from "./utils";
import type { Options } from "./types";
import { ControlPointType, HitSample, HitSound } from "osu-classes";

const copyHitsounds = (
  fromBeatmap: StandardBeatmap,
  toBeatmap: StandardBeatmap,
  options: Options
): StandardBeatmap => {
  const hitsoundedBeatmap = toBeatmap;

  if (options.copySamplesetChanges || options.copyVolumes) {
    fromBeatmap.controlPoints.samplePoints.forEach((samplePoint) => {
      if (options.removeMuting && samplePoint.volume <= 5) return;
      if (!options.copySamplesetChanges) return;

      const sample = hitsoundedBeatmap.controlPoints.samplePointAt(
        samplePoint.startTime
      );

      if (!options.copyVolumes) samplePoint.volume = sample.volume;

      hitsoundedBeatmap.controlPoints
        .groupAt(samplePoint.startTime)
        .remove(sample);

      hitsoundedBeatmap.controlPoints
        .groupAt(samplePoint.startTime)
        .add(samplePoint);
    });

    hitsoundedBeatmap.controlPoints.samplePoints =
      fromBeatmap.controlPoints.samplePoints;

    if (options.removeMuting)
      hitsoundedBeatmap.controlPoints.samplePoints.forEach((samplePoint) => {
        if (samplePoint.volume <= 5) {
          hitsoundedBeatmap.controlPoints
            .groupAt(samplePoint.startTime)
            .remove(samplePoint);
        }
      });

    if (
      hitsoundedBeatmap.controlPoints.groups[0].startTime <
        fromBeatmap.controlPoints.groups[0].startTime &&
      hitsoundedBeatmap.controlPoints.groups[0].controlPoints[0].pointType ===
        ControlPointType.SamplePoint &&
      hitsoundedBeatmap.controlPoints.groups[0].controlPoints.filter(
        (controlPoint) =>
          controlPoint.pointType === ControlPointType.TimingPoint
      ).length < 1
    ) {
      hitsoundedBeatmap.controlPoints
        .groupAt(hitsoundedBeatmap.controlPoints.groups[1].startTime)
        .add(hitsoundedBeatmap.controlPoints.groups[0].controlPoints[0]);
      hitsoundedBeatmap.controlPoints.groups.shift();
    }
  }

  const fromBeatmapHitsoundObjects =
    convertBeatmapToHitsoundableTimeLine(fromBeatmap);

  const clickableHitsoundObjects = fromBeatmapHitsoundObjects.filter(
    (hitObject) => hitObject.clickable === true
  );

  const dragableHitsoundObjects = fromBeatmapHitsoundObjects.filter(
    (hitObject) => hitObject.clickable === false
  );

  hitsoundedBeatmap.hitObjects.forEach((hitObject, key) => {
    if (hitObject instanceof Circle) {
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
    }

    if (hitObject instanceof Slider) {
      const nestedHitObjects = hitObject.nestedHitObjects.filter(
        (nho) => !(nho instanceof SliderTick)
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
          (hitsoundedBeatmap.hitObjects[key] as Slider).nodeSamples[key_ns] = [
            new HitSample(),
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
        hitsoundedBeatmap.hitObjects[key].samples = [new HitSample()];
        hitsoundedBeatmap.hitObjects[key].hitSound = HitSound.None;
      }
      if (dragableSound) {
        hitsoundedBeatmap.hitObjects[key].samples = dragableSound.HitSample;
        hitsoundedBeatmap.hitObjects[key].hitSound = dragableSound.HitSound;
      }
      return;
    }

    if (hitObject instanceof Spinner) {
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
        hitsoundedBeatmap.hitObjects[key].samples =
          clickableSpinnerSound.HitSample;
        hitsoundedBeatmap.hitObjects[key].hitSound =
          clickableSpinnerSound.HitSound;
      }
      return;
    }
  });

  return hitsoundedBeatmap;
};

const copy = (
  fromContent: string,
  toContent: string[],
  options: Options
): string[] => {
  const decoder = new BeatmapDecoder();

  const ruleset = new StandardRuleset();

  const beatmapFrom = ruleset.applyToBeatmap(
    decoder.decodeFromString(fromContent)
  );
  const beatmapsTo = toContent.map((beatmapString) =>
    ruleset.applyToBeatmap(decoder.decodeFromString(beatmapString))
  );

  const hitsoundedBeatmap = beatmapsTo.map((beatmap) =>
    copyHitsounds(beatmapFrom, beatmap, options)
  );

  const encoder = new BeatmapEncoder();

  const encodedHitsoundedBeatmaps = hitsoundedBeatmap.map((beatmap) =>
    encoder.encodeToString(beatmap)
  );
  return encodedHitsoundedBeatmaps;
};

export { copy };
