import type { Options } from "./types";
import { BeatmapDecoder, BeatmapEncoder } from "osu-parsers";
import { StandardRuleset } from "osu-standard-stable";
import { copyHitsounds } from "./copy-hitsounds";

const copy = (
  fromContent: string,
  toContent: string[],
  options: Options
): string[] => {
  const decoder = new BeatmapDecoder();
  const ruleset = new StandardRuleset();

  const beatmapFrom = ruleset.applyToBeatmap(
    decoder.decodeFromString(fromContent, {
      parseStoryboard: true,
    })
  );
  const beatmapsTo = toContent.map((beatmapString) =>
    ruleset.applyToBeatmap(
      decoder.decodeFromString(beatmapString, {
        parseStoryboard: true,
      })
    )
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
