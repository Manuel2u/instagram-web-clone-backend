"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//fix depracation warning
mongoose_1.default.set("strictQuery", false);
const MONGO_URI = () => {
    if (process.env.NODE_ENV === "development") {
        return process.env.DEV_MONGO_URI;
    }
    else if (process.env.NODE_ENV === "production") {
        return process.env.PROD_MONGO_URI;
    }
};
const DBCONNECT = async () => {
    const MONGODB_URI = MONGO_URI();
    try {
        await mongoose_1.default.connect(MONGODB_URI, { autoIndex: true });
        console.log("db connected Succesfully");
    }
    catch (err) {
        console.log(err);
        process.exit();
    }
};
exports.default = DBCONNECT;
