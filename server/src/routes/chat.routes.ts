import { Router } from 'express';
import { validateUser } from '../middlewares/user.middlewares';
import * as chatController from '../controllers/chat.controller';

const router = Router();

router.post('/', validateUser, chatController.createOrGetChat);
router.get('/', validateUser, chatController.getUserChatsController);
router.post('/:chatId/messages', validateUser, chatController.sendMessage);
router.get('/:chatId/messages', validateUser, chatController.getMessages);

export default router; 