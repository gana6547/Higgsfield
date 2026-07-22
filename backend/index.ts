import express from "express"
import cors from "cors"

const app=express();

app.use(express.json());
app.use(cors());

app.post("api/v1/auth/signup",()=>{

})

app.post("api/v1/auth/signin",()=>{
    
})

app.post("api/v1/auth/avatar",()=>{
    
})

app.post("api/v1/auth/video",()=>{
    
})

app.get("api/v1/auth/video/:videoId",()=>{
    
})

app.get("api/v1/auth/videos",()=>{
    
})

app.get("api/v1/auth/credit",()=>{
    
})

app.get("api/v1/auth/models",()=>{
    
})

app.get("api/v1/auth/avatar/:avatarId",()=>{
    
})

app.get("api/v1/auth/avatars",()=>{
    
})

app.get("api/v1/auth/me",()=>{
    
})

app.listen(8080,()=>{
    console.log("pp running on Port 8080");
})