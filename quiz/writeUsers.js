const express = require('express')
const fs = require('fs');
const path = require('path');
const router = express.Router()

router.use(express.json());
router.use(express.urlencoded({extended: true}));

let users;
fs.readFile(path.resolve(__dirname, './data/users.json'), function(err, data) {
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
})

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

};

router.use(addMsgToRequest);

router.post('/adduser', (req, res) => {
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
});

module.exports = router;