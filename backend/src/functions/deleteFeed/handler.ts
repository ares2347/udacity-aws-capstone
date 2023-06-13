import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { deleteFeed, } from 'src/helpers/feeds';

const deleteFeedHandler = async (event: APIGatewayProxyEvent) => {
  const feedId = event.pathParameters.feedId
  await deleteFeed(feedId);
  return formatJSONResponse({
    result: true
  });
};

export const main = deleteFeedHandler;
