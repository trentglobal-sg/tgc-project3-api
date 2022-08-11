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

exports.up = function(db) {
  return db.createTable('fits', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    fit: {
      type: 'string',
      length: 50,
    },
    fit_description: {
      type: 'text'
    }
  })
};

exports.down = function(db) {
  return db.dropTable('fits');
};

exports._meta = {
  "version": 1
};
