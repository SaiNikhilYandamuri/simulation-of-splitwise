const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const bucketName = "splitwise-images-sainikhilyandamuri";
const region = "us-east-2";
const accessKeyId = "AKIAYALWAOVHKDKSWET3";

const secretAccessKey = "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";

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename + ".jpg",
    ACL: "public-read",
    ContentType: "image/png",
  };

  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
