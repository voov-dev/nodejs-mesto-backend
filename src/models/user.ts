import { model, Schema } from 'mongoose';
import validator from 'validator';

import { DEFAULT_USER } from '../common/constants/defaultUser';
import { User } from '../common/types/User';

const userSchema = new Schema<User>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: DEFAULT_USER.name,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: DEFAULT_USER.about,
  },
  avatar: {
    type: String,
    default: DEFAULT_USER.avatar,
    validate: {
      validator: (value: string) =>
        validator.isURL(value, {
          protocols: ['http', 'https', 'ftp'],
          require_tld: true,
          require_protocol: true,
        }),
      message: 'Invalid URL',
    },
  },
});

export default model<User>('user', userSchema);
