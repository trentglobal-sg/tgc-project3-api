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
  const blends = [
    {
      blend: '100% Merino Wool',
      description: 'Pure merino wool, soft and naturally odor-resistant. Best for warmth and comfort.'
    },
    {
      blend: 'Merino Wool / Nylon',
      description: 'Merino wool blended with nylon for added durability and longevity, ideal for activewear.'
    },
    {
      blend: 'Merino Wool / Polyester',
      description: 'A lightweight and breathable blend for moisture-wicking and quick-drying performance.'
    },
    {
      blend: 'Merino Wool / Spandex',
      description: 'Merino wool with added stretch for enhanced mobility and comfort during high-output activities.'
    },
    {
      blend: 'Merino Wool / Tencel',
      description: 'Soft blend combining merino with Tencel fibers for better temperature regulation and softness.'
    }
  ];

  for (const b of blends) {
    await db.insert('blends', ['blend', 'blend_description'], [b.blend, b.description]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM blends WHERE blend IN ('100% Merino Wool', 'Merino Wool / Nylon', 'Merino Wool / Polyester', 'Merino Wool / Spandex', 'Merino Wool / Tencel');"
  );
};

exports._meta = {
  "version": 1
};
