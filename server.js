import express from 'express'
import dotenv from 'dotenv' 
import cors from 'cors'


const app = express() ;
app.use(express.json()) ;
app.use(express.urlencoded({extended : true})) ;
