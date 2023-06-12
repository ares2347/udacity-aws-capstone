import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { createFeed } from 'src/helpers/feeds';
import schema from './schema';
import { getUserId } from 'src/utils/tokenUtils';
import { CreateFeedRequest } from 'src/models/request/createFeedRequest';

const createFeedHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  const userId = getUserId(event.headers);
  const result = await createFeed(event.body as unknown as CreateFeedRequest, userId);
  return formatJSONResponse({
    item: result
  });
};

export const main = middyfy(createFeedHandler);
