import * as loaderUtils from 'loader-utils'
import * as mime from 'mime'
import log from './log'
import upload from './upload'

interface Loader {
    (content: Buffer | string): any
}

const loader: Loader = function(content) {
    this.cacheable && this.cacheable()
    let options =  loaderUtils.getOptions(this) || {}
    let limit = options.limit || (this.options && this.options.url && this.options.url.dataUrlLimit)

    if(limit) {
        limit = parseInt(limit, 10)
    }

    let mimetype = options.mimetype || options.minetype || mime.lookup(this.resourcePath)

    if(typeof content === "string") {
        content = new Buffer(content)
    }
    
    if(!limit || content.length < limit) {
        return "module.exports = " + JSON.stringify("data:" + (mimetype ? mimetype + "" : "") + "base64," + content.toString("base64"))
    } else {
        var fileLoader = require("file-loader")
        if(!!options.openCDN){
            if(!options.uploadUrl) {
                log.warn('upload url is not setting!')
                return fileLoader.call(this, content)
            }
            let callback = this.async()
            let fn = options.uploadFn || upload
            fn.call(null, options.uploadUrl, this.resourcePath, content.toString("base64")).then(([filepath, url]) => {
                callback(null, "module.exports = " + JSON.stringify(`${url}`))
            })
        }else{
            return fileLoader.call(this, content)
        }
    }
}

export const raw = true

export default loader
