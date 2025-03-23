import express from 'express'
import dotenv from 'dotenv' 
import cors from 'cors'
import api from './api/index.js'
dotenv.config() ;
const app = express() ;
app.use(cors());
app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;
app.use('/api',api);
app.listen(process.env.serverPort,()=>{
    console.log('Successfully BackEnd Server Running',process.env.serverPort);
})