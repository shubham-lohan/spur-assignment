import { Request, Response } from 'express';
import prisma from '../lib/prisma';
import { generateReply } from '../services/llm.service';
import { Sender } from '@prisma/client';
import { IChatController } from './interfaces/IChatController';

export class ChatController implements IChatController {

    public sendMessage = async (req: Request): Promise<any> => {
        try {
            const { message, sessionId } = req.body;

            if (!message || typeof message !== 'string' || !message.trim()) {
                throw { status: 400, message: 'Message is required' };
            }

            let conversationId = sessionId;
            if (!conversationId) {
                const newConversation = await prisma.conversation.create({});
                conversationId = newConversation.id;
            } else {
                const exists = await prisma.conversation.findUnique({ where: { id: conversationId } });
                if (!exists) {
                    const newConversation = await prisma.conversation.create({});
                    conversationId = newConversation.id;
                }
            }

            await prisma.message.create({
                data: {
                    text: message,
                    sender: Sender.USER,
                    conversationId,
                },
            });

            const history = await prisma.message.findMany({
                where: { conversationId },
                orderBy: { createdAt: 'desc' },
                take: 10,
            });
            const chronologicalHistory = history.reverse();

            const contextMessages = chronologicalHistory.slice(0, -1);

            const replyText = await generateReply(contextMessages, message);
            console.log(replyText);
            await prisma.message.create({
                data: {
                    text: replyText,
                    sender: Sender.AI,
                    conversationId,
                },
            });

            return {
                reply: replyText,
                sessionId: conversationId,
            };
        } catch (error: any) {
            console.error('Chat Controller Error:', error);
            if (error?.status === 429 || error?.message?.includes('429')) {
                throw { status: 429, message: 'OpenAI API Quota Exceeded. Please check your billing details.' };
            } else if (error.status) {
                throw error;
            } else {
                throw { status: 500, message: 'Internal Server Error' };
            }
        }
    }

    public getHistory = async (req: Request): Promise<any> => {
        try {
            const { sessionId } = req.params;
            if (!sessionId) {
                throw { status: 400, message: 'Session ID required' };
            }

            const messages = await prisma.message.findMany({
                where: { conversationId: sessionId },
                orderBy: { createdAt: 'asc' },
            });

            return { messages };
        } catch (error: any) {
            console.error('Get History Error:', error);
            if (error.status) {
                throw error;
            }
            throw { status: 500, message: 'Internal Server Error' };
        }
    }
}

