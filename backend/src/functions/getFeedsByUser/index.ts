import { handlerPath } from "@libs/handler-resolver";

const feedTable = process.env.FEEDS_TABLE
const feedTableGsi = process.env.FEEDS_TABLE_GSI
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "feeds/my-feed",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatementsInherit: true,
  iamRoleStatements:[
    {
      Effect: "Allow",
      Action: ["dynamodb:Query"],
      Resource:[`arn:aws:dynamodb:us-east-1:*:table/${feedTable}/index/${feedTableGsi}`],
    }
  ]      
};
