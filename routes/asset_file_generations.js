var express = require("express");
var router = express.Router();
const { spawn } = require("child_process");

var fs = require("fs");
const ipfsAPI = require("ipfs-api");
const ipfs = ipfsAPI("ipfs.infura.io", "5001", { protocol: "https" });

router
    .route("/neural-style-transfer-art-generation")
    .get(async (req, res, next) => {
        const pyProg = spawn("python", [
            "./generative_models/neural-style-transfer-art-gen-script.py",
            req.query.contentHash,
            req.query.styleHash,
        ]);

        pyProg.stdout.on("data", async function (data) {
            const assetFilePath = data.toString().slice(0, -2);
            var assetFileData = {
                path: assetFilePath,
                content: fs.readFileSync(assetFilePath),
            };

            try {
                console.log("Uploading...");

                const file = await ipfs.files.add(assetFileData);

                console.log(file[0].hash);

                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(file[0].hash);
            } catch (error) {
                next(error);
            }
        });
    });

module.exports = router;
