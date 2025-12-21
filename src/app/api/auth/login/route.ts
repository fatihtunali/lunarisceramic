import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { verifyPassword, generateToken } from '@/lib/auth';
import { cookies } from 'next/headers';

interface AdminUserWithPassword {
  id: number;
  username: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'editor';
  last_login: string | null;
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const users = await query<AdminUserWithPassword[]>(
      'SELECT * FROM admin_users WHERE username = ?',
      [username]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = users[0];
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login
    await query('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

    const token = generateToken({
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role,
      last_login: user.last_login
    });

    const cookieStore = await cookies();
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
