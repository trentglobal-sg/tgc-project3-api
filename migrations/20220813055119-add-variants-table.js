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
  return db.createTable('variants', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned:true
    },
    stock: {
      type: 'int',
      unsigned: true,
    },
    variant_image_url: {
      type: 'string',
      length: 255
    },
    variant_thumbnail_url: {
      type: 'string',
      length: 255
    },
    color_code: {
      type: 'string',
      length: 20,
    },
    color_name: {
      type: 'string',
      length: 50
    },
    product_id: {
      type: 'int',
      unsigned: true,
      defaultValue: 1,
      foreignKey: {
        name: 'variants_products_fk',
        table: 'products',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    size_id: {
      type: 'int',
      unsigned: true,
      defaultValue: 1,
      foreignKey: {
        name: 'variants_sizes_fk',
        table: 'sizes',
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
  return db.dropTable('variants');
};

exports._meta = {
  "version": 1
};
