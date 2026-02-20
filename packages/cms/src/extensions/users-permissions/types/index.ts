import { JwtPayload } from 'jwt-decode';

export interface IJwtToken extends JwtPayload {
  session_id: string;
  id: number;
}
