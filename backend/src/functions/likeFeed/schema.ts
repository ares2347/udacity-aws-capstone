export default {
  type: "object",
  properties: {
    pathParameters: {
      type: "object",
      properties: {
        feedId: { type: "string" },
      },
    },
  },
} as const;
