"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const fs = require("fs");
class Logger {
    constructor() {
        this.logDir = path.resolve(__dirname, '../../.log');
        this.currentDay = new Date();
        this.logPath = this.getLogPath(this.currentDay);
        this.logStream = fs.createWriteStream(this.logPath, { flags: 'a' });
    }
    error(_err) {
        return this.writeLog('ERROR', _err.stack);
    }
    writeLog(_type, _message) {
        return __awaiter(this, void 0, void 0, function* () {
            const now = new Date();
            const message = `[${now} - ${_type}]: ${_message}\n\n`;
            // Create new log file for new day
            if (now.getDate() !== this.currentDay.getDate()) {
                this.logPath = this.getLogPath(now);
                this.currentDay = now;
                this.logStream.close();
                this.logStream = fs.createWriteStream(this.logPath, { flags: 'a' });
            }
            this.logStream.write(message);
        });
    }
    getLogPath(date) {
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return `${this.logDir}/${day}-${month}-${year}.log`;
    }
}
exports.default = new Logger();
//# sourceMappingURL=logger.js.map