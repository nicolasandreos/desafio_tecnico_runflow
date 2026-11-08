export function generateConversationTitle(message: string): string {
  return message.length > 35 ? `${message.slice(0, 35)}...` : message;
}
