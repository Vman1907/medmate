import { type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
	// For now, we'll keep the middleware simple
	// You can add authentication checks here later if needed
	// Example: Check for auth-token cookie and validate JWT

	const pathname = request.nextUrl.pathname;

	// Allow API routes to pass through
	if (pathname.startsWith('/api/')) {
		return;
	}

	// Add any authentication logic here in the future
	// For example, protect certain routes that require authentication

	return;
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
