import { handlerPath } from "@libs/handler-resolver";

const feedTable = process.env.FEEDS_TABLE
const bucket = process.env.ATTACHMENTS_S3_BUCKET
export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: "get",
        path: "feeds/uploadUrl/{feedId}",
        cors: true,
        authorizer: "auth",
      },
    },
  ],
  iamRoleStatementsInherit: true,
  iamRoleStatements:[
    {
      Effect: "Allow",
      Action: ["dynamodb:UpdateItem"],
      Resource:[`arn:aws:dynamodb:us-east-1:*:table/${feedTable}`],
    },
    {
      Effect: "Allow",
      Action: ["s3:PutObject","s3:GetObject"],
      Resource:[`arn:aws:s3:::${bucket}`],
    },
  ]      
};
