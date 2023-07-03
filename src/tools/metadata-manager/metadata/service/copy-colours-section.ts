import type { CopyColoursSectionParams } from "../../types";

const copyColoursSection = ({
  colourInfo,
  destination,
}: CopyColoursSectionParams) => {
  if (colourInfo.sliderBorderColour != null) {
    destination.colors.sliderBorderColor = colourInfo.sliderBorderColour;
  }
  if (colourInfo.sliderTrackColour != null) {
    destination.colors.sliderTrackColor = colourInfo.sliderTrackColour;
  }

  destination.colors.comboColors = colourInfo.comboColours;
};

export { copyColoursSection };
