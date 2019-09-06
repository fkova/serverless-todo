var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-east-2",
    //endpoint: "http://localhost:8000"
});

var docClient = new AWS.DynamoDB.DocumentClient();

/*
myService.readAllTodo().then(
    result => console.log(result)
);
*/
(async () => {
    const res = await docClient.scan({TableName: 'myTodoTable'}).promise()
    
    console.log(res);
})()
