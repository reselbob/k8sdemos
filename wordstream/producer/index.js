const redis = require('redis');
const faker = require('faker');
const async = require('async');
const uuidv4 = require('uuid/v4');
const id = uuidv4();


process.env.REDIS_PORT = process.env.REDIS_PORT || 6379; //yeah, it's a hack
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost'; //yeah, it's a hack
process.env.REDIS_PWD = process.env.REDIS_PWD || 'none'; //yeah, it's a hack;

//const url = {url: `//${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`};
const producer = redis.createClient(process.env.REDIS_PORT, process.env.REDIS_HOST);

/*
To get docker up and running in an environment in which Docker is installed:

docker run -d --name redis-master -p 6379:6379 redis

 */
const streamName = process.env.WORDSTREAM_STREAM_NAME || 'WORDSTREAM';
const streamGroup = process.env.WORDSTREAM_CONSUMER_GROUP || 'WORDSTREAM_GROUP';
console.log(`Spinning up producer ${id} for stream ${streamName} at ${new Date()}`);
async.forever(
    function (next) {
        const fieldName = 'Word';
        const str = `${faker.random.words(1)} : ${new Date()}`;
        producer.xgroup('CREATE', streamName, streamGroup, '$', function (err) {
            if (err && !err.message.includes('BUSYGROUP') && !err.message.includes('ERR The XGROUP subcommand requires the key to exist')) {
                console.error(err.message);
            }
            producer.xadd(streamName, '*', fieldName, str, function (err) {
                console.log(`Producer ${id} is adding message: ${str} to field: ${fieldName} at stream: ${streamName}`);
                next();
            })
        })
    },
    function (err) {
        if (!err.message.includes('BUSYGROUP')) {
            err.isShuttingDown = true;
            console.error(err.message);
            process.exit(9)
        }
    }
);

