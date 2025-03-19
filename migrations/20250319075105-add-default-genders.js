'use strict';

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

exports.up = async function(db) {
  await  db.insert('genders', ['gender'], ['Unisex']);
  await  db.insert('genders', ['gender'], ['Male']);
  return db.insert('genders', ['gender'], ['Female']);
};

exports.down = function(db) {
  return db.runSql('DELETE FROM genders');
};

exports._meta = {
  "version": 1
};
