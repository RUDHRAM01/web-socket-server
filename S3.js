const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { v4: uuid } = require('uuid');

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
});
const Bucket = process.env.BUCKET;

const uploadToS3 = async ({ file, userId }) => {
    const fileName = `${userId}/${uuid()}`;
    const uploadParams = {
        Bucket,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
    };
    try {
        await s3.send(new PutObjectCommand(uploadParams));
        const s3Url = `https://${Bucket}.s3.amazonaws.com/${fileName}`;  
        return s3Url;
    } catch (err) {
        console.log(err);
    }
};

module.exports = uploadToS3;
