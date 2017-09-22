import {join} from 'path'
import {readFile, writeFile, existsSync, writeFileSync} from 'fs'
import log from './log'

let _cache = {}
const _rootdir = join(__dirname, '../../../')
const _dbpath = join(_rootdir, '.local2cdn.cache')

/**
 * init read file
 */
readFile(_dbpath, 'utf8', (err, content) => {
    if (!err) {
        try {
            let cache = JSON.parse(content)
            for (let key in cache) {
                _cache[key] = cache[key]
            }
            flush()
        } catch (err) {
            log.warn(`failed to read cache file: ${_dbpath}, for:`, err.message)
        }
    } else {
        log.warn(`failed to read cache file: ${_dbpath}, for:`, err.message)
    }
})

/**
 * async flush
 */
const flush = () => {
    let content = JSON.stringify(_cache, null, 2)
    writeFile(_dbpath, content, (err) => {
        if (err) {
            log.error(`failed to write cache file: ${_dbpath}, for:`, err.message)
        }
    })
}
/**
 * get catch
 */
const get = (key:string, path?:string) => {
    if (key) {
        let data = _cache[key]
        if (data) {
            if (path && !data.paths.includes(path)) {
                data.paths.push(path)
                flush()
            }
            return data.value
        }
    }
    return null
}

/**
 * set catch
 */
const set = (key:string, value:string, path?:string) => {
    if (key) {
        _cache[key] = {value}
        if (path)  _cache[key].paths = [path]
        flush()
        return true
    }
    return false
}

export default {get, set}
