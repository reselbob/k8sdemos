const redis = require('redis');
const uuidv4 = require('uuid/v4');
const id = uuidv4();
const faker = require('faker');
console.log('I am producer');

const streamName = process.env.WORDSTREAM_STREAM_NAME || 'WORDSTREAM';
const streamGroup = process.env.WORDSTREAM_CONSUMER_GROUP || 'WORDSTREAM_GROUP';
process.env.REDIS_PORT = process.env.REDIS_PORT || 6379; //yeah, it's a hack
process.env.REDIS_HOST = process.env.REDIS_HOST || 'localhost'; //yeah, it's a hack
process.env.REDIS_PWD = process.env.REDIS_PWD || 'none'; //yeah, it's a hack;

const url = {url: `//${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`};
const producer = redis.createClient(url);
/*
To get docker up and running in an environment in which Docker is installed:

docker run -d --name redis-master -p 6379:6379 redis

 */
producer.xgroup('CREATE', streamName, streamGroup, '$', function (err) {
    if (err) {
        console.error(`The group ${streamGroup} exists.`);
    }
    console.log(`Under stream: ${streamName} created group: ${streamGroup}`);
    const timeout = setInterval(function () {
        const fieldName = 'Word';
        const str = `${faker.random.words(1)} : ${new Date()}`;
        producer.xadd(streamName, '*', fieldName, str, function (err) {
            console.log(`Adding message: ${str} to field: ${fieldName} at stream: ${streamName}`);
            if (err) {
                console.error(err);
            }
        });
    }, 1000);
});

