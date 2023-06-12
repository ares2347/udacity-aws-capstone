import type { AWS } from "@serverless/typescript";
import getFeeds from "@functions/getFeeds";
import auth from "@functions/auth";
import createFeed from "@functions/createFeed";
import updateFeed from "@functions/updateFeed";
import deleteFeed from "@functions/deleteFeed";

const serverlessConfiguration: AWS = {
  app: "udacity-capstone",
  service: "backend",
  frameworkVersion: "3",
  plugins: [
    "serverless-esbuild",
    "serverless-iam-roles-per-function"
  ],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    lambdaHashingVersion: "20201221",
    profile: "serverless",
    stage: "dev",
    region: "us-east-1",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      FEEDS_TABLE: "Feeds-dev",
      FEEDS_TABLE_GSI: "byUserIdGsi",
      AUTH_0_JWKS_URL: "https://dev-3xobn2786ug4wj1d.us.auth0.com/.well-known/jwks.json",
      SIGNED_URL_EXPIRATION: "3600"
    },
  },
  // import the function via paths
  functions: { auth, getFeeds, createFeed, updateFeed, deleteFeed },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node16",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    }
  },
  resources: {
    Resources: {
      FeedsTable: {
        Type: "AWS::DynamoDB::Table",
        Properties: {
          TableName: "Feeds-dev",
          AttributeDefinitions: [
            {
              AttributeName: "feedId",
              AttributeType: "S",
            },
            {
              AttributeName: "userId",
              AttributeType: "S",
            }
          ],
          KeySchema:[{
            AttributeName: "feedId",
            KeyType: "HASH"
          }],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes:[
            {
            "IndexName": "byUserIdGsi",
            KeySchema:[
              {              
                AttributeName: "userId",
                KeyType: "HASH"
              }
            ],
            Projection:{
              ProjectionType: "ALL"
            }
          }]
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
