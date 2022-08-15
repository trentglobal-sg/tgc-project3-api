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
  return db.insert('variants', ['product_id', 'variant_image_url', 'variant_thumbnail_url', 'color_code', 'color_name'], ['1', 'https://thumbs.dreamstime.com/b/placeholder-icon-vector-isolated-white-background-your-web-mobile-app-design-placeholder-logo-concept-placeholder-icon-134071364.jpg', 'https://thumbs.dreamstime.com/b/placeholder-icon-vector-isolated-white-background-your-web-mobile-app-design-placeholder-logo-concept-placeholder-icon-134071364.jpg', 'default', 'default']);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
