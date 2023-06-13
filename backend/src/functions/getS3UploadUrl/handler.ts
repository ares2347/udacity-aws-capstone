
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { getUploadUrl } from 'src/helpers/feeds';

const updateFeedHandler = async (event: APIGatewayProxyEvent) => {
  const feedId = event.pathParameters.feedId
  const uploadUrl = await getUploadUrl(feedId);
  return formatJSONResponse({
    uploadUrl: uploadUrl
  })
};

export const main = updateFeedHandler;
