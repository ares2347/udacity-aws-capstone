import { formatJSONResponse } from '@libs/api-gateway';
import { getFeedById } from 'src/helpers/feeds';
import { APIGatewayProxyEvent } from 'aws-lambda';

const getFeedsHandler = async (event: APIGatewayProxyEvent) => {
  const feedId = event.pathParameters.feedId;
  const result = await getFeedById(feedId);
  return formatJSONResponse({
    item: result
  });
};

export const main = getFeedsHandler;