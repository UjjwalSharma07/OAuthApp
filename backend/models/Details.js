const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");

const DetailsSchema = new mongoose.Schema(
  {
    profile: {
      type: String,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
    }, 
    resume: {
      type: String,  
      required: true,
    },
    portfolio: {
      type: String,
    },
    github: {
      type: String,
    },
    linkedIn: {
      type: String,
    },
  },
  { timestamps: true }
);

//post middleware
DetailsSchema.post("save",async function(doc){
  try {
    console.log("DOC",doc); // db mai save huyi entry hi doc hai
    await mailSender(doc.email, " Confirmation Email from CodeAte Team", ` <b>Your information has been successfully updated.</b>`);
  } catch (error) {
    console.log("post middleware error", error);
  }
})

module.exports = mongoose.model("Details", DetailsSchema);
