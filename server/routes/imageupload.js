const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const Users = require("../model/Users");
const fs = require("fs");
var util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const { uploadFile, getFileStream } = require("../services/file-upload");

// const singleUpload= upload.single('image');

router.post(
  "/imageupload/:userid",
  upload.single("file"),
  async function (req, res) {
    try {
      console.log("Inside API");
      console.log(req.file);
      const file = req.file;
      const useremail = req.params.userid;
      console.log(useremail);
      console.log(file.path);
      //console.log(file);

      // apply filter
      // resize

      const result = await uploadFile(file);

      await unlinkFile(file.path);
      console.log("Hello");
      console.log(result);
      console.log(result.Location);

      await Users.findOneAndUpdate(
        { _id: useremail },
        { $set: { photopath: result.Location } }
      );

      console.log("I am here");
      res.status(200).json({ imagepath: result.location });
    } catch (error) {
      res.writeHead(400, { "Content-Type": "text/plain" });
    }
  }
);

router.post("/getimage", async function (req, res) {
  try {
    console.log("Inside Get Image API");
    const useremail = req.body.useremail;
    console.log(useremail);
    const userimage = await User.find({ email: useremail }, { profileImg: 1 });

    res.status(200).json({ imagelink: userimage });
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
  }
});

router.post("/getimageonload", async function (req, res) {
  try {
    console.log("Inside Get Image onload API");
    const useremail = req.body.useremail;
    console.log(useremail);
    const userimage = await User.find({ email: useremail }, { profileImg: 1 });

    res.status(200).json({ imagelink: userimage });
  } catch (error) {
    res.writeHead(400, { "Content-Type": "text/plain" });
  }
});

module.exports = router;
