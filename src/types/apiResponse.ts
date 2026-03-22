export interface ApiResponse {
  type?: "success" | "error";
  message?: string;
  fields?: Record<PropertyKey, PropertyValue>;
}

export interface PropertyValue {
  value?: string;
  error?: string;
}
