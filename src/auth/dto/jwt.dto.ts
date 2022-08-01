export interface JwtPayload {
  id: string;
  email: string;
  type: string;
  exp: number;
  iat: number;
}
