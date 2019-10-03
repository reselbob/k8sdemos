/*
To get docker up and running in an environment in which Docker is installed:

docker run -d -p 6379:6379 redis

 */
console.log('I am consumer');

const redis = require('redis');
const client1 = redis.createClient();
const client2 = redis.createClient();
const client3 = redis.createClient();

let c = 0;
const timeout = setInterval(function () {
    client1.xadd('mystream', '*', 'field1', 'm1', function (err) {
        if (err) {
            return console.error(err);
        }
        client1.xgroup('CREATE', 'mystream', 'mygroup', '$', function (err) {
            if (err) {
                //return console.error(err);
                //console.error(err);
            }
        });

        client2.xreadgroup('GROUP', 'mygroup', 'consumer', 'Block', 1000, 'NOACK',
            'STREAMS', 'mystream', '>', function (err, stream) {
                if (err) {
                    return console.error(err);
                }
                console.log('client2 ' + stream);
            });

        client3.xreadgroup('GROUP', 'mygroup', 'consumer', 'Block', 1000, 'NOACK',
            'STREAMS', 'mystream', '>', function (err, stream) {
                if (err) {
                    return console.error(err);
                }
                console.log('client3 ' + stream);
            });


        client1.xadd('mystream', '*', 'field1', 'm2', function (err) {
            if (err) {
                return console.error(err);
            }
        });

        client1.xadd('mystream', '*', 'field1', 'm3', function (err) {
            if (err) {
                return console.error(err);
            }
        });

    });
    c++;
    if (c > 100) {
        clearInterval(timeout);
    }
}, 1000);


