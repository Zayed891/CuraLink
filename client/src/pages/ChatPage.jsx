import React from 'react';
import ChatThread from '../components/chat/ChatThread';
import ChatInput from '../components/chat/ChatInput';
import useChatStore from '../store/chatStore';

export default function ChatPage() {
  const { messages, isLoading, sendMessage, activeSessionId } = useChatStore();

  if (!activeSessionId) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-[var(--color-text-muted)] text-sm">Please select or create a session to begin.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[var(--color-bg)] relative">
      <ChatThread messages={messages} isLoading={isLoading} />
      <div className="mt-auto shrink-0 z-10 relative bg-[var(--color-bg)]">
        <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
      </div>
    </div>
  );
}
