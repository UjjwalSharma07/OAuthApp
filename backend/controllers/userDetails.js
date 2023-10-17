const Details = require("../models/Details");
const { createError } = require("../utils/error");
const mailSender = require("../utils/mailSender");
const cloudinary = require("cloudinary").v2;

const isFileTypeSupported = (type,supportedType)=>{
  return supportedType.includes(type);
}

const uploadFileToCloudinary = async (file, folder) => {
  const options = { folder };
  return await cloudinary.uploader.upload(file.tempFilePath, options);
};

exports.createUserDetails = async (req, res, next) => {
  
  try {
    const {
      username,
      email,
      phone,
      portfolio,
      github,
      linkedIn,
    } = req.body;

    const profileFile = req.files.profile;    // Profile image
  
  
    const resumeFile = req.files.resume;     // Resume file
   
   
    const data = await Details.findOne({ email });
    console.log("data",data);
    if(data){
      return res.status(403).json({
        data:{email},
        message: 'User data already exists. Please refresh this page.',
      });
    }

    // Validation for file types
    const supportedImageTypes = ['jpeg', 'png', 'jpg'];
    const profileFileType = profileFile.name.split('.')[1].toLowerCase();

    if (!isFileTypeSupported(profileFileType, supportedImageTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Profile Image Format not supported',
      });
    }

    const supportedResumeTypes = ['pdf', 'doc', 'docx'];
    const resumeFileType = resumeFile.name.split('.')[1].toLowerCase();

    if (!isFileTypeSupported(resumeFileType, supportedResumeTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Resume Format not supported',
      });
    }

    // Upload profile image to Cloudinary
    const profileUploadResponse = await uploadFileToCloudinary(profileFile, 'CodeAteTeam');

    // Upload resume to Cloudinary
    const resumeUploadResponse = await uploadFileToCloudinary(resumeFile, 'CodeAteTeam');
   
    // Create a new user details entry in the database
    
    const userDetails = new Details({
      profile: profileUploadResponse.secure_url,
      username,
      email,
      phone,
      resume: resumeUploadResponse.secure_url,
      portfolio,
      github,
      linkedIn,
    });

    const savedUserDetails = await userDetails.save();

    return res.status(201).json({
      success: true,
      message: "UserDetails saved successfully.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing the request.",
    });
  }
};
exports.editUserDetails = async (req, res, next) => {
  try {
    
    const {
      username,
      email,
      phone,
      portfolio,
      github,
      linkedIn,
    } = req.body;

    const profileFile = req.files.profile;    // Profile image
   
    const resumeFile = req.files.resume;     // Resume file
   
    const user = await Details.findOne({ email });

    if (!user) {
      return next(createError(404, "User not found!"));
    }
    
    // Validation for file types
    const supportedImageTypes = ['jpeg', 'png', 'jpg'];
    const profileFileType = profileFile.name.split('.')[1].toLowerCase();

    if (!isFileTypeSupported(profileFileType, supportedImageTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Profile Image Format not supported',
      });
    }

    const supportedResumeTypes = ['pdf', 'doc', 'docx'];
    const resumeFileType = resumeFile.name.split('.')[1].toLowerCase();

    if (!isFileTypeSupported(resumeFileType, supportedResumeTypes)) {
      return res.status(400).json({
        success: false,
        message: 'Resume Format not supported',
      });
    }

    // Upload profile image to Cloudinary
    const profileUploadResponse = await uploadFileToCloudinary(profileFile, 'CodeAteTeam');

    // Upload resume to Cloudinary
    const resumeUploadResponse = await uploadFileToCloudinary(resumeFile, 'CodeAteTeam');
    
    // Update the existing user's details
    const updatedUser = await Details.findOneAndUpdate(
      { email },
      {
        profile: profileUploadResponse.secure_url,
        username,
        email,
        phone,
        resume: resumeUploadResponse.secure_url,
        portfolio,
        github,
        linkedIn,
      },
      { new: true } 
    );

    if (!updatedUser) {
      return next(createError(404, "User not found!"));
    }

    return res.status(200).json({
      success: true,
      message: "User details updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    return next(createError(500, "An error occurred while processing the user details update request."));
  }
};


exports.getUserDetails = async(req,res)=>{
  try {
    const { email } = req.query;
    const data = await Details.findOne({ email });
   
    if(!data){
      return res.status(401).json({
        success: false,
        message: "User data not found!",
      });
    }
    res.status(201).json({
      success: true,
      data:{data},
      message: "UserData fetched successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "An error occurred while fetching user data.",
    });
  
  }
}


exports.subscribe = async(req,res)=>{

  const { email } = req.body;

  try {

    await mailSender(email, "Newsletter Subscription Confirmation", "Thank you for subscribing to our newsletter!");

    res.status(201).json({
      success: true,
      message: "Subscription successful.",
    });
   

  } catch (error) {

    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: "Subscription failed.",
    });
    
  }

}