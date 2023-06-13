import type { AWS } from "@serverless/typescript";
import getFeeds from "@functions/getFeeds";
import auth from "@functions/auth";
import createFeed from "@functions/createFeed";
import updateFeed from "@functions/updateFeed";
import deleteFeed from "@functions/deleteFeed";
import getFeedById from "@functions/getFeedById";
import likeFeed from "@functions/likeFeed";

const serverlessConfiguration: AWS = {
  app: "udacity-capstone",
  service: "backend",
  frameworkVersion: "3",
  plugins: ["serverless-esbuild", "serverless-iam-roles-per-function"],
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
      AUTH_0_JWKS_URL:
        "https://dev-3xobn2786ug4wj1d.us.auth0.com/.well-known/jwks.json",
      SIGNED_URL_EXPIRATION: "3600",
      ATTACHMENTS_S3_BUCKET:
        "serverless-todo-images-361796378879-${self:provider.stage}",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: [
          "dynamodb:Scan",
          "dynamodb:Query",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:GetItem",
          "dynamodb:DeleteItem",
        ],
        Resource:
          "arn:aws:dynamodb:us-east-1:*:table/${self:provider.environment.FEEDS_TABLE}",
      },
      {
        Effect: "Allow",
        Action: ["s3:PutObject", "s3:GetObject"],
        Resource: "arn:aws:s3:::${self:provider.environment.ATTACHMENTS_S3_BUCKET}",
      },
      {
        Effect: "Allow",
        Action: ["dynamodb:Query"],
        Resource:["arn:aws:dynamodb:us-east-1:*:table/${self:provider.environment.FEEDS_TABLE}/index/${self:provider.environment.FEEDS_TABLE_GSI}"]
      }
      // Add more IAM role statements as needed
    ],
  },
  // import the function via paths
  functions: {
    auth,
    getFeeds,
    createFeed,
    updateFeed,
    deleteFeed,
    getFeedById,
    likeFeed,
  },
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
    },
  },
  resources: {
    Resources: {
      GatewayResponseDefault4XX: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
            "gatewayresponse.header.Access-Control-Allow-Methods":
              "'GET,OPTIONS,POST,PUT,PATCH,DELETE'",
          },
          ResponseType: "DEFAULT_4XX",
          RestApiId: {
            Ref: "ApiGatewayRestApi",
          },
        },
      },
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
            },
          ],
          KeySchema: [
            {
              AttributeName: "feedId",
              KeyType: "HASH",
            },
          ],
          BillingMode: "PAY_PER_REQUEST",
          GlobalSecondaryIndexes: [
            {
              IndexName: "byUserIdGsi",
              KeySchema: [
                {
                  AttributeName: "userId",
                  KeyType: "HASH",
                },
              ],
              Projection: {
                ProjectionType: "ALL",
              },
            },
          ],
        },
      },
      AttachmentsBucket: {
        Type: "AWS::S3::Bucket",
        Properties: {
          BucketName: "${self:provider.environment.ATTACHMENTS_S3_BUCKET}",
          CorsConfiguration: {
            CorsRules: [
              {
                AllowedOrigins: ["*"],
                AllowedHeaders: ["*"],
                AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
                MaxAge: 3000,
              },
            ],
          },
          PublicAccessBlockConfiguration: {
            BlockPublicPolicy: false,
            RestrictPublicBuckets: false,
          },
        },
      },
      BucketPolicy: {
        Type: "AWS::S3::BucketPolicy",
        Properties: {
          PolicyDocument: {
            Id: "udacitys3policy",
            Version: "2012-10-17",
            Statement: [
              {
                Sid: "PublicReadForGetBucketObjects",
                Effect: "Allow",
                Principal: "*",
                Action: ["s3:GetObject", "s3:PutObject"],
                Resource:
                  "arn:aws:s3:::${self:provider.environment.ATTACHMENTS_S3_BUCKET}/*",
              },
            ],
          },

          Bucket: "!Ref AttachmentsBucket",
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
