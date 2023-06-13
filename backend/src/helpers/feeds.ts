import { createLogger } from "src/utils/logger";
import { FeedAccess } from "./feedAccess";
import { ScanFeedDto } from "src/models/dtos/scanFeedDto";
import { CreateFeedRequest } from "src/models/request/createFeedRequest";
import { Feed } from "src/models/entities/Feed";
import { UpdateFeedRequest } from "src/models/request/updateFeedRequest";

const feedAccess = new FeedAccess();
const logger = createLogger('feeds');

export async function scanFeeds(nextKey: any, limit: number): Promise<ScanFeedDto>{
    logger.info("Fetching feeds");
    const result = feedAccess.getFeeds(nextKey, limit);
    logger.info("Feeds fetched");
    return result;
}
export async function getFeedById(feedId): Promise<Feed>{
    logger.info(`Fetching feed id ${feedId}`);
    const result = feedAccess.getFeedById(feedId);
    logger.info("Feed fetched");
    return result;
}
export async function createFeed(feed: CreateFeedRequest, userId: string): Promise<Feed>{
    logger.info("Fetching feeds");
    const result = await feedAccess.createFeed(feed, userId);
    logger.info("Feeds fetched");
    return result;
}
export async function updateFeed(feed: UpdateFeedRequest, feedId: string): Promise<void>{
    logger.info("Fetching feeds");
    await feedAccess.updateFeed(feed, feedId);
    logger.info("Feeds fetched");
}
export async function deleteFeed(feedId: string): Promise<void>{
    logger.info("Fetching feeds");
    await feedAccess.deleteFeed(feedId);
    logger.info("Feeds fetched");
}
export async function likeFeed(feedId: string): Promise<void>{
    logger.info("Fetching feeds");
    await feedAccess.likeFeed(feedId);
    logger.info("Feeds fetched");
}