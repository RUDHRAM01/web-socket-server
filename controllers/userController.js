const Users = require('../models/UserModel');
const bcrypt = require('bcrypt');
const { generateToken } = require('../db/token');
const register = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    if (password.length < 6) {
        return res
            .status(400)
            .json({ msg: 'Password must be at least 6 characters' });
    }

    try {
        const re = await Users.find({ email });
        if (re.length > 0)
            return res.status(400).json({ msg: 'User already exists' });
        else {
            const hashPass = await bcrypt.hash(password, 10);
            const newUser = new Users({
                email,
                password : hashPass
            });
           
            
            try {
                const savedUser = await newUser.save();
                res.status(200).json(
                    {
                        user: {
                            id: savedUser._id,
                            email: savedUser.email,
                            token: generateToken(savedUser._id)
                        }
                    }
                );
            } catch (err) {
                console.log(err);
            }
           
        }
    } catch (err) {
        res.status(400).json({ err });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password);
    
    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    try {
        const re = await Users.find({ email });
        if (re.length === 0)
            return res.status(400).json('User does not exist');
        else {
            const isMatch = await bcrypt.compare(password, re[0].password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });
            else {
                console.log("d");
                
                res.status(200).json(
                    {
                        user: {
                            id: re[0]._id,
                            email: re[0].email,
                            token: generateToken(re[0]._id)
                        }
                    }
                    
                );
            }
        }
    } catch (err) {
        console.log(err);
    }
};

// /api/users?search=name
const allUser = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { email: { $regex: req.query.search, $options: 'i' } },
            // { email: { $regex: req.query.search, $options: 'i' } }
        ]
    } : {};

    const result = await Users.find(keyword).find({ _id: { $ne: req.user.id } });
    res.status(200).json(result);
};


module.exports = {
    register,
    login,
    allUser
};

