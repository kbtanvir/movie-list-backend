export interface JwtPayload {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  type: string;
  exp: number;
  iat: number;
}
