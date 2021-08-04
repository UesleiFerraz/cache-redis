export interface HttpResponse {
  statusCode: number;
  body: any;
}

export interface HttpRequest {
  params: any;
  body: any;
  userUid?: string;
}

export interface HttpMiddleware {
  headers: any;
  body: any;
  userUid?: string;
}
