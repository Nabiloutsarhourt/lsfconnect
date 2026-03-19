import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { expertId, expertName, amount, scheduledAt, serviceType } = await req.json();

        // 1. Create a pending booking in Supabase
        const { data: booking, error: bookingError } = await supabase
            .from('bookings')
            .insert({
                client_id: user.id,
                expert_id: expertId,
                scheduled_at: scheduledAt,
                duration_minutes: 60,
                type: serviceType || 'video',
                status: 'pending',
                price: amount,
                payment_status: 'pending'
            })
            .select()
            .single();

        if (bookingError) throw new Error(bookingError.message);

        // 2. Create Stripe Checkout Session
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Session avec ${expertName} (${serviceType === 'video' ? 'Visio' : 'Sur place'})`,
                            description: `Date: ${new Date(scheduledAt).toLocaleString('fr-FR')}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/booking/success?amount=${amount}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/experts/${expertId}`,
            metadata: {
                booking_id: booking.id,
                client_id: user.id,
                expert_id: expertId,
            },
        });

        // 3. Update booking with Stripe Session ID
        await supabase.from('bookings').update({ stripe_payment_intent_id: session.id }).eq('id', booking.id);

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Checkout Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
