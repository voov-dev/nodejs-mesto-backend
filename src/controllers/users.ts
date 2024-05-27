import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import BadRequestError from '../common/BadRequestError';
import { HTTP_STATUS_CODE } from '../common/enums/httpStatusCode';

const User = require('../models/userSchema');

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();

    res.status(HTTP_STATUS_CODE.SUCCESS).json(users);
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) throw new BadRequestError('Пользователь не найден');

    return res.status(HTTP_STATUS_CODE.SUCCESS).json(user);
  } catch (error: any) {
    if (error.name === 'CastError') return next(new BadRequestError('Некорректный id'));

    return next(error);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar } = req.body;

    const user = await User.create({
      name,
      about,
      avatar,
    });

    return res.status(HTTP_STATUS_CODE.SUCCESS).json({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
      },
    });
  } catch (error: any) {
    if (error.name === 'MongoError' && error.code === 11000)
      return next(new BadRequestError('Пользователь с таким почтовым адресом уже существуе'));

    if (error instanceof mongoose.Error.ValidationError)
      return next(new BadRequestError('Ошибка в данных пользователя'));

    return next(error);
  }
};

export default {
  getUsers,
  getUserById,
  createUser,
};
