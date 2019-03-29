const AWS = require('aws-sdk');

const config = new AWS.Config({
	accessKeyId: process.env.ACCESS_KEY_ID,
	secretAccessKey: process.env.SECRET_ACCESS_KEY,
	region: process.env.REGION
});

AWS.config.update(config);

const s3 = new AWS.S3({apiVersion: '2006-03-01'});

// 1519091834.jpg

exports.handler = (event, context, callback) => {
	
	const key = event.queryStringParameters.key;
	const bucket = process.env.BUCKET;
	const params = {
		Key: key,
		Bucket: bucket
	};

	s3.deleteObject(params, (err, data) => {
		if (err) return callback(new Error([err.statusCode], [err.message]));

		callback(null, {
			statusCode: '200',
			headers: {'Access-Control-Allow-Origin': '*'},
			body: JSON.stringify({'data': data})
		});
	});
};