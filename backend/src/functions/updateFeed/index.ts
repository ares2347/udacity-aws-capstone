import schema from "./schema";
import { handlerPath } from "@libs/handler-resolver";

const feedTable = process.env.FEEDS_TABLE
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "patch",
        path: "feeds/{feedId}",
        cors: true,
        request: {
          schemas: {
            "application/json": schema,
          },
        },
      },
    },
  ],
  iamRoleStatementsInherit: true,
  iamRoleStatements:[
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem"],
      Resource:[`arn:aws:dynamodb:us-east-1:*:table/${feedTable}`],
    }
  ]      
};
