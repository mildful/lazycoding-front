export interface ServerError {
  code: string;
  message: string;
  data: {
    status: number;
    params: { [param: string]: string }
  };
}
