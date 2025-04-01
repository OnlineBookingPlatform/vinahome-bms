import dayjs from "dayjs";

export const formatTime = (time: string | null): string => {
  return time ? dayjs(time, "HH:mm").format("HH:mm") : "";
};
