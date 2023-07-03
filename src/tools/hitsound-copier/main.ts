import type { Options } from "./types";
import { BeatmapDecoder, BeatmapEncoder } from "osu-parsers";
import { StandardRuleset } from "osu-standard-stable";
import { copyHitsounds } from "./copy-hitsounds";

const copy = (
  fromContent: string,
  destinationBeatmapsContent: string[],
  options: Options
): string[] => {
  const decoder = new BeatmapDecoder();
  const ruleset = new StandardRuleset();

  const originBeatmap = ruleset.applyToBeatmap(
    decoder.decodeFromString(fromContent, {
      parseStoryboard: true,
    })
  );
  const destinationBeatmaps = destinationBeatmapsContent.map((beatmapString) =>
    ruleset.applyToBeatmap(
      decoder.decodeFromString(beatmapString, {
        parseStoryboard: true,
      })
    )
  );

  const hitsoundedBeatmap = destinationBeatmaps.map((beatmap) =>
    copyHitsounds(originBeatmap, beatmap, options)
  );

  const encoder = new BeatmapEncoder();

  const encodedHitsoundedBeatmaps = hitsoundedBeatmap.map((beatmap) =>
    encoder.encodeToString(beatmap)
  );
  return encodedHitsoundedBeatmaps;
};

export { copy };
