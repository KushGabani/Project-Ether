let express = require("express");
let path = require("path");
let exec = require("child_process").execFile;
let bodyparser = require("body-parser");
let multer = require("multer");
let app = express();
const port = process.env.PORT || 8888;

let storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./uploaded-data");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

let upload = multer({ storage: storage }).single("uploaded-audio");

app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());

app.use(function (req, res, next) {
  console.log(`${new Date()} - ${req.method} request for ${req.url}`);
  next();
});

app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "static", "Home.html"));
});

app.use(express.static("./static/"));

app.post("/HeartDisease", function (req, res) {
  var spawn = require("child_process").spawn;
  var process = spawn("python", [
    "./heart-disease.py",
    JSON.stringify(req.body),
  ]);

  process.stdout.on("data", function (data) {
    console.log("python script's output");
    let prediction =
      data.toString() == "0"
        ? "Healthy, Nearly No Chances Of Heart Disease"
        : "High Chances of Heart Disease Detected. Visit A Doctor Soon.";
    res.send(prediction);
  });
});

// app.post("/Respiratory/audio", function (req, res) {
//   console.log("Uploading audio");
//   upload(req, res, function(err) {
//     if(err){
//       return res.end("Error uploading file.");
//     }
//   });

//   console.log("passing it to python");
//   var spawn = require("child_process").spawn;
//   var process = spawn("python", [
//     "./resp-disease.py"
//   ]);

//   process.stdout.on("data", function (data) {
//     console.log("Got output from python");
//     res.end(data.toString());
//     console.log(data.toString());
//     });
// });

app.post("/Respiratory/audio", function (req, res) {
  console.log("Uploading audio");
  upload(req, res, function (err) {
    if (err) {
      return res.end("Error uploading file.");
    }
  });

  console.log("File Uploaded Successfully.");
  console.log("passing it to python");
  var spawn = require("child_process").spawn;
  var process = spawn("python", ["./resp-disease.py"]);

  process.stdout.on("data", function (data) {
    console.log("Got output from python");
    res.end(data.toString());
    console.log(data.toString());
  });
});

app.listen(port, function () {
  // exec("VC_redist.x64.exe", function(err, data) {
  //   console.log(err);
  // })
  console.log("Serving static on " + port + "....");
});
