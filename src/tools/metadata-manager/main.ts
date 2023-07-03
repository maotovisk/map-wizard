import { BeatmapDecoder, BeatmapEncoder } from "osu-parsers";
import type { BeatmapMetadata, ExportMetadataParams } from "./types";
import { copyMetadata } from "./copy-metadata";

const importMetadata = (originBeatmap: string): BeatmapMetadata => {
  const decoder = new BeatmapDecoder();

  const decodedOriginBeatmap = decoder.decodeFromString(originBeatmap, {
    parseStoryboard: true,
  });

  return {
    metadata: {
      artist: decodedOriginBeatmap.metadata.artistUnicode,
      artistRomanized: decodedOriginBeatmap.metadata.artist,
      title: decodedOriginBeatmap.metadata.titleUnicode,
      titleRomanized: decodedOriginBeatmap.metadata.title,
      creator: decodedOriginBeatmap.metadata.creator,
      source: decodedOriginBeatmap.metadata.source,
      tags: decodedOriginBeatmap.metadata.tags,
    },
    generalMetadata: {
      audioFileName: decodedOriginBeatmap.general.audioFilename,
      previewTime: decodedOriginBeatmap.general.previewTime,
      epilepsyWarning: decodedOriginBeatmap.general.epilepsyWarning,
      samplesMatchPlaybackRate:
        decodedOriginBeatmap.general.samplesMatchPlaybackRate,
      widescreenStoryboard: decodedOriginBeatmap.general.widescreenStoryboard,
    },
    beatmapColours: {
      sliderBorderColour: decodedOriginBeatmap.colors.sliderBorderColor,
      sliderTrackColour: decodedOriginBeatmap.colors.sliderTrackColor,
      comboColours: decodedOriginBeatmap.colors.comboColors,
    },
  };
};

const exportMetadata = ({
  destinationBeatmaps,
  metadata,
  options,
}: ExportMetadataParams): string[] => {
  const decoder = new BeatmapDecoder();

  const decodedDestinationBeatmap = destinationBeatmaps.map((beatmapString) =>
    decoder.decodeFromString(beatmapString, {
      parseStoryboard: true,
    })
  );

  const copiedMetadataBeatmap = decodedDestinationBeatmap.map((beatmap) =>
    copyMetadata({ destinationBeatmap: beatmap, metadata, options })
  );

  const encoder = new BeatmapEncoder();

  const encodedCopiedMetadataBeatmaps = copiedMetadataBeatmap.map((beatmap) =>
    encoder.encodeToString(beatmap)
  );

  return encodedCopiedMetadataBeatmaps;
};
export { importMetadata, exportMetadata };
