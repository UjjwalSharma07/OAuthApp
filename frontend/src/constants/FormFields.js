const loginFields=[
    {
        labelText:"Email address",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    }
]

const signupFields=[
   
    {
        labelText:"Username",
        labelFor:"username",
        id:"username",
        name:"username",
        type:"text",
        autoComplete:"username",
        isRequired:true,
        placeholder:"Username"   
    },
    {
        labelText:"Email address",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"Phone",
        labelFor:"phone",
        id:"phone",
        name:"phone",
        type:"tel",
        autoComplete:"phone",
        isRequired:true,
        placeholder:"Phone no."   
    },
    
    {
        labelText:"Password",
        labelFor:"password",
        id:"password",
        name:"password",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirmPassword",
        id:"confirmPassword",
        name:"confirmPassword",
        type:"password",
        autoComplete:"confirmPassword",
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

const forgotPasswordFields = [
    {
        labelText:"Email address",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"email",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email address"   
    },
    {
        labelText:"New Password",
        labelFor:"newpassword",
        id:"newpassword",
        name:"newpassword",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:" New Password"   
    },
    {
        labelText:"Confirm Password",
        labelFor:"confirmPassword",
        id:"confirmPassword",
        name:"confirmPassword",
        type:"password",
        autoComplete:"current-password",
        isRequired:true,
        placeholder:"Confirm Password"   
    }
]

const verifyOTPFields = [
    {
        labelText:"Email or Phone",
        labelFor:"email",
        id:"email",
        name:"email",
        type:"text",
        autoComplete:"email",
        isRequired:true,
        placeholder:"Email or Phone "   
    },
    {
        labelText: "OTP",
        labelFor: "otp",
        id: "otp",
        name: "otp",
        type: "text",
        isRequired: true,
        placeholder: "Enter OTP",
      },
]
export {loginFields,signupFields,forgotPasswordFields,verifyOTPFields}