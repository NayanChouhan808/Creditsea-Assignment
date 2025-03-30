import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
      };
    }
  }
}

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      role: Role;
    };

    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export const authorize = (roles: Role[]) => {
  return (req: any, res: any, next: any) => {
    if (!req.user) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${roles.join(' or ')}`
      });
    }

    next();
  };
};