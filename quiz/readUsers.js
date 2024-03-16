const express = require('express')
const router = express.Router();
const path = require('path');
const fs = require('fs');

let users;
fs.readFile(path.resolve(__dirname, '../data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
});

const addMsgToRequest = function (req, res, next) {
  if(users) {
    req.users = users;
    next();
  }
  else {
    return res.json({
      error: {message: 'users not found', status: 404}
    });
  }
}

router.get('/username/:name', (req, res) => {
  let name = req.params;
  let users_with_name = req.users.filter(user => user.username === name);
  if (users_with_name.length === 0) {
    res.send({
      error: {message: `${name} not found`, status: 404}
    });
  } else {
    res.send(users_with_name);
  }
});

module.exports = router;