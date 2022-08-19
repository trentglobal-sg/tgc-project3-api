'use strict';
const crypto = require('crypto')
const getHashedPassword = (password) => {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash
}
const password = getHashedPassword('customer');

var async = require('async');
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

exports.up = async function(db){
    await db.insert('order_status', ['order_status'], ['Paid']);
    await db.insert('order_status', ['order_status'], ['Preparing Order']);
    await db.insert('order_status', ['order_status'], ['Shipped']);
    await db.insert('order_status', ['order_status'], ['Out for Delivery']);
    await db.insert('order_status', ['order_status'], ['Delivered']);
    await db.insert('order_status', ['order_status'], ['Cancelled']);
    await db.insert('order_status', ['order_status'], ['Refunded']);
    await db.insert('customers', ['username', 'first_name', 'last_name', 'email', 'password', 'contact_number', 'created_date'], ['customer', 'customer', 'test', 'customer@email.com', password, '1234567', '2022-08-19'])
    return
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
