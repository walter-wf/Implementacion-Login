import {Router} from 'express'
import { UserManager } from '../../dao/db/controllers/user.controllers.js';

const usersRouter = Router();
const userManager = new UserManager()