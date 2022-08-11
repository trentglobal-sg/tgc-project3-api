const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName: 'products',
    brand(){
        return this.belongsTo('Brand')
    },
    category(){
        return this.belongsTo('Category')
    },
    gender(){
        return this.belongsTo('Gender')
    },
    activity(){
        return this.belongsTo('Activity')
    },
    blend(){
        return this.belongsTo('Blend')
    },
    micron(){
        return this.belongsTo('Micron')
    },
    fit(){
        return this.belongsTo('Fit')
    }
});

const Brand = bookshelf.model('Brand', {
    tableName: 'brands',
    product(){
        return this.hasMany('Product')
    }
});

const Category = bookshelf.model('Category', {
    tableName: 'categories',
    product(){
        return this.hasMany('Product')
    }
});

const Gender = bookshelf.model('Gender', {
    tableName: 'genders',
    product(){
        return this.hasMany('Product')
    }
});

const Activity = bookshelf.model('Activity', {
    tableName: 'activities',
    product(){
        return this.hasMany('Product')
    }
});

const Blend = bookshelf.model('Blend', {
    tableName: 'blends',
    product(){
        return this.hasMany('Product')
    }
});

const Micron = bookshelf.model('Micron', {
    tableName: 'microns',
    product(){
        return this.hasMany('Product')
    }
});

const Fit = bookshelf.model('Fit', {
    tableName: 'fits',
    product(){
        return this.hasMany('Product')
    }
})

module.exports = {Product, Brand, Category, Gender, Activity, Blend, Micron, Fit}