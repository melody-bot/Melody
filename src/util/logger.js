const { createLogger, format, transports } = require("winston");
const colors = require("colors");
const { combine, timestamp, label, printf } = format;

class Logger {
  constructor(LoggingFile) {
    const myFormat = printf(
      ({ level, message, timestamp }) => `${timestamp} ${level}: ${message}`
    );
    this.logger = createLogger({
      format: combine(label({ label: "logs" }), timestamp(), myFormat),
      transports: [new transports.File({ filename: LoggingFile })],
    });
  }

  log(Text, level) {
    const d = new Date();
    this.logger.log({
      level: level,
      message: `${Text}`,
    });
    console.log(
      `${colors.green(
        `${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
      )} ${colors.yellow(` ${level}: ${Text}`)}`
    );
  }
}

module.exports = Logger;
