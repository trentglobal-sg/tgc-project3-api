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
  const fits = [
    {
      fit: 'Slim Fit',
      description: 'A close-to-body fit designed to reduce bulk and provide excellent layering under mid and outer layers.'
    },
    {
      fit: 'Regular Fit',
      description: 'A traditional fit that offers comfort and ease of movement, suitable for most body types.'
    },
    {
      fit: 'Relaxed Fit',
      description: 'A looser cut providing extra room for layering or for a casual, laid-back style.'
    },
    {
      fit: 'Athletic Fit',
      description: 'Slightly tapered at the waist with broader shoulders, designed for active movement.'
    },
    {
      fit: 'Compression Fit',
      description: 'A very tight fit used for performance wear to support muscles and reduce fatigue.'
    }
  ];

  for (const f of fits) {
    await db.insert('fits', ['fit', 'fit_description'], [f.fit, f.description]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM fits WHERE fit IN ('Slim Fit', 'Regular Fit', 'Relaxed Fit', 'Athletic Fit', 'Compression Fit');"
  );
};

exports._meta = {
  "version": 1
};
