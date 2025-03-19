'use strict';

var dbm;
var type;
var seed;

exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = async function(db) {
  const sizes = [
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'XXL'
  ];

  for (const size of sizes) {
    await db.insert('sizes', ['size'], [size]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM sizes WHERE size IN ('XS', 'S', 'M', 'L', 'XL', 'XXL');"
  );
};

exports._meta = {
  "version": 1
};
