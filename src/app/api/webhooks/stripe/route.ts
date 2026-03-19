import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    const payload = await req.text();
    const sig = req.headers.get('stripe-signature');

    if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
        return NextResponse.json({ error: 'Missing Stripe webhook configuration' }, { status: 400 });
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            payload,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err: any) {
        console.error('Webhook Error:', err.message);
        return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const bookingId = session.metadata?.booking_id;

        if (bookingId) {
            const supabase = await createClient();
            
            const { error } = await supabase
                .from('bookings')
                .update({ 
                    status: 'confirmed', 
                    payment_status: 'paid' 
                })
                .eq('id', bookingId);
                
            if (error) {
                console.error("Error updating booking status:", error.message);
                return NextResponse.json({ error: "Failed to update booking" }, { status: 500 });
            }
        }
    }

    return NextResponse.json({ received: true });
}
