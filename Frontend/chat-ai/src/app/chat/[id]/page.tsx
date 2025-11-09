"use client";
import ChatApp from "@/components/admin/chat-template";
import { useParams } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const { id } = params;

  return (
    <div className="h-screen">
      <ChatApp characterId={id as string} />
    </div>
  );
}
