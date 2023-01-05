const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const MY_TABLE = process.env.MY_TABLE;

exports.handler = async (event, context) => {
    console.log(event, "recieved event")
    let path = event.resource;
    let httpMethod = event.httpMethod;
    let route = httpMethod.concat(" ").concat(path);
    let body;
    let statusCode = 200;
    let data = JSON.parse(event.body);
    try{
        switch(route){
            case "GET /quotes":
                body = await listQuotes();
                break;
            case "POST /quotes":
                body = await saveQuote(data);
                break;
            default:
                throw new Error(`Unsupported route: "${route}"`);
        }
    } catch (e) {
        console.log(e);
        statusCode = 400;
        body = e.message;
    } finally {
        console.log(body);
        body = JSON.stringify(body);
    }
    return sendRes(statusCode, body)
}

async function listQuotes(){
    const params = { TableName: MY_TABLE }
    return await dynamo
        .scan(params)
        .promise()
        .then(res => res.Items);
}

async function saveQuote(data) {
    const time = new Date().getTime().toString();
    const quote = {
        id: time,
        quote: data.quote,
        by: data.by,
    }
    const params = {
        TableName: MY_TABLE,
        Item: quote
    }
    await dynamo.put(params).promise();
    return quote
}



const sendRes = (status, body) => {
    var response = {
        statusCode: status,
        headers: { "Content-Type": "application/json" },
        body
    }
    return response;
}