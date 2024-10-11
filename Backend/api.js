const express = require('express');
const fs= require('fs');
const app= express();
const cors= require('cors');
app.use(cors());

app.get("/memoryInclusive",function(req, res){
    console.log("Reading file from SSD");
    const fileContent  = fs.readFileSync("mentor.zip");
    console.log("Read is completed");
    res.send(fileContent);
})

app.get("/streamfile", function(req, res){
    console.log("File readStream Created");
    const videoStreamInstance= fs.createReadStream("1.mp4");
    //request, response -> streams
    //request -> readable stream
    //response -> writable stream
    res.writeHead(200,{
        "Content-Type":"video/mp4"
    })
    videoStreamInstance.pipe(res);
})


app.listen(3000, function(){
    console.log("Server running at port no 3000");
})