import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { deleteFeed, } from 'src/helpers/feeds';
import schema from './schema';

const deleteFeedHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const feedId = event.pathParameters.feedId
  await deleteFeed(feedId);
  return formatJSONResponse({
    result: true
  });
};

export const main = middyfy(deleteFeedHandler);
