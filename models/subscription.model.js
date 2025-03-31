import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'subscription name is required'],
            trim: true,
            minlength: 2,
            maxlength: 100
                },
        price:{
            type: Number,
            required: [true, 'subscription price is required'],
            min: [0, 'price must be greater than 0']
        },
        currency: {
            type: String,
            enum: ['EUR', 'USD', 'GBP'],
            default: 'USD'
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly']
        },
        category: {
            type: String,
            enum: ['sport', 'news', 'entertainment', 'lifestyle', 'technology', 'finance', 'others'],
            required: true
        },
        paymentMethod: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ['active', 'cancelled', 'expired'],
            default: 'active'
        },
        startDate: {
            type: Date,
            required: true,
            validate: {
                validator: (val) => val <= new Date(),
                message: 'Start date must be in the past'
            }
        },
        renewalDate: {
            type: Date,
            required: false,
            validate: {
                validator: function(val)  {
                    return val > this.startDate;
                },
                message: 'Renewal date must be after start date'
            }
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        }
    }, {timestamps: true});
// auto_calculate renewal date if missing
    subscriptionSchema.pre('save', function (next) {
    if(!this.renewalDate){
        const renewalPeriods= {
            daily: 1,
            weekly: 7,
            monthly: 30,
            yearly: 365,
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renewalPeriods[this.frequency]);
    }
    //auto-update to status if renewal date has passed
    if(this.renewalDate < new Date()){
        this.status = 'expired';
    }

    next();
})

const subscription = mongoose.model('Subscription', subscriptionSchema);
export default subscription;


