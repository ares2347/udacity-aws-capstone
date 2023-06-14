import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { likeFeed } from 'src/helpers/feeds';
import schema from './schema';


const likeFeedHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const feedId = event.pathParameters.feedId
  await likeFeed(feedId);
  return formatJSONResponse({
    result: true
  })
};

export const main = middyfy(likeFeedHandler);
