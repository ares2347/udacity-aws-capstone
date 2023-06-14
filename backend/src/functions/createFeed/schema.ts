export default {
  type: "object",
  properties: {
    caption: { type: 'string', minLength: 5, maxLength: 255 },
    name: {type: "string"},
    picture: {type: "string"}
  },
  required:["caption", "name"]
} as const;
