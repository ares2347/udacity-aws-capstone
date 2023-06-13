import * as AWS from "aws-sdk";
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { ScanFeedDto } from "src/models/dtos/scanFeedDto";
import { Feed } from "src/models/entities/Feed";
import { CreateFeedRequest } from "src/models/request/createFeedRequest";
import { UpdateFeedRequest } from "src/models/request/updateFeedRequest";
import * as uuid from 'uuid';

export class FeedAccess {
    constructor(
        private readonly docClient: DocumentClient = new AWS.DynamoDB.DocumentClient(),
        private readonly feedTable = process.env.FEEDS_TABLE
    ){}

    async getFeeds(nextKey: any, limit: number) : Promise<ScanFeedDto>{
        const result =  await this.docClient.scan({
            TableName: this.feedTable,
            Limit: limit,
            ExclusiveStartKey: nextKey
        }).promise();
        return {
            items: result.Items as Feed[],
            lastEvaluatedKey: result.LastEvaluatedKey
        }
    }
    async getFeedById(feedId: string) : Promise<Feed>{
        const result =  await this.docClient.get({
            TableName: this.feedTable,
            Key: {
                "feedId": feedId
            }
        }).promise();
        return result.Item as Feed;
    }
    async createFeed(feed: CreateFeedRequest, userId : string) : Promise<Feed>{
        const feedId = uuid.v4();

        const item : Feed = {
            caption: feed.caption,
            feedId: feedId,
            userId: userId,
            createdAt: new Date().toISOString(),
            updatedAt:  new Date().toISOString(),
            attachmentUrl: feed.attachmentUrl,
            name: feed.name,
            picture: feed.picture,
            reaction: 0
        }

        await this.docClient.put({
            TableName: this.feedTable,
            Item: item
        }).promise();
        return item;
    }
    async updateFeed(feed: UpdateFeedRequest, feedId: string) : Promise<void>{
        await this.docClient.update({
            TableName: this.feedTable,
            Key: {
                "todoId": feedId
            },
            UpdateExpression: "set #caption = :caption, attachmentUrl = :attachmentUrl, updatedAt = :updatedAt",
            ExpressionAttributeNames: {
                "#todoName": "name"
            },
            ExpressionAttributeValues: {
                ":caption": feed.caption,
                ":attachmentUrl": feed.attachmentUrl,
                ":updatedAt": new Date().toISOString()
            }
        }).promise();
    }
    async likeFeed(feedId: string) : Promise<void>{
        await this.docClient.update({
            TableName: this.feedTable,
            Key: {
                "todoId": feedId
            },
            UpdateExpression: "set reaction = reaction + 1",
        }).promise();
    }

    async deleteFeed(todoId: string) : Promise<void>{
        await this.docClient.delete({
            TableName: this.feedTable,
            Key: {
                "todoId": todoId
            }
        }).promise();
    }
}