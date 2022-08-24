'use strict';
const crypto = require('crypto')
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash
}
const password = getHashedPassword('admin')

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.insert('users', ['username', 'email', 'password', 'role_id'], ['admin', 'admin@email.com', password, '1'])
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
