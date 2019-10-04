/*
To get docker up and running in an environment in which Docker is installed:

docker run -d --name redis-master -p 6379:6379 redis

 */
const redis = require('redis');
const uuidv4 = require('uuid/v4');
const consumerId = uuidv4();

const streamName = process.env.WORDSTREAM_STREAM_NAME || 'WORDSTREAM';
const streamGroup = process.env.WORDSTREAM_CONSUMER_GROUP || 'WORDSTREAM_GROUP';

process.env.REDIS_PORT = process.env.REDIS_PORT || 6379; //yeah, it's a hack
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost'; //yeah, it's a hack
process.env.REDIS_PWD = process.env.REDIS_PWD || 'none'; //yeah, it's a hack;

//const url = {url: `//${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`};
const client = redis.createClient(process.env.REDIS_PORT,process.env.REDIS_HOST);
//const client = redis.createClient(url);
console.log(`Spinning up consumer ${consumerId} for stream ${streamName} at ${new Date()}`);

const timeout = setInterval(function () {
    client.xgroup('CREATE', streamName, streamGroup, '$', function (err) {
        if (err) {
           if(!err.message.includes('BUSYGROUP')){
               console.error(err.message)
           }
        }
        client.xreadgroup('GROUP', streamGroup, consumerId, 'BLOCK', 1000, 'COUNT', 1, 'NOACK',
            'STREAMS', streamName, '>', function (err, stream) {
                if (err) {
                    return console.error(err);
                }
                console.log(JSON.stringify({consumerId, stream}));
            });
    });
}, 1000);

