import * as dotenv from 'dotenv';
dotenv.config();
export const CONSTANTS = {
  secret: process.env.JWT_SECRET, // JWT-SECRET TOKEN
};
