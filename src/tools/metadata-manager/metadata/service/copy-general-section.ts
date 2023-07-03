import type { CopyGeneralSectionParams } from "../../types";

const copyGeneralSection = ({
  generalSectionInfo,
  destination,
}: CopyGeneralSectionParams) => {
  destination.general.audioFilename = generalSectionInfo.audioFileName;
  destination.general.previewTime = generalSectionInfo.previewTime;
  destination.general.epilepsyWarning = generalSectionInfo.epilepsyWarning;
  destination.general.widescreenStoryboard =
    generalSectionInfo.widescreenStoryboard;
  destination.general.samplesMatchPlaybackRate =
    generalSectionInfo.samplesMatchPlaybackRate;
};

export { copyGeneralSection };
