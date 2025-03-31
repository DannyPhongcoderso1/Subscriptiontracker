import {Router} from 'express';
import authorize from '../middlewares/auth.middleware.js';
import {createSubscription, getSubscription} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.get('/',(req, res) => res.send({title: 'GET all subscriptions'}));

subscriptionRouter.get('/:id',(req, res) => res.send({title: 'GET subscription details'}));

subscriptionRouter.post('/',authorize, createSubscription);

subscriptionRouter.put('/',(req, res) => res.send({title: 'UPDATE subscription'}));

subscriptionRouter.delete('/',(req, res) => res.send({title: 'DELETE subscription'}));

subscriptionRouter.get('/user/:id',authorize, getSubscription);

subscriptionRouter.put('/:id/cancle',(req, res) => res.send({title: 'CANCEL subscription'}));

subscriptionRouter.get('/upcoming-renewals',(req, res) => res.send({title: 'GET upcoming subscription'}));

export default subscriptionRouter;