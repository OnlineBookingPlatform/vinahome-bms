import dayjs from "dayjs";

export const formatDate = (date: string | null) => {
  return date ? dayjs(date).format("DD/MM/YYYY") : "";
};
