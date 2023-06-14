import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { updateFeed } from 'src/helpers/feeds';
import schema from './schema';
import { UpdateFeedRequest } from 'src/models/request/updateFeedRequest';

const updateFeedHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const feedId = event.pathParameters.feedId
  await updateFeed(event.body as unknown as UpdateFeedRequest, feedId);
  return formatJSONResponse({
    result: true
  })
};

export const main = middyfy(updateFeedHandler);
