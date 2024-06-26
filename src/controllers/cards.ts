import { NextFunction, Request, Response } from 'express';
import { Error, ObjectId } from 'mongoose';

import BadRequestError from '../common/BadRequestError';
import { HTTP_STATUS_CODE } from '../common/enums/httpStatusCode';
import { AuthenticatedRequest } from '../common/types/AuthenticatedRequest';
import Card from '../models/card';

export const getAllCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);

    return res.send({ data: cards });
  } catch (error) {
    return next(error);
  }
};

export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const owner = req.params.cardId;
    const card = await Card.create({ name, link, owner });

    return res.status(HTTP_STATUS_CODE.SUCCESS).json({ data: card });
  } catch (error) {
    if (error instanceof Error.ValidationError) throw new BadRequestError('Ошибка при вводе данных');

    return next(error);
  }
};

export const deleteCardById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).orFail();

    if (!card) throw new BadRequestError('Не существует карточки с указанным id');

    if (String(card.owner) !== req.user?._id) throw new BadRequestError('Нельзя удалять чужие карточки');

    const deleteCard = await card.deleteOne();

    return res.status(HTTP_STATUS_CODE.NOT_FOUND).json({ data: deleteCard });
  } catch (error) {
    if (error instanceof Error.DocumentNotFoundError) throw new BadRequestError('Карточка другого пользователя');

    if (error instanceof Error.CastError) throw new BadRequestError('Не верный ID пользователя');

    return next(error);
  }
};

export const likeCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const owner = req.user?._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $addToSet: { likes: owner },
      },
      { new: true },
    );

    if (!updatedCard) throw new BadRequestError('Карточка не найдена');

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(updatedCard);
  } catch (err: any) {
    if (err.name === 'CastError') throw new BadRequestError('Некорректные данные');

    return next(err);
  }
};

export const dislikeCard = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const owner = req.user?._id;

  try {
    const updatedCard = await Card.findByIdAndUpdate(
      cardId,
      {
        $pull: { likes: owner as unknown as ObjectId },
      },
      { new: true },
    );

    if (!updatedCard) throw new BadRequestError('Карточка не найдена');

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(updatedCard);
  } catch (err: any) {
    if (err.name === 'ValidationError') throw new BadRequestError('Некорректные данные');

    return next(err);
  }
};
