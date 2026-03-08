import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from '../utils/ApiResponse.js'

const registerUser = asyncHandler(async (req, res) => {
  //get user details from frontend
  // validation - not empty
  // check if user already exists: username, email
  // check f for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object- create entry in db 
  // remove password and refresh token field from response
  // check for user creation
  // return res



  const {fullName, email, username, password } = req.body
  // console.log("This is req.body ", req.body);
  // some give us true of false if field is there it will give false if after trimming there is an empty string it will give us 
  
  if(
    [fullName, email,username, password].some((field) => field?.trim()=== "")
  ){
    throw new ApiError(400, "All fields are required")
  }

  // checking if user existed 
  // we have created a User model and that User call mongo db on our behalf as much as we want

const existedUser = await User.findOne({
  $or: [{ username } , { email }]
})
if(existedUser){
  throw new ApiError(409, "User with email or username exists")
}

// console.log("This is req.files",req.files);

// uploading on local server
// multer provide more field in req  example .file 
const avatarLocalPath = req.files?.avatar[0]?.path;
// const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0 ){req.files.coverImage[0]?.path}

// checking if avatar is uploaded on local path
if (!avatarLocalPath){
  throw new ApiError(400, "Avatar file is required")
}

//uploading on cloudinary
const avatar = await uploadOnCloudinary(avatarLocalPath)
const coverImage = await uploadOnCloudinary(coverImageLocalPath)

// avatar check if uploaded on 
if(!avatar){
  throw new ApiError(400, "Avatar file is required")
}
// database entry
const user = await User.create({
  fullName,
  avatar: avatar.url,
  coverImage: coverImage?.url || "",
  email,
  password,
  username: username.toLowerCase()
})


// we will not get password and refresh token in response

const createdUser = await User.findById(user._id).select(
  "-password -refreshToken"
)
if(!createdUser){
  throw new ApiError(500, "Something went wrong while registering the user")
}
// returning res 
return res.status(201).json(
  //new ApiResponse create an object of ApiResponse class
  new ApiResponse(200, createdUser, "User registerd Successfully")
)
})

export{
  registerUser,
}