import { useFeatureRecords } from "../../shared/hooks/useFeatureRecords";
import { subscribersService } from "../services/subscribersService";

export function useSubscribers() {
  return useFeatureRecords(subscribersService, {
    fileName: "loop-subscribers.csv",
  });
}
