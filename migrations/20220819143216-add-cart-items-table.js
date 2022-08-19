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
  return db.createTable('cart_items', {
    id: {
      type:'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    product_variant_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'cartitems_productvariants_fk',
        table: 'product_variants',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    customer_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'cartitems_customers_fk',
        table: 'customers',
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
  return db.dropTable('cart_items');
};

exports._meta = {
  "version": 1
};
