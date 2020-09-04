"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const app_1 = require("./app");
const mongoose = require("mongoose");
dotenv.config();
const { PORT, MONGODB_URI } = process.env;
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
app_1.default.listen(PORT, () => {
    console.log(`server is listening on port ${PORT} !!!`);
});
//# sourceMappingURL=server.js.map