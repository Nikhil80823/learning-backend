import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from '../utils/ApiResponse.js'



const generateAcessAndRefreshTokens = async(userId) => {
  try {
    // find user on the basis of ID
    const user = await User.findById(userId)
    // here it generate access and refresh Token
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    // save refreshToken in database
    user.refreshToken = refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken, refreshToken}

  } catch (error) {
    throw new ApiError(500, "something went wrong while generating referesh and access token")
  }
}



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

const loginUser = asyncHandler(async(req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and referesh token 
  // send cookie 


  // requested data from body
  const {email, username, password} = req.body

  // if they are not available
  if(!username && !email){
    throw new ApiError(400, "username or email is required")
  }

  // finding one
  const user = await User.findOne({
    $or: [{username},{email}]
  })

  if (!user) {
    throw new ApiError(404, "user does not exist")
  }


  const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }

const {accessToken,refreshToken} = await generateAcessAndRefreshTokens(user._id)

const loggedInUser = await User.findById(user._id). select("-password -refreshToken")

const options = {
  httpOnly: true,
  secure: true
}

return res
.status(200)
.cookie("accessToken", accessToken, options)
.cookie("refreshToken", refreshToken, options)
.json(
  new ApiResponse(
    200, 
    {
      user: loggedInUser, accessToken, refreshToken
    },
    "User logged in Successfully"
  )
)

})

const logoutUser = asyncHandler(async(req,res) =>{
  
})
export{
  registerUser,
  loginUser,
  logoutUser
}