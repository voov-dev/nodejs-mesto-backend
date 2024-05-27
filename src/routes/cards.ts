import { Router } from 'express';

import controller from '../controllers/cards';

const cardRouter = Router();

cardRouter.post('/', controller.createCard);
cardRouter.get('/', controller.getAllCards);
cardRouter.delete('/:cardId', controller.deleteCardById);

export default cardRouter;
