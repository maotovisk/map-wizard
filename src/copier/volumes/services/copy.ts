import type { StandardBeatmap } from "osu-standard-stable";
import type { Options } from "src/copier/types";

import { ControlPointType } from "osu-classes";
import { isMuted } from "./is-muted";

type CopyVolumesParams = {
  originBeatmap: StandardBeatmap;
  destinationBeatmap: StandardBeatmap;
  options: Options;
};

export const copyVolumes = ({
  originBeatmap,
  destinationBeatmap,
  options,
}: CopyVolumesParams) => {
  const fromBeatmapSamplePoints = originBeatmap.controlPoints.samplePoints;
  let toBeatmapSamplePoints = destinationBeatmap.controlPoints.samplePoints;

  fromBeatmapSamplePoints.forEach((samplePoint) => {
    if (!options.copySamplesetChanges) return;

    if (options.removeMuting && isMuted(samplePoint.volume)) return;

    const fromBeatmapSamplePoint =
      destinationBeatmap.controlPoints.samplePointAt(samplePoint.startTime);

    if (!options.copyVolumes)
      samplePoint.volume = fromBeatmapSamplePoint.volume;

    destinationBeatmap.controlPoints
      .groupAt(samplePoint.startTime)
      .remove(fromBeatmapSamplePoint);

    destinationBeatmap.controlPoints
      .groupAt(samplePoint.startTime)
      .add(samplePoint);
  });

  toBeatmapSamplePoints = [...fromBeatmapSamplePoints];

  if (options.removeMuting) {
    toBeatmapSamplePoints.forEach((samplePoint) => {
      if (isMuted(samplePoint.volume)) {
        destinationBeatmap.controlPoints
          .groupAt(samplePoint.startTime)
          .remove(samplePoint);
      }
    });
  }

  const firstDestinationControlPointGroup =
    destinationBeatmap.controlPoints.groups[0];
  const secondDestionationControlPointGroup =
    destinationBeatmap.controlPoints.groups[1];
  const firstOriginControlPointGroup = originBeatmap.controlPoints.groups[0];

  const destinationStartTimeHappensFirst =
    firstDestinationControlPointGroup.startTime <
    firstOriginControlPointGroup.startTime;

  const sameSamplePointType =
    firstDestinationControlPointGroup.controlPoints[0].pointType ===
    ControlPointType.SamplePoint;

  const noTimingPointsInDestination =
    firstDestinationControlPointGroup.controlPoints.filter(
      (controlPoint) => controlPoint.pointType === ControlPointType.TimingPoint
    ).length < 1;

  if (
    destinationStartTimeHappensFirst &&
    sameSamplePointType &&
    noTimingPointsInDestination
  ) {
    destinationBeatmap.controlPoints
      .groupAt(secondDestionationControlPointGroup.startTime)
      .add(firstDestinationControlPointGroup.controlPoints[0]);

    destinationBeatmap.controlPoints.groups.shift();
  }
};
