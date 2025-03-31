import Subscription from "../models/subscription.model.js";
import {workflowClient} from "../config/uptash.js";
import {SERVER_URL} from "../config/env.js";

export const createSubscription = async (req, res, next) => {
    try{
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id});

        const response = await workflowClient.trigger({
            url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
            body: {
                subscriptionId: subscription.id,
            },
            headers: {
                'Content-Type': 'application/json',
            },
            workflowRunId: res.workflowRunId,
            retries: 0
        });


        res.status(201).json({success: true, data: subscription,workflowRunId: response.workflowRunId });
    }catch(error){
        next(error);
    }
}

export const getSubscription = async (req, res, next) => {
    try{
        if(req.user.id !== req.params.id){
            const error = new Error('you are not the owner of this account')
            error.statusCode = 401;
            throw error;
        }

        const subscriptions  = await Subscription.find({user: req.params.id});

        res.status(200).json({success: true, data: subscriptions});
    }catch(error){
        next(error);
    }
}

export const updateSubscription = async (req, res, next) => {}
export const deleteSubscription = async (req, res, next) => {}
// lam cho tat ca cac route con lai