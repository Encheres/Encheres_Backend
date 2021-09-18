// models/ schemas will come here
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
	{
		user_name: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
		},
        anonymous_name:{
            type: String,
            trim: true,
        },
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
			validate(value) {
				if (!validator.isEmail(value)) {
					throw new Error("Email is invalid");
				}
			},
		},
		password: {
			type: String,
			required: true,
			trim: true,
		},
		accounts: {
			account_id: {
				type: String,
				trim: true,
                required: true,
			},
			private_key: {
				type: String,
				trim: true,
                required: true,
			},
		},
        reputation:{
            type: Number,
			trim: true,
            default: 0,
        },
		image: {
			type: String,// url
		},
		tokens: [
			{
				// an array to store all the login tokens of the user
				token: {
					type: String,
					required: true,
				},
			},
		],
        address:[{
            addressLine1:{
                type:String,
                trim: true,
                required: true,
            },
            addressLine2:{
                type:String,
                trim: true
            },
            city:{
                type:Object,
                trim: true,
                required: true,
            },
            state:{
                type:String,
                trim: true,
                required: true,
            },
            postalCode:{
                type:String,
                trim: true,
                required: true
            },
            country:{
                type:String,
                trim: true,
                required:true
            }
        }],
		bookmarked_auctions: [
			// bookmark upcoming auctions
			{
				auction_id:{
					type: mongoose.Schema.Types.ObjectId,
					ref: "Auction",
				},
			}
		],
    },{ timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET_TOKEN_PASSWORD);

	//Saving tokens in user so as he can login over multiple devices and we can keep a track of that.
	user.tokens = user.tokens.concat({ token });
	await user.save();
	return token;
};
userSchema.methods.toJSON = function () {
	const user = this;
	const userObject = user.toObject();
	delete userObject.password;
	delete userObject.tokens;
	delete userObject.image;
	return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({
		email,
	});
	if (!user) {
		throw new Error("Unable to login");
	}

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Unable to login");
	}
	return user;
};

//Called just before saving. Used to hash the password
userSchema.pre("save", async function (next) {
	const user = this;
	if (user.isModified("password")) {
		user.password = await bcrypt.hash(user.password, 8);
	}
	next();
});

const User = mongoose.model("User", userSchema);
module.exports = User;