const express = require('express');
const fs = require('fs');
const app = express();
const cors = require('cors');
app.use(cors());

// Stream file memory-efficiently using createReadStream
app.get("/memoryInclusive", function(req, res) {
    console.log("Reading file from SSD");

    const fileStream = fs.createReadStream("mentor.zip");
    
    fileStream.on('open', function () {
        res.setHeader('Content-Type', 'application/zip');
        fileStream.pipe(res);
    });
    
    fileStream.on('error', function(err) {
        console.error(err);
        res.status(500).send("File not found or internal error.");
    });
});

// Simple video streaming endpoint with readStream
app.get("/streamfile", function(req, res) {
    console.log("File readStream Created");
    
    const videoStreamInstance = fs.createReadStream("1.mp4");
    
    // Set proper headers
    res.writeHead(200, {
        "Content-Type": "video/mp4"
    });
    
    // Pipe video file stream to response
    videoStreamInstance.pipe(res);

    // Handle stream errors
    videoStreamInstance.on('error', (err) => {
        console.error("Error streaming file: ", err);
        res.status(500).send("File not found or error reading file.");
    });
});

// Video streaming with range requests for partial content delivery
app.get("/rangestreaming", function(req, res) {
    const range = req.headers.range;

    if (!range) {
        return res.status(400).send("Range header is required for streaming");
    }

    console.log("Range requested:", range);

    const videoPath = "1.mp4";
    const videoSize = fs.statSync(videoPath).size;

    // Parse Range header (e.g. bytes=0-499)
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : videoSize - 1;

    if (start >= videoSize) {
        res.status(416).send("Requested range not satisfiable");
        return;
    }

    const chunkSize = (end - start) + 1;
    const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunkSize,
        "Content-Type": "video/mp4"
    };

    console.log("Sending chunk", { start, end, chunkSize });

    // Write partial content header and pipe the specific file range
    res.writeHead(206, headers);
    const fileStream = fs.createReadStream(videoPath, { start, end });

    fileStream.pipe(res);

    // Handle stream errors
    fileStream.on('error', (err) => {
        console.error("Error streaming file:", err);
        res.status(500).send("File not found or error reading file.");
    });
});

// Start the server
app.listen(3000, function() {
    console.log("Server running at port no 3000");
});
