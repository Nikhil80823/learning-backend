import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN, // allows request from specific frontend URL only
  credentials: true // allows cookies, authorization header, and sessions to be sent from the frontend
}))

app.use(express.json({limit: "20kb"})) // i am accepting json and limit set a value 

//since Data from url comes indiffernt as it has its on encoder

app.use(express.urlencoded({extended: true, limit: "20kb"}))
// static is used to store public assets 
app.use(express.static("public"))

app.use(cookieParser())



// Routes import
import userRouter from "./routes/user.routes.js"


// routes declaration
app.use("/api/v1/users", userRouter)


export { app }