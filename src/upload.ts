import { createReadStream, writeFileSync, existsSync, mkdirSync, readdirSync, unlinkSync } from 'fs'
import { join, basename, isAbsolute } from 'path'
import * as FormData from 'form-data'
import * as sha1 from 'sha1'
import log from './log'
import cache from './cache'

const upload = (url:string, filepath:string, content:string):Promise<[string, string]> => {
    let key = sha1(`${content} of ${basename(filepath)}`)
    let value:string = cache.get(key, filepath)

    if (value) { // if found, use cache
        let out:[string, string] = [filepath, value]
        log.info(`found cached cdn url: ${value}, for ${filepath}`)
        return Promise.resolve(out)
    } else { // if not, do upload
        log.note(`uploading ${filepath} to ${url} ...`)
        return doUpload(key, url, filepath, content)
    }
}

const doUpload = (key:string, url:string, filepath:string, content:string):Promise<[string, string]> => {
    return new Promise((resolve, reject) => {
        let form = new FormData()
        let _f = filepath

        form.append('https', '1')
        form.append('keepName', '1')
        form.append('file', createReadStream(_f))

        form.submit(url, function(err, res) {
            if (err) {
                reject(err)
            } else {
                let rawData = ''
                res.setEncoding('utf8')
                res.on('data', chunk => rawData += chunk)
                res.on('end', () => {
                    let out = JSON.parse(rawData)
                    if (out.error === 0) {
                        cache.set(key, out.url, filepath)
                        resolve([filepath, out.url])
                    } else {
                        reject(out)
                    }
                })
            }
        })
    })
}

export default upload