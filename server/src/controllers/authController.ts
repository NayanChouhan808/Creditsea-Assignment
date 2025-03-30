import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: any, res: any) => {
  const { email, username, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with that email or username' 
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.USER
      }
    });

    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const login = async (req: any, res: any) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      id: user.id,
      role: user.role
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};