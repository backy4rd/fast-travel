"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const app_1 = require("./app");
const connection_1 = require("./connection");
const { PORT } = process.env;
connection_1.default().then(() => {
    app_1.default.listen(PORT, () => {
        console.log(`server is listening on port ${PORT} !!!`);
    });
});
//# sourceMappingURL=server.js.map