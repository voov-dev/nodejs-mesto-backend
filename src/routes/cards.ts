import { Router } from 'express';

import { createCard, deleteCardById, dislikeCard, getAllCards, likeCard } from '../controllers/cards';
import {
  createCardVerifyRequest,
  deleteCardVerifyRequest,
  dislikeCardVerifyRequest,
  likeCardVerifyRequest,
} from '../validators/cardsValidation';

const cardsRouter = Router();

cardsRouter.get('/', getAllCards);
cardsRouter.post('/', createCardVerifyRequest, createCard);
cardsRouter.delete('/:cardId', deleteCardVerifyRequest, deleteCardById);
cardsRouter.put('/:cardId/likes', likeCardVerifyRequest, likeCard);
cardsRouter.delete('/:cardId/likes', dislikeCardVerifyRequest, dislikeCard);

export default cardsRouter;
