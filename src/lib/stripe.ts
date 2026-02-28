import Stripe from 'stripe';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_for_build';

if (!process.env.STRIPE_SECRET_KEY && process.env.NODE_ENV === 'production') {
    console.warn('STRIPE_SECRET_KEY is not defined. Using dummy key for build-time evaluation.');
}

export const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-02-24' as Stripe.LatestApiVersion,
    appInfo: {
        name: 'LSFCONNECT',
        version: '0.1.0',
    },
});

/**
 * Creates a Stripe Connect account for a LSF Expert.
 */
export async function createExpertConnectAccount(email: string, fullName: string) {
    return await stripe.accounts.create({
        type: 'express',
        email,
        capabilities: {
            card_payments: { requested: true },
            transfers: { requested: true },
        },
        business_type: 'individual',
        individual: {
            first_name: fullName.split(' ')[0],
            last_name: fullName.split(' ').slice(1).join(' '),
        },
    });
}

/**
 * Creates a Payment Intent for a booking.
 * Funds are held and transferred to the expert upon completion.
 */
export async function createBookingPaymentIntent(amount: number, expertStripeId: string) {
    return await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // convert to cents
        currency: 'eur',
        payment_method_types: ['card'],
        application_fee_amount: 250, // 2.50€ service fee
        transfer_data: {
            destination: expertStripeId,
        },
    });
}
/**
 * Creates a Stripe Checkout Session for a subscription.
 */
export async function createSubscriptionCheckoutSession(userId: string, email: string, priceId: string) {
    return await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price: priceId,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        customer_email: email,
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/user?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
        metadata: {
            userId,
        },
    });
}
