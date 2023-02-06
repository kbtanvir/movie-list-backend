import { Types } from "mongoose";

export interface JwtPayload {
  id: Types.ObjectId;
  type: string;
  exp: number;
  iat: number;
}
