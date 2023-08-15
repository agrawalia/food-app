// This is your test secret API key.
const stripe = require('stripe')('sk_test_51NfL54SHKJVI2RbvyEuE30BOCGZJcMx0PxCA3K4KOuQqnQi6n0R4ooSeYjQq6ocZFhaSmNmi8TdlRnFhoX8s1zej00mP9zp4gf');
const planModel = require("../models/planModel");
const userModel = require("../models/userModel");

module.exports.createSession = async function createSession(){

    try{
        let userId = req.id;
        let planId = req.params.id;

        const user = userModel.findById(userId);
        const plan = planModel.findById(planId);

        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            customer_email:user.email,
            client_refernce:plan.id,
            line_items:[
                {
                    name:plan.name,
                    description:plan.description,
                    amount:plan.price * 100,
                    currency: "inr",
                    quantity: 1
                }
            ],
            success_url:`${req.protocol}://${req.get("host")}/profile`,
            cancel_url:`${req.protocol}://${req.get("host")}/profile`
        })
        res.status(200).json({
            status: 'success',
            session
        })
    }
    catch(error){
        res.status(200).json({
            err: error.message
        })
    }
}
