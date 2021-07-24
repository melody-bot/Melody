const { createLogger, format, transports } = require("winston");
const colors: any = require("colors");
const { combine, timestamp, label, printf } = format;

class Logger {
  constructor(LoggingFile) {
    const myFormat: any = printf(({ level, message, label, timestamp }) => {
      return `${timestamp} [${label}] ${level}: ${message}`;
    });

    this.logger = createLogger({
      format: combine(label({ label: "logs" }), timestamp(), myFormat),
      transports: [new transports.File({ filename: LoggingFile })],
    });
  }

  log(Text) {
    const d: any = new Date();
    this.logger.log({
      level: "info",
      message: `${Text}`,
    });
    console.log(
      `${colors.green(
        `${d.getDate()}:${d.getMonth()}:${d.getFullYear()} - ${d.getHours()}:${d.getMinutes()}`
      )} ${colors.yellow(` | Info: ${Text}`)}`
    );
  }
}

module.exports = Logger;
