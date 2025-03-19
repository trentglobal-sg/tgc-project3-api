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
  const brands = [
    {
      brand: 'Icebreaker',
      description: 'New Zealand-based brand known for high-quality merino wool outdoor and lifestyle clothing.',
      logo: 'https://example.com/logos/icebreaker.png'
    },
    {
      brand: 'Smartwool',
      description: 'American brand producing merino wool socks and apparel for outdoor sports and everyday wear.',
      logo: 'https://example.com/logos/smartwool.png'
    },
    {
      brand: 'Minus33',
      description: 'New Hampshire-based brand focused on merino wool base layers and outdoor gear.',
      logo: 'https://example.com/logos/minus33.png'
    },
    {
      brand: 'Woolx',
      description: 'Premium merino wool clothing brand offering base layers and activewear.',
      logo: 'https://example.com/logos/woolx.png'
    },
    {
      brand: 'Ortovox',
      description: 'German brand combining merino wool and technical materials for alpine safety and apparel.',
      logo: 'https://example.com/logos/ortovox.png'
    }
  ];

  for (const b of brands) {
    await db.insert('brands', ['brand', 'brand_description', 'brand_logo_url'], [
      b.brand,
      b.description,
      b.logo
    ]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM brands WHERE brand IN ('Icebreaker', 'Smartwool', 'Minus33', 'Woolx', 'Ortovox');"
  );
};

exports._meta = {
  "version": 1
};
