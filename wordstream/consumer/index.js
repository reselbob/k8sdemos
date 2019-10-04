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

const url = {url: `//${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`};

const winston = require('winston');
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'wordstream-consumer' },
    transports: [
        //
        // - Write to all logs with level `info` and below to `combined.log`
        // - Write all logs error (and below) to `error.log`.
        //
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' })
    ]
});

const client = redis.createClient(url);
logger.info(`Spinning up consumer ${consumerId} for stream ${streamName} at ${new Date()}`);
client.xgroup('CREATE', streamName, streamGroup, '$', function (err) {
    if (err) {
        logger.error(`The group ${streamGroup} exists.`);
    }
    const timeout = setInterval(function () {
        client.xreadgroup('GROUP', streamGroup, consumerId, 'BLOCK', 1000, 'COUNT', 1, 'NOACK',
            'STREAMS', streamName, '>', function (err, stream) {
                if (err) {
                    return console.error(err);
                }
                logger.info(JSON.stringify({consumerId, stream}));
            });

    }, 1000);
});



