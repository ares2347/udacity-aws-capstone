import { Feed } from "../entities/Feed";

export interface ScanFeedDto {
    items: Feed[]
    lastEvaluatedKey: any
  }
  