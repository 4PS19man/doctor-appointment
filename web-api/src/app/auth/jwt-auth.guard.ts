import { JwtService } from '@nestjs/jwt';

const jwtService = new JwtService({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '1h' },
});

export function signToken(payload: any): string {
  return jwtService.sign(payload);
}

export function verifyToken(token: string): any {
  return jwtService.verify(token);
}