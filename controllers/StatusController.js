const uploadToS3 = require('../S3');
const Status = require('../models/StatusModel');
const Chats = require('../models/ChatModel')
// create a new status

const createStatus = async (req, res) => {
    const { file, body } = req;
    const { color, content } = body;
  
    if (!file || !color) {
        return res.status(400).json({ msg: 'All fields are required' });
    }
    const userId = req.user._id;
    try {
        // Set expiration date to one day from now
        const expirationDate = new Date(+new Date() + 1 * 24 * 60 * 60 * 1000);
        const s3Url = await uploadToS3({ file, userId: req.user._id });
        const status = await Status.create({ imageUrl: s3Url, color, userId, content, expirationDate });
        return res.status(200).json({ msg: "Status created successfully" });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
  };
  

  // get all status
  const getAllStatus = async (req, res) => {
    try {
        const currentDate = new Date();
        const friend = await Chats.aggregate([
            { $match: { users: req.user._id } },
            { $unwind: '$users' },
            {
                $group: {
                    _id: null,
                    friends: { $addToSet: '$users' } // Use $addToSet to ensure unique values
                }
            },
            { $project: { _id: 0 } },
        ]);        
        const friends = friend[0]?.friends;
        const status = await Status.find({
           userId: { $in: friends },
            expirationDate: { $gte: currentDate },
        }).populate('userId', 'name profilePic').select('-expirationDate -updatedAt -__v');
        // create a code in which we have to send same userids status in one array
        const statusObj = [];
        status.forEach((data) => {
            const index = statusObj.findIndex((obj) => obj.userId._id.toString() === data.userId._id.toString());
            if (index === -1) {
                statusObj.push({ userId: data.userId, status: [data] });
                if (statusObj[statusObj.length - 1].userId._id.toString() === req.user._id.toString()) {
                    const temp = statusObj[0];
                    statusObj[0] = statusObj[statusObj.length - 1];
                    statusObj[statusObj.length - 1] = temp;
                }
            } else {
                statusObj[index].status.push(data);   
            }
        })

        return res.status(200).json( statusObj );
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};


module.exports = {
    createStatus,
    getAllStatus
}