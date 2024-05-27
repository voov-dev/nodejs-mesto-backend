import { model, Schema } from 'mongoose';
import validator from 'validator';

import { Card } from '../common/types/Card';

const cardSchema = new Schema<Card>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
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
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default model<Card>('card', cardSchema);
