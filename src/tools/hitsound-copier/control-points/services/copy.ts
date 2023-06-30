import type { StandardBeatmap } from "osu-standard-stable";
import type { Options } from "../../types";

import {
  ControlPointType,
  DifficultyPoint,
  SamplePoint,
  TimingPoint,
} from "osu-classes";
import { isMuted } from "./is-muted";

type CopySamplePointsParams = {
  originBeatmap: StandardBeatmap;
  destinationBeatmap: StandardBeatmap;
  options: Options;
};

export const copySamplePoints = ({
  originBeatmap,
  destinationBeatmap,
  options,
}: CopySamplePointsParams) => {
  const originBeatmapSamplePoints = originBeatmap.controlPoints.samplePoints;
  let destinationBeatmapSamplePoints =
    destinationBeatmap.controlPoints.samplePoints;

  originBeatmapSamplePoints.forEach((samplePoint) => {
    if (!options.copySamplesetChanges) return;

    if (options.removeMuting && isMuted(samplePoint.volume)) return;

    const destinationBeatmapSamplePoint =
      destinationBeatmap.controlPoints.samplePointAt(samplePoint.startTime);

    if (!options.copyVolumes)
      samplePoint.volume = destinationBeatmapSamplePoint.volume;

    destinationBeatmap.controlPoints
      .groupAt(samplePoint.startTime)
      .remove(destinationBeatmapSamplePoint);

    destinationBeatmap.controlPoints
      .groupAt(samplePoint.startTime)
      .add(samplePoint);
  });

  destinationBeatmapSamplePoints = [...originBeatmapSamplePoints];

  if (options.removeMuting) {
    destinationBeatmapSamplePoints.forEach((samplePoint) => {
      if (isMuted(samplePoint.volume)) {
        destinationBeatmap.controlPoints
          .groupAt(samplePoint.startTime)
          .remove(samplePoint);
      }
    });
  }

  // This is a hack to prevent that the destination is encoded with a 0 offset
  // sample point that happens before the first timing point.

  const firstDestinationControlPointGroup =
    destinationBeatmap.controlPoints.groups[0];
  const secondDestionationControlPointGroup =
    destinationBeatmap.controlPoints.groups[1];
  const firstOriginControlPointGroup = originBeatmap.controlPoints.groups[0];

  const destinationStartTimeHappensFirst =
    firstDestinationControlPointGroup.startTime <
    firstOriginControlPointGroup.startTime;

  const firstControlPointGroupHasNotTimingPoint =
    !firstDestinationControlPointGroup.controlPoints.find((controlPoint) => {
      controlPoint instanceof TimingPoint;
    });

  if (
    destinationStartTimeHappensFirst &&
    firstControlPointGroupHasNotTimingPoint
  ) {
    destinationBeatmap.controlPoints.groups.shift();

    const difficultyPointInSecondDestinationGroup =
      secondDestionationControlPointGroup.controlPoints.find(
        (controlPoint) =>
          controlPoint.pointType === ControlPointType.DifficultyPoint
      );

    if (!difficultyPointInSecondDestinationGroup) {
      const newDifficultyPoint = new DifficultyPoint();
      newDifficultyPoint.sliderVelocity = 1;

      destinationBeatmap.controlPoints
        .groupAt(secondDestionationControlPointGroup.startTime)
        .add(newDifficultyPoint);
    }
  }

  if (!firstControlPointGroupHasNotTimingPoint) {
    const firstControlPointGroupHasDifficultyPoint =
      firstDestinationControlPointGroup.controlPoints.find((controlPoint) => {
        controlPoint instanceof DifficultyPoint;
      });

    if (firstControlPointGroupHasDifficultyPoint) {
      const newDifficultyPoint = new DifficultyPoint();
      newDifficultyPoint.sliderVelocity = 1;

      destinationBeatmap.controlPoints
        .groupAt(firstDestinationControlPointGroup.startTime)
        .add(newDifficultyPoint);
    } else {
      destinationBeatmap.controlPoints.difficultyPointAt(
        firstDestinationControlPointGroup.startTime
      ).sliderVelocity = 1;
    }
  }
};
