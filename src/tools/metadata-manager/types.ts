import type { Beatmap, Color4 } from "osu-classes";

export type MetadataInfo = {
  title?: string;
  titleRomanized?: string;
  artist?: string;
  artistRomanized?: string;
  source?: string;
  creator?: string;
  tags?: string[];
  beatmapId?: number;
  beatmapSetId?: number;
};

export type BeatmapGeneralInfo = {
  previewTime?: number;
  audioFileName?: string;
  epilepsyWarning?: boolean;
  widescreenStoryboard?: boolean;
  samplesMatchPlaybackRate?: boolean;
};

export type BeatmapColourInfo = {
  sliderBorderColour?: Color4;
  sliderTrackColour?: Color4;
  comboColours: Color4[];
};

export type BeatmapMetadata = {
  metadata: MetadataInfo;
  generalMetadata: BeatmapGeneralInfo;
  beatmapColours: BeatmapColourInfo;
};
export type ExportMetadataParams = {
  metadata: BeatmapMetadata;
  destinationBeatmaps: string[];
  options: BeatmapMetadataExporterOptions;
};

export type BeatmapMetadataExporterOptions = {
  removeDuplicates: boolean;
  resetBeatmapIDs: boolean;
};

export type CopyMetadataParams = {
  metadata: BeatmapMetadata;
  destinationBeatmap: Beatmap;
  options: BeatmapMetadataExporterOptions;
};

export type CopyColoursSectionParams = {
  destination: Beatmap;
  colourInfo: BeatmapColourInfo;
};

export type CopyGeneralSectionParams = {
  destination: Beatmap;
  generalSectionInfo: BeatmapGeneralInfo;
};

export type CopyMetadataSectionParams = {
  destination: Beatmap;
  metadataInfo: MetadataInfo;
};
