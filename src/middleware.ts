import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key',
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    try {
        const { data: { user } } = await supabase.auth.getUser()

        // Protect Admin Dashboard
        if (request.nextUrl.pathname.startsWith('/dashboard/admin')) {
            if (!user) {
                return NextResponse.redirect(new URL('/login', request.url))
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile?.role !== 'admin') {
                return NextResponse.redirect(new URL('/dashboard/user', request.url))
            }
        }

        // Protect User Dashboard
        if (request.nextUrl.pathname.startsWith('/dashboard/user')) {
            if (!user) {
                return NextResponse.redirect(new URL('/login', request.url))
            }
        }
    } catch (e) {
        console.warn('Middleware auth check skipped due to environment or connection issue:', e);
    }

    return response
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/api/checkout/:path*',
        '/api/webhooks/:path*' // Ensure webhooks are bypassed if needed, but here we just check auth
    ],
}
