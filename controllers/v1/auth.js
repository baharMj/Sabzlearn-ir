const userModel = require("./../../models/user"); 

const registerValidation = require("../../validators/register")

exports.register = async (req, res) => {

    const validationResult = registerValidation(req.body); 
    if(!validationResult){
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
    // coding
};

exports.login = async (req, res) => {};

exports.getMe = async (req, res) => {};
