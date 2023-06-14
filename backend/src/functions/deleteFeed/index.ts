import { handlerPath } from "@libs/handler-resolver";

const feedTable = process.env.FEEDS_TABLE
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "delete",
        path: "feeds/{feedId}",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatementsInherit: true,
  iamRoleStatements:[
    {
      Effect: "Allow",
      Action: ["dynamodb:DeleteItem"],
      Resource:[`arn:aws:dynamodb:us-east-1:*:table/${feedTable}`],
    }
  ]      
};
