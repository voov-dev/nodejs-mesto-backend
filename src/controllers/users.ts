import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import BadRequestError from '../common/BadRequestError';
import { DEFAULT_USER } from '../common/constants/defaultUser';
import { HTTP_STATUS_CODE } from '../common/enums/httpStatusCode';
import { AuthenticatedRequest } from '../common/types/AuthenticatedRequest';
import User from '../models/user';

const { JWT_SECRET = '', SALT_ROUNDS = 12 } = process.env;

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find();

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(users);
  } catch (err) {
    return next(err);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) throw new BadRequestError('Пользователь не найден');

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(user);
  } catch (error: any) {
    if (error.name === 'CastError') throw new BadRequestError('Некорректный id');

    return next(error);
  }
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about, avatar, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name: name || DEFAULT_USER.name,
      about: about || DEFAULT_USER.about,
      avatar: avatar || DEFAULT_USER.avatar,
      email,
      password: hashPassword,
    });

    return res.status(HTTP_STATUS_CODE.CREATED).json({
      data: {
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
      },
    });
  } catch (error: any) {
    if (error.name === 'MongoError' && error.code === 11000)
      throw new BadRequestError('Такой Email уже зарегистрирован');

    if (error instanceof mongoose.Error.ValidationError) throw new BadRequestError('Ошибка в данных пользователя');

    return next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    const matched = user?.password ? await bcrypt.compare(password, user?.password) : undefined;

    if (!user || !matched) throw new BadRequestError('Неверный логин или пароль');

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d', algorithm: 'HS256' });

    res.cookie('jwt', token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, sameSite: true });

    return res.status(HTTP_STATUS_CODE.SUCCESS).send({
      token,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return next(error);
  }
};

export const getUserData = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;

  try {
    const currentUser = await User.findById(userId);

    if (!currentUser) throw new BadRequestError('Пользователь не найден');

    if (currentUser._id.toString() !== req.user?._id.toString()) throw new BadRequestError('Доступ запрещен');

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(currentUser);
  } catch (err: any) {
    if (err.name === 'CastError') throw new BadRequestError('Некорректные данные пользователя');

    return next(err);
  }
};

export const updateUserInfo = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { name, about } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name: name || DEFAULT_USER.name, about: about || DEFAULT_USER.about },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) throw new BadRequestError('Пользователь не найден');

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(updatedUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') throw new BadRequestError('Некорректные данные пользователя');

    return next(err);
  }
};

export const updateUserAvatar = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = req.user?._id;
  const { avatar } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { avatar },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!updatedUser) throw new BadRequestError('Пользователь не найден');

    return res.status(HTTP_STATUS_CODE.SUCCESS).send(updatedUser);
  } catch (err: any) {
    if (err.name === 'ValidationError') throw new BadRequestError('Некорректные данные пользователя');

    return next(err);
  }
};
