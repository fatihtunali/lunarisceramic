import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { query } from './db';
import { AdminUser } from '@/types';

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: AdminUser): string {
  return jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token: string): { id: number; username: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: number; username: string; role: string };
  } catch {
    return null;
  }
}

export async function getSession(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth-token')?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const users = await query<AdminUser[]>(
    'SELECT id, username, name, role, last_login FROM admin_users WHERE id = ?',
    [payload.id]
  );

  return users[0] || null;
}

export async function createAdminUser(username: string, password: string, name: string, role: 'admin' | 'editor' = 'editor') {
  const passwordHash = await hashPassword(password);
  await query(
    'INSERT INTO admin_users (username, password_hash, name, role) VALUES (?, ?, ?, ?)',
    [username, passwordHash, name, role]
  );
}
