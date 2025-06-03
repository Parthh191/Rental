import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Protected routes that require authentication
const protectedRoutes = [
  '/profile',
  '/dashboard',
  '/rentals',
  '/my-items',
  '/create-listing',
];

// Routes that should be inaccessible when logged in
const authRoutes = [
  '/login',
  '/signup',
];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if the user is authenticated
  const session = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  const isAuthenticated = !!session;
  
  // Redirect authenticated users away from auth pages (login/signup)
  if (isAuthenticated && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Redirect unauthenticated users to login page for protected routes
  if (!isAuthenticated && protectedRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}