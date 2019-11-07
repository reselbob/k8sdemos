//This is a simple app the report a color
//as defined by the environment variable, COLOR_ECHO_COLOR

const http = require('http');
const port = process.env.PORT|| 3000;

const color  = process.env.COLOR_ECHO_COLOR || "NO_COLOR";


const handleRequest = function(request, response) {
    const str = JSON.stringify({color, date: new Date()}, null, 4);
    response.writeHead(200);
    response.end(str);
    console.log(str);
};

const server = http.createServer(handleRequest);
server.listen(port, ()=>{
    console.log(`Listening on port ${port}, started at : ${new Date()}`);
});