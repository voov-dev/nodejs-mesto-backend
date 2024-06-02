import * as bcrypt from 'bcrypt';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import BadRequestError from '../common/BadRequestError';
import { SALT_ROUNDS } from '../common/constants/saltRounds';
import { HTTP_STATUS_CODE } from '../common/enums/httpStatusCode';
import User from '../models/user';

const {
  JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJleHAiOjE4NDM1Nzk0ODEsImlhdCI6MTcxNzM0OTA4MX0.XDHPxtgr_NX8qkaJp2f2-jFo_xY4uGpt0QiO9mIT-HM',
} = process.env;

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
    const { name, about, avatar, email, password } = req.body;

    const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const user = await User.create({
      name,
      about,
      avatar,
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
      return next(new BadRequestError('Пользователь с таким почтовым адресом уже существует'));

    if (error instanceof mongoose.Error.ValidationError)
      return next(new BadRequestError('Ошибка в данных пользователя'));

    return next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) return next(new BadRequestError('Неверный логин или пароль'));

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) throw new BadRequestError('Неверный логин или пароль');

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

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

export default {
  getUsers,
  getUserById,
  createUser,
  login,
};
