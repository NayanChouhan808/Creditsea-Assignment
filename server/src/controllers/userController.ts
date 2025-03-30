import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { Role } from '@prisma/client';

const prisma = new PrismaClient();

export const getUsers = async (req: any, res: any) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const toastUser = async (req: any, res: any) => {
  try {
    const user = await prisma.user.count({
      where: {
        role: Role.USER
      }
    })
    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createAdmin = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newAdmin = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.ADMIN
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(newAdmin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const createVerifier = async (req: any, res: any) => {
  const { email, password } = req.body;

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        email
      }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newVerifier = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: Role.VERIFIER
      },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json(newVerifier);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteUser = async (req: any, res: any) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (id === req.user?.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    await prisma.user.delete({ where: { id } });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};