export default {
  type: "object",
  properties: {
    caption: { type: 'string', minLength: 5, maxLength: 255 },
    pathParameters: {
      type: "object",
      properties: {
        feedId: { type: "string" },
      },
    },
  },
  required:["caption"]
} as const;
