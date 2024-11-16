const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;

exports. signUp = async (req, res, next) => {
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await User.create({
      username: req.body.username,
      password: hashedPassword,
    });

    req.session.user = newUser

    res.status(201).json({
      status: "success",
      data: {
        user: newUser,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      return res.status(404).json({message: "User does not exist"});
    }
    const valid = await bcrypt.compare(req.body.password, user.password);
    if (valid) {
      req.session.user = user
      res.status(200).json({
        status: "success", 
        message: `Welcome ${user.username}`,
      });
    } else {
      res.status(401).json({
        status: "fail",
        message: "Incorrect Password",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: e.message,
    });
  }
};

exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (user) {
            res.status(200).json({
                message: "User deleted successfully"
            });
        } else {
            res.status(404).json({
                message: "User does not exist"
            });
        }
    } catch (e) {
        res.status(500).json({
            message: "An error occurred while deleting the user",
            error: e.message
        });
    }
}
