import {useVirtualId} from "../database/database.js";
import * as UserRepository from './auth.js';
import Mongoose from 'mongoose';

//NOSQL(정보의 중복>관계)
//모든 사용자가 트윗을 쿼리하는 횟수 >사용자가 사용자의 정보를 업데이트 하는 횟수
//프로필 DB
//사용자 문서 DB:서버 확장이 가능
//SQL:관계형
//조인쿼리의 성능이 좋기 때문이다.
const tweetSchema = new Mongoose.Schema({
    text:{type:String,required:true},
    userId:{type:String,required:true},
    name:{type:String,required:true},
    username:{type:String,required:true},
    url:String,
},{timestamps:true});

useVirtualId(tweetSchema);
const Tweet=Mongoose.model('Tweet',tweetSchema);

export async function getAll(){
    return Tweet.find().sort({createdAt:-1});
}

export async function getAllByUsername(username){
    return Tweet.find({username}).sort({createdAt:-1});
}

export async function getById(id){
    return Tweet.findById(id);

}

export async function create(text,userId){
    return UserRepository.findById(userId)
    .then((user)=>
        new Tweet({
            text,
            userId,
            name:user.name,
            username:user.username
        }).save()
    );
}

export async function update(id,text){
    return Tweet.findByIdAndUpdate(id,{text});
}

export async function remove(id){
    return Tweet.findByIdAndDelete(id);
}

