import type { CopyMetadataSectionParams } from "../../types";

const copyMetadataSection = ({
  metadataInfo,
  destination,
}: CopyMetadataSectionParams) => {
  destination.metadata.artist = metadataInfo.artistRomanized;
  destination.metadata.artistUnicode = metadataInfo.artist;
  destination.metadata.title = metadataInfo.titleRomanized;
  destination.metadata.titleUnicode = metadataInfo.title;
  destination.metadata.creator = metadataInfo.creator;
  destination.metadata.tags = metadataInfo.tags;

  if (metadataInfo.beatmapId === 0)
    destination.metadata.beatmapId = metadataInfo.beatmapId;
  if (metadataInfo.beatmapSetId === -1)
    destination.metadata.beatmapSetId = metadataInfo.beatmapSetId;
};

export { copyMetadataSection };
