"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    created_at: string;
    is_read: boolean;
}

export function useChat(recipientId: string) {
    const supabase = createClient();
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

    const fetchMessages = useCallback(async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);

        if (user) {
            const { data } = await supabase
                .from("messages")
                .select("*")
                .or(`and(sender_id.eq.${user.id},receiver_id.eq.${recipientId}),and(sender_id.eq.${recipientId},receiver_id.eq.${user.id})`)
                .order("created_at", { ascending: true });

            if (data) setMessages(data);
            setLoading(false);
        }
    }, [recipientId, supabase]);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages();

        const channel = supabase
            .channel(`chat:${recipientId}`)
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "messages",
                },
                (payload) => {
                    const msg = payload.new as Message;
                    // Only add if it belongs to this conversation
                    if (
                        (msg.sender_id === currentUser?.id && msg.receiver_id === recipientId) ||
                        (msg.sender_id === recipientId && msg.receiver_id === currentUser?.id)
                    ) {
                        setMessages((prev) => {
                            // Avoid duplicates if we already added it (e.g. optimistic update)
                            if (prev.find(m => m.id === msg.id)) return prev;
                            return [...prev, msg];
                        });
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [recipientId, currentUser, fetchMessages, supabase]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || !currentUser) return null;

        const { data, error } = await supabase
            .from("messages")
            .insert({
                sender_id: currentUser.id,
                receiver_id: recipientId,
                content: content.trim(),
            })
            .select()
            .single();

        if (data) {
            setMessages((prev) => [...prev, data]);
            return data;
        }
        return null;
    };

    return {
        messages,
        loading,
        sendMessage,
        currentUser,
    };
}
