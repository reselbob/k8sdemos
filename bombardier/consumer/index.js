/*
To get docker up and running in an environment in which Docker is installed:

docker run -d -p 6379:6379 redis

 */
const redis = require('redis');
const client = redis.createClient();
const uuidv4 = require('uuid/v4');
const consumerId = uuidv4();

const streamName = process.env.BOMBARDIER_STREAM_NAME || 'BOMBARDIER';
const streamGroup = process.env.BOMBARDIER_CONSUMER_GROUP || 'BOMBARDIER_GROUP';

console.log(`Spinning up consumer ${consumerId} for stream ${streamName}`);

const timeout = setInterval(function () {
    client.xreadgroup('GROUP', streamGroup, consumerId, 'BLOCK', 1000, 'COUNT', 1, 'NOACK',
        'STREAMS', streamName, '>', function (err, stream) {
            if (err) {
                return console.error(err);
            }
            console.log(JSON.stringify({consumerId, stream}));
        });

}, 1000);


