import {Router} from 'express';
import {signUp, signIn, signOut} from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post('/Signup', signUp);
authRouter.post('/Signin', signIn);
authRouter.post('/signout', signOut);

export  default authRouter;
