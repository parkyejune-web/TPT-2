export interface ApiResponseMeta {
  pagination?: {
    page: number;
    pageSize: number;
    totalCount: number;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  meta?: ApiResponseMeta;
}
