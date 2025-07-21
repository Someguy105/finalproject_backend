export interface JwtPayload {
  sub: number; // user id
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  iat?: number;
  exp?: number;
}
