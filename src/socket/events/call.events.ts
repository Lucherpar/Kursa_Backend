export const callEvents = {
  OFFER: "call-offer",
  ANSWER: "call-answer",
  ICE_CANDIDATE: "call-ice-candidate",
  END_CALL: "call-end",
} as const;

export const chatEvents = {
  SEND_MESSAGE: "chat-message",
  RECEIVE_MESSAGE: "chat-message",
  USER_TYPING: "user-typing",
} as const;
