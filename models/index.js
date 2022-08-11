const bookshelf = require('../bookshelf')

const Category = bookshelf.model('Category',{
    tableName: 'categories'
})

module.exports = {Category}