"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET_USER_DETAILS = exports.SIGNIN = exports.SIGNUP = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const token_1 = __importDefault(require("../utils/token/token"));
app.use(express_1.default.urlencoded({ extended: true }));
const signInUser = async (info) => {
    try {
        const { password, email_username } = info;
        const user = await user_model_1.default.findOne({
            $or: [{ username: email_username }, { email: email_username }],
        });
        if (!user)
            return new Error("wrong email or username");
        const isPasswordmatch = await bcryptjs_1.default.compare(password, user.password || "");
        if (!isPasswordmatch)
            return new Error("wrong password");
        return user;
    }
    catch (error) {
        throw new Error(`${error}`);
    }
};
const signUpUser = async (info) => {
    const hash = await bcryptjs_1.default.hash(info.password, 10);
    if (!hash) {
        throw new Error(`there was an error signing user up`);
    }
    const user = new user_model_1.default({
        username: info.username,
        fullName: info.fullName,
        email: info.email,
        password: hash,
    });
    const savedUser = await user.save();
    return savedUser;
};
const SIGNUP = async (req, res) => {
    try {
        const { username, email, password, fullName } = req.body;
        const info = { email, username, password, fullName };
        if (!email || !username || !password) {
            return res.status(400).json("Make sure all inputs are valid");
        }
        const alreadyExistingUser = await user_model_1.default.findOne({
            $or: [{ email }, { username }],
        });
        if (alreadyExistingUser) {
            return res.status(500).json("User already exists");
        }
        const user = await signUpUser(info);
        const { access_token, refresh_token } = (0, token_1.default)(user);
        user.token = refresh_token;
        await user.save();
        return res.json({
            user,
            access_token,
        });
    }
    catch (err) {
        res.status(500).json(`${err}`);
    }
};
exports.SIGNUP = SIGNUP;
const SIGNIN = async (req, res) => {
    try {
        const { email_username, password } = req.body;
        const info = { email_username, password };
        if (!email_username || !password) {
            return res.status(401).json("Make sure all inputs are right");
        }
        const user = await signInUser(info);
        return res.json({ user });
    }
    catch (err) {
        res.status(500).json(`${err}`);
    }
};
exports.SIGNIN = SIGNIN;
// get the logged in user details
const GET_USER_DETAILS = async (req, res) => {
    console.log(req.user.id);
    user_model_1.default.findOne({ _id: req.user.id }).then((dbuser) => {
        if (!dbuser) {
            return res.status(404).json({ usernotfound: "User not found" });
        }
        else {
            res.status(200).json({ dbuser });
        }
    });
};
exports.GET_USER_DETAILS = GET_USER_DETAILS;
