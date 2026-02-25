import { createClient } from "@/lib/supabase/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import type Stripe from "stripe";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || 'whsec_dummy_for_build';

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const supabase = await createClient();
    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(
            session.subscription as string
        );

        if (!session?.metadata?.supabaseUUID) {
            return new NextResponse("User ID is required", { status: 400 });
        }

        const { error } = await supabase.from("subscriptions").upsert({
            user_id: session.metadata.supabaseUUID,
            stripe_subscription_id: subscription.id,
            stripe_customer_id: (subscription as any).customer as string,
            status: (subscription as any).status,
            plan_id: (subscription as any).items.data[0].price.id,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: (subscription as any).cancel_at_period_end,
        });

        if (error) {
            console.error("Supabase error during checkout completion:", error);
            return new NextResponse("Database error", { status: 500 });
        }

        // Update profile tier
        await supabase.from("profiles").update({ subscription_tier: "pro" }).eq("id", session.metadata.supabaseUUID);
    }

    if (event.type === "customer.subscription.updated") {
        const subscription = event.data.object as Stripe.Subscription;

        await supabase.from("subscriptions").update({
            status: subscription.status,
            plan_id: subscription.items.data[0].price.id,
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end,
        }).eq("stripe_subscription_id", subscription.id);

        if (subscription.status === "active") {
            const { data: subData } = await supabase.from("subscriptions").select("user_id").eq("stripe_subscription_id", subscription.id).maybeSingle();
            if (subData) {
                await supabase.from("profiles").update({ subscription_tier: "pro" }).eq("id", subData.user_id);
            }
        }
    }

    if (event.type === "customer.subscription.deleted") {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: subData } = await supabase.from("subscriptions").select("user_id").eq("stripe_subscription_id", subscription.id).maybeSingle();

        await supabase.from("subscriptions").update({
            status: "canceled",
        }).eq("stripe_subscription_id", subscription.id);

        if (subData) {
            await supabase.from("profiles").update({ subscription_tier: "free" }).eq("id", subData.user_id);
        }
    }

    return new NextResponse(null, { status: 200 });
}
