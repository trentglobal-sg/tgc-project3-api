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
  const categories = [
    'Base Layers',
    'Mid Layers',
    'Socks',
    'Underwear',
    'Outerwear',
    'Accessories'
  ];

  for (const category of categories) {
    await db.insert('categories', ['category'], [category]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM categories WHERE category IN ('Base Layers', 'Mid Layers', 'Socks', 'Underwear', 'Outerwear', 'Accessories');"
  );
};

exports._meta = {
  "version": 1
};
