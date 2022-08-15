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
  return db.createTable('product_variants', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    stock: {
      type: 'int',
      unsigned: true
    },
    size_id: {
      type: 'int',
      unsigned: true,
      defaultValue: 1,
      foreignKey: {
        name: 'productvariants_sizes_fk',
        table: 'sizes',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    variant_id: {
      type: 'int',
      unsigned: true,
      defaultValue: 1,
      foreignKey: {
        name: 'productvariants_variants_fk',
        table: 'variants',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    }
  })
};

exports.down = function(db) {
  return db.dropTable('product_variants')
};

exports._meta = {
  "version": 1
};
