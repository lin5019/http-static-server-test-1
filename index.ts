import * as http from "http";
import * as path from "path";
import * as fs from "fs";
import * as url from "url";
import {IncomingMessage, ServerResponse} from "http";
const source='public'

const geiSuffix=(path)=>{
    const list=path.slice(1).split('.');
    let suffix=list[list.length-1]
    if(suffix==='js'){
        suffix='text/javascript'
    }else if(suffix==='html'){
        suffix='text/html'
    }else if(suffix==='gif'){
        suffix='image/gif'
    }else if(suffix==='png'){
        suffix='image/png'
    }else if(suffix==='json'){
        suffix='application/json'
    }else if(suffix==='jpeg' || suffix==='jpg'){
        suffix='image/jpeg'
    }else if(suffix==='css' ){
        suffix='text/css'
    }

    return  suffix
}



let server = http.createServer();
//__dirname是nodejs,当前文件所在的绝对路径


server.on('request',(request: IncomingMessage,response: ServerResponse)=>{
    //resolve以当前文件的绝对路径进行拼接地址.
    const {pathname}=url.parse(request.url)
    // console.log(1,pathname)
    // console.log(2,pathname.slice(1))
    if(pathname==='/'){
        fs.readFile(path.resolve(source,'index.html'),(error,data)=>{
            if(error) throw error
            response.setHeader('Content-Type', 'text/html;charset=utf-8')
            response.end(data.toString())
        })
    }else if(pathname.slice(1)){
        const suffix=geiSuffix(pathname)
        console.log(`suffix:  ${suffix}`)
        fs.readFile(path.resolve(source,pathname.slice(1)),(error,data)=>{
            if(error) throw error
            response.setHeader('Content-Type', `${suffix}`)
            response.write(data)
            response.end()
        })
    }

})

server.listen(8888)

console.log('开启服务器')