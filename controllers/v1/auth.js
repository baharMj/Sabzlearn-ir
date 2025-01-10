const userModel = require("./../../models/user"); 
const banUserModel = require("./../../models/ban-user"); 

const registerValidation = require("../../validators/register")
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {

    const validationResult = registerValidation(req.body); 
    if(validationResult !== true){
        return res.status(422).json(validationResult);
    }
    const { username, name, email, password, phone } = req.body; 

    const isUserExists = await userModel.findOne({
        $or: [{username}, {email}],
    })
    if (isUserExists){
        return res.status(409).json({
            message: "username or email is duplicated",
        })
    }

    const isUserBan = await banUserModel.find({ phone })
    if (isUserBan.length){
        return res.status(409).json({
            message: "phone is Ban!",
        })
    }
    
    const countOfUsers = await userModel.countDocuments();
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        username,
        name,
        email,
        phone,
        password : hashedPass,
        role : countOfUsers > 0 ? 'USER' : 'ADMIN',
    })

    const userObject = user.toObject() ;
    Reflect.deleteProperty(userObject, "password");

    const accessToken = jwt.sign({ id : user._id }, process.env.JWT_SECRET , {
        expiresIn : "30 day",
    });

    return res.status(201).json ({ user : userObject , accessToken});

};

exports.login = async (req, res) => {

    const { identifier, password } = req.body; 

    const user = await userModel.findOne ({
        $or : [{ email : identifier }, {username : identifier }],
    });

    if (!user){
        return res.status(401).json({
            message : "username or email is not valid!!"
        });
    }
    const isValidPass = await bcrypt.compare( password , user.password );

    if (!isValidPass){
        return res.status(401).json({
            message : "Pass is not valid",
        });
    }

    const accessToken = jwt.sign({ id : user._id}, process.env.JWT_SECRET, {
        expiresIn : "30 days"
    });
    return res.status(201).json({ accessToken });
};

exports.getMe = async (req, res) => {};
