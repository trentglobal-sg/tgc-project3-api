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
  const microns = [
    {
      micron: '17.5 micron',
      description: 'Ultra-fine merino wool, extremely soft and typically used for next-to-skin garments like underwear and base layers.'
    },
    {
      micron: '18.5 micron',
      description: 'Fine merino wool, soft and versatile, commonly used for base layers and lightweight clothing.'
    },
    {
      micron: '19.5 micron',
      description: 'Standard merino wool for a balance of softness and durability, used in mid layers and casual wear.'
    },
    {
      micron: '20.5 micron',
      description: 'Slightly coarser merino for outer layers or garments where extra durability is preferred.'
    },
    {
      micron: '21 micron',
      description: 'More robust merino wool often used in heavy-duty or blended garments where durability is prioritized.'
    }
  ];

  for (const m of microns) {
    await db.insert('microns', ['micron', 'micron_description'], [m.micron, m.description]);
  }
};

exports.down = function(db) {
  return db.runSql(
    "DELETE FROM microns WHERE micron IN ('17.5 micron', '18.5 micron', '19.5 micron', '20.5 micron', '21 micron');"
  );
};

exports._meta = {
  "version": 1
};
