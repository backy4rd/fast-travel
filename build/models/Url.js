"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UrlSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UrlSchema = new mongoose_1.Schema({
    endpoint: { type: String, required: true, index: { unique: true } },
    url: { type: String, required: true },
    click: { type: Number, required: true },
}, { timestamps: true });
const Url = mongoose_1.model('Url', exports.UrlSchema);
exports.default = Url;
//# sourceMappingURL=Url.js.map