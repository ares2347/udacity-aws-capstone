import type { ValidatedEventAPIGatewayProxyEvent } from '@libs/api-gateway';
import { formatJSONResponse } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { scanFeeds } from 'src/helpers/feeds';
import { encodeNextKey, getLimit, getNextKey } from 'src/utils/dbUtils';
import schema from './schema';

const getFeedsHandler: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  let nextKey // Next key to continue scan operation if necessary
  let limit // Maximum number of elements to return
  try {
    // Parse query parameters
    nextKey = getNextKey(event.queryStringParameters["nextKey"])
    limit = getLimit(event.queryStringParameters["limit"]) || 20
  } catch (e) {
    console.log('Failed to parse query parameters: ', e.message)
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Invalid parameters'
      })
    }
  }
  const result = await scanFeeds(nextKey, limit);
  return formatJSONResponse({
    items: result.items,
    nextKey: encodeNextKey(result.lastEvaluatedKey)
  });
};

export const main = middyfy(getFeedsHandler);
