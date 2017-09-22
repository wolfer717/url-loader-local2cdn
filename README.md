## 使用步骤
#### 1. 增加 `url-loader-local2cdn` 依赖包用来替代 `url-loader`

#### 2. 安装
```bash 
npm install url-loader-local2cdn --save-dev
```

## 高级
如果想定制上传逻辑，则在 `local2cdn-loader`增加一个 `uploadFn` 参数进行配置。
```js
{
    test: /\.(png|jpg|jpeg)$/,
    use: [{
        loader: 'mobilesafe-url-loader-local2cdn',
        options: {
            uploadUrl: 'url address' || uploadFn, //上传地址 或 自定义上传函数
            openCDN: env == config.build.env //是否开启cdn,如果开启在build本地项目时，本地目录中会生成一个.catch文件用于记录缓存文件。开发环境使用默认逻辑
        }
    }]
}
```

`uploadFn` 接口: 
```js
    (uploadUrl:string, filepath:string, content:string) : Promise<[filepath:string, cdnUrl:string]>
```

## 缓存
* 永久缓存，删除catch文件则重新发布时重新上传并写入缓存文件。