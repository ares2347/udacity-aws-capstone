import { APIGatewayAuthorizerEvent, APIGatewayTokenAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import {verifyToken } from 'src/utils/tokenUtils'

const logger = createLogger('auth')
const auth = async (
  event: APIGatewayAuthorizerEvent
): Promise<CustomAuthorizerResult> => {
  logger.info('Authorizing a user', (event as APIGatewayTokenAuthorizerEvent).authorizationToken)
  try {
    const jwtToken = await verifyToken((event as APIGatewayTokenAuthorizerEvent).authorizationToken)
    logger.info('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    logger.error('User not authorized', { error: e.message })

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

export const main = auth;
