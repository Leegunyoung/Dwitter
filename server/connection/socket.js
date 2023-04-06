import { config } from "../config.js";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";


class Socket{
    constructor(server){
        this.io=new Server(server,{
            cors:{
                origin:'*',
            },
        });
        this.io.use((socket,next)=>{
            const token=socket.handshake.auth.token;
            if(!token){
                return next(new Error('Authentication error'));
            }
            jwt.verify(token,config.jwt.secretKey,(error,decoded)=>{
                if(error){
                    return next(new Error('Authentication error'));
                }
                next();
            });
        })
    }
}

let socket;
export function initSocket(server){
    if(!socket){
        socket = new Socket(server);
    }
}
export function getSocketIO(){
    if(!socket){
        throw new Error('Please call init first');
    }
    return socket.io;
}