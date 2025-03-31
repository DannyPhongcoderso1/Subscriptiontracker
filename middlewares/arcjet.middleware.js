import aj from  "../config/arcjet.js"


const arcjetMiddleware = async (req, res, next) => {
    try{
        const decision = await aj.protect(req, {requested: 1});

        if(decision.isDenied()){
            console.log("Denied");
            if(decision.reason.isRateLimit())return res.status(429).json({error:"Rate Limit exceeded"});
            if(decision.reason.isBot()) return res.status(403).json({error:'Bot detected'});

            res.status(403).json({error:"access denied"});
        }

        next();
    }catch(error){
        console.log(`arcject Middleware Error: ${error}`);
        next(error);
    }
}

export default arcjetMiddleware;