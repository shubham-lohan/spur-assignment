import axios from 'axios';
import type { Message, ChatResponse } from './types';

const API_URL = 'http://localhost:3001/chat';



export const sendMessage = async (message: string, sessionId?: string): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(`${API_URL}/message`, {
    message,
    sessionId,
  });
  return response.data;
};

export const getHistory = async (sessionId: string): Promise<{ messages: Message[] }> => {
  const response = await axios.get<{ messages: Message[] }>(`${API_URL}/history/${sessionId}`);
  return response.data;
};