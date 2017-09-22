import * as chalk from 'chalk'

const log = (prefix, color) => (...rest) => {
    console.log(color(prefix, ...rest))
}

const warn = log('[LOCAL2CDN][WARN]', chalk.yellow)

const info = log('[LOCAL2CDN][INFO]', chalk.green)

const note = log('[LOCAL2CDN][NOTE]', chalk.magenta)

const error = log('[LOCAL2CDN][ERROR]', chalk.red)

export default { warn, info, note, error }