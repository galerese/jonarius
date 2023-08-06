// Arquivo para configurar os logs da aplicação de uma maneira mais formatada :)

// const LOG_FILE = "jonarius.log"

console.log("INFO - Replacing default console log with Winston, logging to stdout")

const util = require('util')

const winston = require('winston')
const { createLogger, format, transports } = winston;
const { combine, timestamp, label, printf , splat} = format;

// Formato customizado de mensagem de log
const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} ${level.padStart(5, " ")}: ${message}`;
});

// Este é o objeto logger geral do winston, que vamos usar para logar tudo
const logger = createLogger({
    level: 'debug',
    format: combine(
        timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        splat(),
        label(),
        myFormat
    ),
    transports: [
      new transports.Console()
    ],
  });


// Substituindo o log padrão do console do node para usar winston :)
// Gambiarra sem danos kkk
  console.log = (...args) => logger.info.call(logger, util.format(...args));
console.info = (...args) => logger.info.call(logger, util.format(...args));
console.warn = (...args) => logger.warn.call(logger, util.format(...args));
console.error = (...args) => logger.error.call(logger, util.format(...args));
console.debug = (...args) => logger.debug.call(logger, util.format(...args));


console.debug("Winston logger has been set up! : ) [%s]", "Test")