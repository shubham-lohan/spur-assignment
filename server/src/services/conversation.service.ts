import prisma from '../lib/prisma';

export const ensureConversation = async (sessionId?: string): Promise<string> => {
    if (sessionId) {
        const exists = await prisma.conversation.findUnique({ where: { id: sessionId } });
        if (exists) {
            return sessionId;
        }
    }
    
    const newConversation = await prisma.conversation.create({});
    return newConversation.id;
};