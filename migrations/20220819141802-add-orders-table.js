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
  return db.createTable('orders', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    order_status_id:{
      type: 'int',
      unsigned: true,
      defaultValue: 1,
      foreignKey: {
        name: 'orders_orderstatus_fk',
        table: 'order_status',
        mapping: 'id',
        rules : {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    customer_id: {
      type: 'int',
      unsigned: true,
      defaultValue: 1,
      foreignKey: {
        name: 'orders_customers_fk',
        table: 'customers',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    order_date: 'date',
    updated_date: 'date',
    remarks: 'text',
    payment_intent: {
      type: 'string',
      length: 100
    },
    total_amount: {
      type: 'int',
      unsigned: true
    },
    payment_mode: {
      type: 'string',
      length: 50
    },
    receipt_url: {
      type: 'string',
      length: 255
    },
    shipping_type: {
      type: 'string',
      length: 50
    },
    shipping_amount: {
      type: 'int',
      unsigned: true
    },
    shipping_address_line1: {
      type: "string",
      length: 100
    },
    shipping_address_line2: {
      type: 'string',
      length: 100
    },
    shipping_postal_code: {
      type: 'string',
      length: 10
    },
    shipping_country: {
      type: 'string',
      length: 50
    }
  })
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
