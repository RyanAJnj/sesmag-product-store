import arcjet, { tokenBucket, shield, detectBot} from "@arcjet/node";

import "dotenv/config";
// Removed unused import

//init arcjet

export const aj = arcjet({
    key: process.env.ARCJET_KEY,
    characteristics: ["ip.src"],
    rules : [
        //protect app
        shield({mode:"LIVE"}),
        detectBot({
            mode:"LIVE",
            //block all bots
            allow:[
                "CATEGORY:SEARCH_ENGINE",
            ]
        }),
        //rate limiting

    tokenBucket({
        mode:"LIVE",
        refillRate: 5,
        interval:10,
        rate: 10,
        capacity: 20,
        burst: 20,
        //time unit is in seconds
        timeUnit: 60,
        //block all requests over the limit
        block:true,
        //log all requests over the limit
        log:true,
    }),
    ]
});