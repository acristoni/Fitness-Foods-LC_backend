import { registerAs } from '@nestjs/config';

export default registerAs('mongoose', () => ({
  uri: process.env.MONGO_URI, // Use a variável de ambiente MONGO_URI
}));
