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
  return db.createTable('order_items', {
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
        name: 'orderitems_productvariants_fk',
        table: 'product_variants',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    order_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'orderitems_orders_fk',
        table: 'orders',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    quantity: {
      type: 'int',
      unsigned: true
    }
  })
};

exports.down = function(db) {
  return db.dropTable('order_items')
};

exports._meta = {
  "version": 1
};
