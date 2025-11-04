import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import auth from '../../backend/src/lib/auth.js';

dotenv.config();

export default toNodeHandler(auth);
