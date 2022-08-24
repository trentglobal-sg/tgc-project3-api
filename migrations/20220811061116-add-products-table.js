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
  return db.createTable('products', {
    id: {
      type: 'int',
      primaryKey: true,
      autoIncrement: true,
      unsigned: true
    },
    product: {
      type: 'string',
      length: 50,
    },
    description: 'text',
    cost: {
      type: 'int',
      unsigned: true
    },
    created_date: 'date',
    product_image_url: {
      type: 'string',
      length: 255
    },
    product_thumbnail_url : {
      type: 'string',
      length: 255
    },
    fit_id:{
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_fits_fk',
        table: 'fits',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    micron_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_microns_fk',
        table: 'microns',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    blend_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_blends_fk',
        table: 'blends',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    activity_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_activities_fk',
        table: 'activities',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    gender_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_genders_fk',
        table: 'genders',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    category_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_categories_fk',
        table: 'categories',
        mapping: 'id',
        rules: {
          onDelete: 'cascade',
          onUpdate: 'restrict'
        }
      }
    },
    brand_id: {
      type: 'int',
      unsigned: true,
      foreignKey: {
        name: 'products_brands_fk',
        table: 'brands',
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
  return null;
};

exports._meta = {
  "version": 1
};
