import { APIGatewayProxyEventQueryStringParameters } from "aws-lambda";

export function getNextKey(nextKeyParam: string): any {
  if (!nextKeyParam) {
    return undefined;
  }
  const uriDecoded = decodeURIComponent(nextKeyParam);
  return JSON.parse(uriDecoded);
}
export function getLimit(limitParam: string) {
    if (!limitParam) {
      return undefined
    }
  
    const limit = parseInt(limitParam, 10)
    if (limit <= 0) {
      throw new Error('Limit should be positive')
    }
  
    return limit
  }

export function encodeNextKey(lastEvaluatedKey) {
  if (!lastEvaluatedKey) {
    return null;
  }

  return encodeURIComponent(JSON.stringify(lastEvaluatedKey));
}
