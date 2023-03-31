"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing packages and modules
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbconnect_1 = __importDefault(require("./config/dbconnect"));
const errorMiddleware_1 = __importDefault(require("./middlewares/errorMiddleware"));
const PORT = process.env.PORT || 5000;
//import routes
const user_1 = __importDefault(require("./routes/user"));
//use cors
app.use((0, cors_1.default)());
//use express json
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
//use global middlewares
app.use(errorMiddleware_1.default);
//routes
app.use("api/v1/auth", user_1.default);
//connect db and listen on port
app.listen(PORT, async () => {
    try {
        await (0, dbconnect_1.default)();
        console.log(`server listening on Port ${PORT}`);
    }
    catch (err) {
        console.log(err);
    }
});
