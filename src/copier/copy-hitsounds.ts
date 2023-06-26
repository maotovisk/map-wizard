import type { Options } from "./types";

import { Circle, Slider, Spinner, StandardBeatmap } from "osu-standard-stable";
import { convertBeatmapToHitsoundableTimeLine } from "./utils";
import {
  copyCircleHitsounds,
  copySliderHitsounds,
  copySpinnerHitsounds,
} from "./hitsounds/service";
import { copyVolumes } from "./volumes/services/copy";

export const copyHitsounds = (
  originBeatmap: StandardBeatmap,
  destinationBeatmap: StandardBeatmap,
  options: Options
): StandardBeatmap => {
  const hitsoundedBeatmap = structuredClone(destinationBeatmap);

  if (options.copySamplesetChanges || options.copyVolumes) {
    copyVolumes({
      originBeatmap,
      destinationBeatmap,
      options,
    });
  }

  const originBeatmapHitsoundObjects =
    convertBeatmapToHitsoundableTimeLine(originBeatmap);

  const clickableHitsoundObjects = originBeatmapHitsoundObjects.filter(
    (hitObject) => hitObject.clickable
  );

  const dragableHitsoundObjects = originBeatmapHitsoundObjects.filter(
    (hitObject) => !hitObject.clickable
  );

  hitsoundedBeatmap.hitObjects.forEach((hitObject, key) => {
    if (hitObject instanceof Circle) {
      copyCircleHitsounds({
        hitObject,
        hitsoundedBeatmap,
        clickableHitsoundObjects,
        key,
        options,
      });
    }

    if (hitObject instanceof Slider) {
      copySliderHitsounds({
        clickableHitsoundObjects,
        dragableHitsoundObjects,
        hitObject,
        hitsoundedBeatmap,
        key,
        options,
      });
    }

    if (hitObject instanceof Spinner) {
      copySpinnerHitsounds({
        dragableHitsoundObjects,
        hitObject,
        hitsoundedBeatmap,
        key,
        options,
      });
    }
  });

  return hitsoundedBeatmap;
};
