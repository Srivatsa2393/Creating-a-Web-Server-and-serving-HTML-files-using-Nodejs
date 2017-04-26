//modules required
var http = require('http');
var url = require('url');
var path = require('path');
var fs = require('fs');

//create an array of mime types
var mimeTypes = {
  "html": "text/html",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "png": "image/png",
  "js": "text/javascript",
  "css": "text/css"
};

//create server
http.createServer(function(req,res){
  var uri =  url.parse(req.url).pathname;
  //process.cwd returns the current working directory
  var fileName = path.join(process.cwd(),unescape(uri));
  console.log('Loading'+ uri);
  var stats;

  //A try catch block to determine wheteher the page is present or not
  try{
    stats = fs.lstatSync(fileName);
  }catch(e){
    res.writeHead(404,{'Content-type': 'text/plain'});
    res.write('404 Not found');
    res.end();
    return;
  }

  //to check whether its a file or a directory
  if(stats.isFile()){
    //mimeType gets the extension for us
    var mimeType = mimeTypes[path.extname(fileName).split('.').reverse()[0]]
    res.writeHead(200,{'Content-type': mimeType});

    //create a file stream
    var fileStream = fs.createReadStream(fileName);
    fileStream.pipe(res);
  }else if(stats.isDirectory()){
    res.writeHead(302,{
      'Location': 'index.html'
    });
    res.end();
  }else{
    res.writeHead(500,{'Content-type':'text/plain'});
    res.write('500- Internal Error\n');
    res.end();
  }
}).listen(3000);
