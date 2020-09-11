"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    profile: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    urls: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Url', required: true }],
}, { timestamps: true });
const User = mongoose_1.model('User', exports.UserSchema);
exports.default = User;
//# sourceMappingURL=User.js.map