'use strict';
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();

const calcTable = process.env.CALC_TABLE;

function response(statusCode, message) {
  return {
    statusCode: statusCode,
    body: JSON.stringify(message)
  };
}

module.exports.saveCalc = (event, context, callback) => {
  const request = JSON.parse(event.body);
  const { inputX, inputY, optr, outcome } = request;
  const params = {
    TableName: calcTable,
    Key: {
      id: '1'
    },
    UpdateExpression: 'set inputX = :inputX, inputY = :inputY, optr = :optr, outcome = :outcome',
    ExpressionAttributeValues: {
      ':inputX': inputX,
      ':inputY': inputY,
      ':optr': optr,
      ':outcome': outcome
    },
    ReturnValues: 'UPDATED_NEW'
  }

  return db
    .update(params)
    .promise()
    .then((res) => {
      console.log(res);
      callback(null, response(200, res.Attributes));
    })
    .catch((err) => callback(null, response(err.statusCode, err)));
}

module.exports.getCalc = (event, context, callback) => {
  const params = {
    TableName: calcTable,
    Key: {
      id: '1'
    }
  }

  return db
    .get(params)
    .promise()
    .then((res) => {
      if (res.Item) callback(null, response(200, res.Item));
      else callback(null, response(404, { error: 'Calc data not found.' }));
    })
    .catch((err) => callback(null, response(err.statusCode, err)))
}