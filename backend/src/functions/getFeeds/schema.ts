export default {
  type: "object",
  properties: {
    queryStringParameters: {
      type: "object",
      properties: {
        nextKey: { type: "string" },
        limit: { type: "number" },
      },
    },
  },
} as const;
