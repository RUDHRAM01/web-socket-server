const Users = require('../models/UserModel');
const bcrypt = require('bcrypt');
const cookie = require('cookie');
const { generateToken } = require('../db/token');
const nodemailer = require('nodemailer');
require('dotenv').config();
const uploadToS3 = require('../S3');
const jwt = require('jsonwebtoken');



// const register = async (req, res) => {
//     const { email, password } = req.body;
//     if (!email || !password) {
//       return res.status(400).json({ msg: 'Please enter all fields' });
//     }

//     if (password.length < 6) {
//       return res
//         .status(400)
//         .json({ msg: 'Password must be at least 6 characters' });
//     }

//     try {
//       const re = await Users.find({ email });
//       if (re.length > 0)
//         return res.status(400).json({ msg: 'User already exists' });
//       else {
//         const hashPass = await bcrypt.hash(password, 10);
//         const newUser = new Users({
//           email,
//           password: hashPass,
//         });

//         try {
//           const savedUser = await newUser.save();

//           const token = generateToken(savedUser._id);

//           // Set the token as a cookie
//           res.setHeader(
//             'Set-Cookie',
//             cookie.serialize('token', token, {
//               httpOnly: true,
//               maxAge: 3600, // 1 hour (you can adjust the expiration time as needed)
//               sameSite: 'strict',
//             })
//           );

//           res.status(200).json({
//             user: {
//               id: savedUser._id,
//               email: savedUser.email,
//             },
//           });
//         } catch (err) {
//           console.log(err);
//         }
//       }
//     } catch (err) {
//       res.status(400).json({ err });
//     }
//   };

//   const login = async (req, res) => {
//     const { email, password } = req.body;
//     console.log(email, password);

//     if (!email || !password) {
//       return res.status(400).json({ msg: 'Please enter all fields' });
//     }

//     try {
//       const re = await Users.find({ email });
//       if (re.length === 0) return res.status(400).json('User does not exist');
//       else {
//         const isMatch = await bcrypt.compare(password, re[0].password);
//         if (!isMatch)
//           return res.status(400).json({ msg: 'Invalid credentials' });
//         else {
//           console.log('d');

//           const token = generateToken(re[0]._id);

//           // Set the token as a cookie
//           res.setHeader(
//             'Set-Cookie',
//             cookie.serialize('token', token, {
//               httpOnly: true,
//               maxAge: 3600, // 1 hour (you can adjust the expiration time as needed)
//               sameSite: 'strict',
//             })
//           );

//           res.status(200).json({
//             user: {
//               id: re[0]._id,
//               email: re[0].email,
//             },
//           });
//         }
//       }
//     } catch (err) {
//       console.log(err);
//     }
//   };

// forgot password 
const forgotEmailPassword = (email, id) => {

    const iid = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '10m' });
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: false,
                requireTLS: true,
                user: 'noreplychat.rs@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: 'noreplychat.rs@gmail.com',
            to: email,
            subject: 'Forgot Password 🔑',
            html: `
<body>
    <table width="600" cellpadding="0" cellspacing="0" style="margin:auto; background-color:#f8f9fa; border:1px solid #e0e0e0; padding:20px;">
        <tr>
            <td style="text-align:center; padding:20px; background-color:#ffffff;">
                <img src="" alt="Logo" style="max-width:100%; height:auto;">
            </td>
        </tr>
        <tr>
            <td style="padding:20px; background-color:#ffffff;">

                <h1 style="font-size:24px; font-family: Arial, sans-serif; color:#333333;">Welcome to Our Service!</h1>
                <p style="font-size:16px; font-family: Arial, sans-serif; color:#666666; line-height:1.5;">Hello!</p>
                <a href="https://socket-beie.onrender.com/api/auth/updatePassword?id=${iid}" style="display:inline-block; background-color:#28a745; color:#ffffff; text-decoration:none; padding:10px 20px; margin-top:20px; border-radius:4px; font-family: Arial, sans-serif;">Update Password</a>
            </td>
        </tr>
        
        <tr>
            <td style="text-align:center; padding:20px; background-color:#e9ecef;">
                <p style="font-size:14px; font-family: Arial, sans-serif; color:#666666;">© 2023 CA. All Rights Reserved.</p>
                <p style="font-size:14px; font-family: Arial, sans-serif; color:#666666;">Rudhram Saraswat</p>
            </td>
        </tr>
    </table>
</body>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent successfully: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }

}

// forgot password end *****************************************************

const sendVerifyMail = (email, id) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                host: 'smtp.gmail.com',
                port: 465,
                secure: false,
                requireTLS: true,
                user: 'noreplychat.rs@gmail.com',
                pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: 'noreplychat.rs@gmail.com',
            to: email,
            subject: 'Verify your email',
            html: `
<body>
    <table width="600" cellpadding="0" cellspacing="0" style="margin:auto; background-color:#f8f9fa; border:1px solid #e0e0e0; padding:20px;">
        <tr>
            <td style="text-align:center; padding:20px; background-color:#ffffff;">
                <img src="" alt="Logo" style="max-width:100%; height:auto;">
            </td>
        </tr>
        <tr>
            <td style="padding:20px; background-color:#ffffff;">

                <h1 style="font-size:24px; font-family: Arial, sans-serif; color:#333333;">Welcome to Our Service!</h1>
                <p style="font-size:16px; font-family: Arial, sans-serif; color:#666666; line-height:1.5;">Thank you for signing up for our service. We are excited to have you on board!</p>
                <a href="https://socket-beie.onrender.com/api/auth/verify?id=${id}" style="display:inline-block; background-color:#28a745; color:#ffffff; text-decoration:none; padding:10px 20px; margin-top:20px; border-radius:4px; font-family: Arial, sans-serif;">Verify Email</a>
            </td>
        </tr>
        
        <tr>
            <td style="text-align:center; padding:20px; background-color:#e9ecef;">
                <p style="font-size:14px; font-family: Arial, sans-serif; color:#666666;">© 2023 CA. All Rights Reserved.</p>
                <p style="font-size:14px; font-family: Arial, sans-serif; color:#666666;">Rudhram Saraswat</p>
            </td>
        </tr>
    </table>
</body>`
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent successfully: ' + info.response);
            }
        });
    } catch (error) {
        console.log(error);
    }

}


const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!regex.test(password)) {
        return res.status(400).json({ msg: 'Password must contain at least one lowercase letter, one uppercase letter, and one digit.' });
    }

    try {
        const re = await Users.find({ email });
        if (re.length > 0)
            return res.status(400).json({ msg: 'User already exists' });
        else {
            const newUser = new Users({
                name,
                email,
                password: await bcrypt.hash(password, 10),
            });

            try {
                const token = generateToken(newUser._id);
                const savedUser = await newUser.save();
                sendVerifyMail(email, savedUser._id);

                res.status(200).json({ msg: "Account Created! Please verify your email" });

            } catch (err) {
                res.status(400).json({ err });
            }
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};

const verify = async (req, res) => {

    const { id } = req.query;
    try {
        const re = await Users.find({ _id: id });
        if (re.length === 0) {
            return res.status(400).json({ msg: 'User does not exist' });
        } else {
            try {
                const updatedUser = await Users.findByIdAndUpdate(id, { isAuthenticated: true });
                res.redirect(`https://chat-app-rs.netlify.app/login`);
            } catch (err) {
                res.redirect(`https://chat-app-rs.netlify.app/login`);
            }
        }
    } catch (err) {
        res.redirect(`https://chat-app-rs.netlify.app/login`);
    }
};

const verifyPassword = async (req, res) => {
    const { id } = req.query;
    try {
        const tokenToId = jwt.verify(id, process.env.JWT_SECRET);
        const re = await Users.find({ _id: tokenToId.id });
        if (re.length === 0) {
            return res.status(400).json({ msg: 'User does not exist' });
        } else {
            try {
                res.redirect(`https://chat-app-rs.netlify.app/updatePassword/${id}`);
            } catch (err) {
                res.redirect(`https://chat-app-rs.netlify.app/404`);
            }
        }
    } catch (err) {
        res.redirect(`https://chat-app-rs.netlify.app/login`);
    }
}

        

const login = async (req, res) => {
    const { email, password } = req.body;


    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const re = await Users.find({ email });
        if (!re[0].isAuthenticated) {
            return res.status(400).json({ msg: "Please verify your email" })
        }
        if (re.length === 0)
            return res.status(400).json({ msg: 'Invalid credentials' });
        else {
            const isMatch = await bcrypt.compare(password, re[0].password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            else {
                const token = generateToken(re[0]._id);
                res.status(200).json({
                    user: {
                        id: re[0]._id,
                        email: re[0].email,
                        name: re[0].name,
                        profilePic: re[0].profilePic,
                        token: token
                    }
                });

            }
        }
    } catch (err) {
        console.log(err)
        res.status(400).json({ err });
    }
};


// /api/users?search=name
const searchUser = async (req, res) => {
    const { search } = req.query;
    let result = [];
    if (search) {
        result = await Users.find({
            name: { $regex: search, $options: 'i' },
            _id: { $ne: req.user._id },
            isAuthenticated: { $ne: false },
        }).select('-password');
    } else {
        result = await Users.find({
            _id: { $ne: req.user._id },
            isAuthenticated: { $ne: false }
          }).select('-password');
    }
    res.status(200).json(result);
};


// all users
const allUsers = async (req, res) => {
    try {
        // in this it should return all the users except the logged in user
        const users = await Users.find({
            _id: { $ne: req.user._id },
            isAuthenticated: { $ne: false }
          }).select('-password');
          
        res.status(200).json(users);
    } catch (err) {
        res.status(400).json(err);
    }
};

//upload Img
const uploadImg = async (req, res) => {
    try {
        const { file } = req;
        if (!file) return res.status(400).json({ msg: 'No image uploaded' });
        const s3Url = await uploadToS3({ file, userId: req.user._id });

        const user = await Users.findByIdAndUpdate(req.user._id, { profilePic: s3Url }, { new: true });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

// update Name
const updateName = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name) return res.status(400).json({ msg: 'No name entered' });
        if (name[0] === ' ') return res.status(400).json({ msg: 'enter valid name' });
        const user = await Users.findByIdAndUpdate(req.user._id, { name }, { new: true });
        res.status(200).json(user);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
}

// update Password
const updatePassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ msg: 'No email entered' });
        const findEmail = await Users.findOne({ email });
        if (!findEmail) return res.status(400).json({ msg: 'Email not found' });
        forgotEmailPassword(email, findEmail._id);
        res.status(200).json({ msg: "please check your mail box" });
    } catch (err) {
        res.status(400).json(err);
    }
}

//set password
const setPassword = async (req, res) => {
    try {
        const { id, password } = req.body;
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!regex.test(password)) {
            return res.status(400).json({ msg: 'Password must contain at least one lowercase letter, one uppercase letter, and one digit.' });
        }
    
        // Verify the token and extract the user ID
        const tokenToId = jwt.verify(id, process.env.JWT_SECRET);
        const _id = tokenToId.id;

        const updatedUser = await Users.findOneAndUpdate(
            { _id: _id },
            { $set: { password: await bcrypt.hash(password, 10) } },
            { new: true } // This option returns the modified document
        );

        if (!updatedUser) {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(200).json({ msg: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: "Something went wrong" });
    }
};


// greeting message
const greetingMessage = async (req, res) => {
    try {
        const id = req.body.id;

        const tokenToId = jwt.verify(id, process.env.JWT_SECRET);
        const re = await Users.find({ _id: tokenToId.id });
       
        
        if (re.length === 0) {
            return res.status(400).json({ msg: 'User does not exist' });
        } else {
            try {
                res.status(200).json({msg : `hello ${re[0].name}`});
            } catch (err) {
                res.redirect(`https://chat-app-rs.netlify.app/404`);
            }
        }
    } catch (err) {
        return res.status(400).json({
            msg: "session expired"
        })
    }
}

module.exports = {
    register,
    login,
    searchUser,
    allUsers,
    verify,
    uploadImg,
    updateName,
    updatePassword,
    verifyPassword,
    setPassword,
    greetingMessage
};

