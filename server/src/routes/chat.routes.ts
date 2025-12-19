import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';

const router = Router();
const chatController = new ChatController();

router.post('/message', async (req, res) => {
    try {
        const result = await chatController.sendMessage(req);
        res.json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
    }
});

router.get('/history/:sessionId', async (req, res) => {
    try {
        const result = await chatController.getHistory(req);
        res.json(result);
    } catch (error: any) {
        res.status(error.status || 500).json({ error: error.message || 'Internal Server Error' });
    }
});

export default router;
