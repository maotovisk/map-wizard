import { DEFAULT_MUTED_VOLUME_PERCENTAGE } from "../constants";

export const isMuted = (volume: number) =>
  volume <= DEFAULT_MUTED_VOLUME_PERCENTAGE;
