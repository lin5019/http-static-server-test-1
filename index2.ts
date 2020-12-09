import * as http from "http";
import {IncomingMessage, ServerResponse} from "http";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";

const cacheAge=3600 * 24 * 365
const source = 'public'
//resolve可以直接获的当前文件夹的绝对路径.
//const publicDir=path.resolve(source)


let server = http.createServer();
//__dirname是nodejs,当前文件所在的绝对路径


server.on('request', (request: IncomingMessage, response: ServerResponse) => {
    let filePath = url.parse(request.url).pathname.slice(1);
    //默认地址是index.html
    if (filePath === '') filePath = 'index.html'

    console.log(`filePath:  ${filePath}`)
    const absolutePath = path.resolve(source, filePath)
    console.log(`absolutePath:  ${absolutePath}`)
    fs.readFile(absolutePath, (err, data) => {
        if (err) {
            console.log(err)
            //在-4058时,才时真正的404
            if (err.errno === -4058) {
                fs.readFile(path.resolve(source, '404.html'), (err, data) => {
                    //默认的响应类型是200
                    response.statusCode = 404
                    response.end(data)
                })

            } else if (err.errno === -4068) {
                //403没有权限,-4068目录不可以访问.
                response.statusCode = 403
                response.setHeader("content-Type", "text/html;charset=utf-8")
                response.end(`<h1>没有权限访问目录!</h1>`)

            } else {
                response.statusCode = 500
                response.setHeader("content-Type", "text/html;charset=utf-8")
                response.end(`<h1>服务器繁忙!</h1>`)
            }

        } else {
            //http模块会自动匹配响应类型
            response.setHeader(`Cache-Control`, `public, max-age=${cacheAge}`)
            response.end(data)
        }
    })
})

server.listen(8888)

console.log('开启服务器')