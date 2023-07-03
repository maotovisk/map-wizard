import type { Beatmap } from "osu-classes";
import type { CopyMetadataParams } from "./types";
import {
  copyColoursSection,
  copyGeneralSection,
  copyMetadataSection,
} from "./metadata/service";
import { getUniqueValues } from "./utils";

const copyMetadata = ({
  destinationBeatmap,
  metadata,
  options,
}: CopyMetadataParams): Beatmap => {
  const applyMetadataToBeatmap = destinationBeatmap;

  if (options.removeDuplicates) {
    metadata.metadata.tags = getUniqueValues(metadata.metadata.tags);
  }

  if (options.resetBeatmapIDs) {
    metadata.metadata.beatmapId = 0;
    metadata.metadata.beatmapSetId = -1;
  }

  copyGeneralSection({
    generalSectionInfo: metadata.generalMetadata,
    destination: applyMetadataToBeatmap,
  });
  copyMetadataSection({
    metadataInfo: metadata.metadata,
    destination: applyMetadataToBeatmap,
  });
  copyColoursSection({
    colourInfo: metadata.beatmapColours,
    destination: applyMetadataToBeatmap,
  });

  return applyMetadataToBeatmap;
};

export { copyMetadata };
