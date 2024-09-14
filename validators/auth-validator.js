const {z} = require("zod");

const signupSchema = z.object({
    username: z.string({required_error:"Name is required"}).trim()
    .min(3,{message:"Username has atleast 3 character"})
    .max(225,{message:"Username not be more than 250 character"}),
    email:z.string({required_error:"Email is required"})
    .trim()
    .email({message:"Please enter the valid mail id"})
    .min(5,{message:"Please enter mail ID of atleast 5 character"}),
    password:z.string({required_error:"Password is required"})
    .trim()
    .min(7,{message:"Please enter password of atleast 7 character"})
    .max(100,{message:"Maximum character of passwordis 100"}),
});

const loginSchema = z.object({
    email: z.string({required_error:"Please enter a email address"}).trim()
    .email({message:"Please enter the valid email Id"}),
    password: z.string({required_error:"Please Enter the password"})
    .trim()
    .min(7,{message:"Please enter password of atleast 7 character"})
    .max(100,{message:"Maximum character of passwordis 100"}),
});

module.exports = {signupSchema, loginSchema};