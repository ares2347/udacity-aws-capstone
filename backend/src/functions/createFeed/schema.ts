export default {
  type: "object",
  properties: {
    caption: { type: 'string', minLength: 5, maxLength: 255 }
  },
  required:["caption"]
} as const;
