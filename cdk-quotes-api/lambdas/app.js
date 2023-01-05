const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const MY_TABLE = process.env.MY_TABLE;

exports.handler = async (event, context) => {
    console.log(event, "recieved event")
    return sendRes(200, "Hello World")
}



const sendRes = (status, body) => {
    var response = {
        statusCode: status,
        headers: { "Content-Type": "application/json" },
        body
    }
    return response;
}