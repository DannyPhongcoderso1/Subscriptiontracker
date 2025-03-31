
import dayjs from "dayjs";
import {createRequire} from 'module';
const require = createRequire(import.meta.url);
const {serve} = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';
import {sendReminderEmail} from "../utils/send-email.js";
import {accountEmail} from "../config/nodemailer.js";
import {EMAIL_PASSWORDS} from "../config/env.js";

const REMINDERS = [7,5,2,1]

export const sendReminders = serve(async (context) => {
    const {subscriptionId} = context.requestPayload;
    const subscription = await fetchSubscription(context,subscriptionId);

    if (!subscription || subscription.status !== "active") return;

    const renewalDate = dayjs(subscription.renewalDate);

    if (renewalDate.isBefore(dayjs())) {
        console.log(`renewal date has passed for subscription ${subscriptionId}. Stopping workflow`);
        return;
    }

    for (const daysBefore of REMINDERS){
        const reminderDate = renewalDate.subtract(daysBefore,'day');
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context,  `Reminder ${daysBefore} days before`,reminderDate);

        }
        if (dayjs().isSame(reminderDate, 'day')) {
            await triggerReminder(context,  `${daysBefore} days before reminder`,subscription);
        }

    }

})

const fetchSubscription = async (context, subscriptionId) => {
    return await context.run('get subscription', async () => {
        return await Subscription.findById(subscriptionId).populate('user', 'name email');

    });
}

// const sleepUntilReminder = async (context, label, date) => {
//     console.log(`sleeping until ${label} reminder at ${date}`);
//     await context.sleep(label, date.toDate());
// }

const sleepUntilReminder = async (context, label, date) => {
    console.log(`sleeping until ${label} reminder at ${date}`);

    // Tính toán số mili giây từ thời điểm hiện tại đến thời điểm reminder
    const delayInMillis = date.diff(dayjs(), date.toDate());

    // Nếu thời gian trì hoãn là dương, thì tiếp tục sleep
    if (delayInMillis > 0) {
        await context.sleep(label, delayInMillis);
    } else {
        console.log(`${label} reminder time has already passed.`);
    }
}


const triggerReminder = async (context, label,subscription) => {
    return await context.run(label, async () => {
        console.log(`trigger ${label} reminder`);
        console.log("Sending email with data:", {
            to: subscription.user.email,  // Kiểm tra email
            type: label,                   // Kiểm tra loại nhắc nhở
            subscription: subscription      // Kiểm tra dữ liệu subscription
        });
        console.log("Email:", accountEmail);
        console.log("App Password:", EMAIL_PASSWORDS);


        await sendReminderEmail({
            to: subscription.user.email,
            type: label,
            subscription: subscription,
        });
    })
}