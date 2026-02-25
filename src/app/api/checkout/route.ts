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

        const { expertId, expertName, amount, scheduledAt } = await req.json();

        // In a real app, we would fetch the expert's Stripe account ID from the database
        // For this demo, we'll assume they have one or use a placeholder
        const expertStripeAccountId = 'acct_placeholder';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: `Session LSF avec ${expertName}`,
                            description: `Date: ${new Date(scheduledAt).toLocaleString()}`,
                        },
                        unit_amount: Math.round(amount * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/booking/success?expert_id=${expertId}&amount=${amount}`,
            cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/experts/${expertId}`,
            metadata: {
                client_id: user.id,
                expert_id: expertId,
                scheduled_at: scheduledAt,
            },
        });

        return NextResponse.json({ sessionId: session.id, url: session.url });
    } catch (err: any) {
        console.error('Stripe Error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
