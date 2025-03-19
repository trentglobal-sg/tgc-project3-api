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
  const activities = [
    'Hiking',
    'Running',
    'Skiing',
    'Snowboarding',
    'Travel',
    'Casual Wear',
    'Hunting',
    'Cycling',
    'Climbing'
  ];

  for (const activity of activities) {
    await db.insert('activities', ['activity'], [activity]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM activities WHERE activity IN ('Hiking', 'Running', 'Skiing', 'Snowboarding', 'Travel', 'Casual Wear', 'Hunting', 'Cycling', 'Climbing');"
  );
};

exports._meta = {
  "version": 1
}
