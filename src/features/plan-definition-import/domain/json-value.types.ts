export type JsonValue =
  null | string | number | boolean | JsonValue[] | { [key: string]: JsonValue };
export type JsonObject = { [key: string]: JsonValue };
