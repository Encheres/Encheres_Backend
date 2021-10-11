var express = require('express');
const mongoose = require('mongoose');
const User = require("../models/user");
var router = express.Router();
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const {sendPasswordResetEmail} = require('../middleware/emails');

/*-----------------------------------------------------*/
/* AUTHENTICATION RELATED */
/*-----------------------------------------------------*/

// Add a new user/ Signup
router.post("/signup", async function(req, res, next) {
	const user = new User(req.body);
	try {
		await user.save();
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// Login
router.post('/login',async(req,res)=>{
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password);
        const token = await user.generateAuthToken()//Generate jwt authentication token
        res.send({user,token})
    }
    catch(e){

        res.status(400).send('Details Mismatched');                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
    }
})

//Logout
router.post('/logout',auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token!== req.token
        })
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(500).send(e);
    }
});



/*-----------------------------------------------------*/
/* USER PROFILE UPDATIONS */
/*-----------------------------------------------------*/

// update address
router.patch('/me/address', auth, async(req,res)=>{
    let address = req.body;
    const updates = Object.keys({...address});
    const allowedUpdates = ['addressLine1','addressLine2', 'city','state', 'postalCode', 'country'];
    const isValidOperation = updates.every((update)=>{
        return(allowedUpdates.includes(update))
    });
    if(!isValidOperation){
        return res.status(400).send({error:"Invalid updates!"})
    }
    try{
        const user = req.user;
        updates.forEach((update) => user.address[0][update]= address[update] );
        await user.save();
        res.send({message:"Your details have been upated successfully"});
    }
    catch(e){
        res.status(400).send(e);
    }
});

// update profile
router.patch('/me/profile', auth, async(req,res)=>{
	let profile = req.body;
	const updates = Object.keys({...profile});
	const allowedUpdates = ['name','anonymous_name','email', 'password', 'image'];
	const isValidOperation = updates.every((update)=>{
		return(allowedUpdates.includes(update))
	});
	if(!isValidOperation){
		return res.status(400).send({error:"Invalid updates!"})
	}
	try{
		const user = req.user;
        updates.forEach((update) => user[update]= profile[update] );
        await user.save();
        res.send({message:"Your details have been upated successfully"});
	}catch(e){
		res.status(400).send(e);
	}
});



//Forgot Password
router.post('/forgot_password', async(req, res)=>{
    try{
        const email = req.body.email;
        const user = await User.findOne({email: email})
        if(!user){
            res.status(401).send({message:"No user with this email id exists. Please check your email and try again."})
            return
        }
        
        const secret = process.env.JWT_SECRET_TOKEN_ENCRYPTION_KEY + user.password
        const payload = {email: user.email, id: user._id}
        const token = jwt.sign(payload, secret, {expiresIn:'15m'})
        const link = `${process.env.FRONTEND_URL}/reset_password/${user.id}/${token}`
        sendPasswordResetEmail(user.email, user.name, link);
        res.send({message:"Password reset link has been sent on your email id. It's valid for 15 minutes only."})

    }
    catch(e){
        console.log(e);
        res.send({message:"Something went wrong"})

    }
});

// reset password -> after email verification
router.post('/reset_password', async(req, res)=>{
    const {userId, token, password} = req.body;
    try{
        const user = await User.findById(userId);
        const secret = process.env.JWT_SECRET_TOKEN_ENCRYPTION_KEY + user.password;
        const payload = jwt.verify(token, secret);
        user.password = password;
        await user.save();
        res.status(200).send({message:"Your password has been reset successfully"});
    }
    catch(e){
        let error;
        if(e.name==="TokenExpiredError"){
            error = "Your password reset link has expired. Generate a new link to continue."
        }else{
            error="Invalid password reset link. Try generating a new one."
        }
        res.status(401).send(error)
    }
})


/*-----------------------------------------------------*/
/* ACCESS USER DETAILS */
/*-----------------------------------------------------*/

// Get User Profile
router.get("/profile/:id", async function(req, res, next) {
	try{	
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user)
            throw new Error("User not found");
		// TO DO - Remove unnecessary fields
        res.send(user);
    }catch(e){
        res.status(404).send(e);
    }
});

router.get("/bookmarks", auth, async function(req, res, next){
	const queries = req.query, userId = req.user._id;
    let {Limit, Skip} = queries;
    Limit = parseInt(Limit);
    Skip = parseInt(Skip);
    try{
		// const userId = req.user;
        await User.findById(userId).populate({path:"bookmarked_auctions.auction_id",
    model:'Auction'}).exec((err, data)=>{
            if(err){
                throw new Error(err);
            }
            res.send(data.bookmarked_auctions);
        });; 
	}catch(e){
        console.log(e);
		res.status(404).send(e);
	}

});


/*-----------------------------------------------------*/
/* AUCTION BOOKMARKS */
/*-----------------------------------------------------*/

// Add/ Remove bookmark
router.patch("/bookmarks", auth, async function(req, res, next){
	try{
    const {AuctionId, req_type} = req.body; // req_type = 1 for add, 0 for remove

    let user_bookmarked_auctions = req.user.bookmarked_auctions;
    // console.log(user_bookmarked_auctions);
	
		if(req_type===1){
			if(!(user_bookmarked_auctions.find((bookmark)=>{return bookmark.auction_id == AuctionId}))){
				req.user.bookmarked_auctions.push({auction_id:AuctionId});
                await req.user.save();
				res.send({message:"Auction has been bookmarked successfully", user:req.user});
			}else{
                res.status(400).send({message:"Auction already bookmarked"});
            }
		}else{
			if(user_bookmarked_auctions){
				req.user.bookmarked_auctions = user_bookmarked_auctions.filter((item)=>{
                    return item.auction_id.toString()!== AuctionId;
				});
			}
            await req.user.save();
            res.send({message:"Bookmark removed successfully", user:req.user});
		}
	}catch(e){
		res.status(400).send(e);
	}	
});


// Only used by us not public.
router.route('/all-users')
.get(async (req, res, next) => {
    try {
        var users = await User.find({});
        res.statusCode=200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    } catch (error) {
        next(error);
    }
}
);



/*
// Routes needed to build
1) Update Profile // almost done (discuss: should we send email on email update?)
2) Sending Email -> Account creation (due to addition of account), auction winning/transaction, etc.
3) Upload, get, delete User Image -> another db
4) User winnings
5) Modify account details ->email sending
6) Reputation
*/ 	


module.exports = router;
