const bookshelf = require('../bookshelf')

// PRODUCTS

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
    },
    variant(){
        return this.hasMany('Variant')
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

// VARIANTS

const Variant = bookshelf.model('Variant', {
    tableName: 'variants',
    product(){
        return this.belongsTo('Product')
    },
    product_variant(){
        return this.hasMany('Product_variant')
    }
})

const Size = bookshelf.model('Size',{
    tableName: 'sizes',
    product_variant(){
        return this.hasMany('Product_variant')
    }
})

const Product_variant = bookshelf.model('Product_variant', {
    tableName: 'product_variants',
    size(){
        return this.belongsTo('Size')
    },
    variant(){
        return this.belongsTo('Variant')
    },
    cart_item(){
        return this.hasMany('Cart_item')
    },
    order_item(){
        return this.hasMany('Order_item')
    }
})

const Role = bookshelf.model('Role', {
    tableName: 'roles',
    user(){
        return this.hasMany('User')
    }
})

const User = bookshelf.model('User', {
    tableName: 'users',
    role(){
        return this.belongsTo('Role')
    }
})

const Blacklisted_token = bookshelf.model('Blacklisted_token', {
    tableName: 'blacklisted_tokens'
})

const Order_status = bookshelf.model('Order_status', {
    tableName: 'order_status',
    order(){
        return this.hasMany('Order')
    }
})

const Customer = bookshelf.model('Customer', {
    tableName: 'customers',
    order(){
        return this.hasMany('Order')
    },
    cart_item(){
        return this.hasMany('Cart_item')
    }
})

const Order = bookshelf.model('Order', {
    tableName: 'orders',
    order_status(){
        return this.belongsTo('Order_status')
    },
    customer(){
        return this.belongsTo('Customer')
    },
    order_item(){
        return this.hasMany('Order_item')
    }
})

const Order_item = bookshelf.model('Order_item', {
    tableName: 'order_items',
    order(){
        return this.belongsTo('Order')
    },
    product_variant(){
        return this.belongsTo('Product_variant')
    }
})

const Cart_item = bookshelf.model('Cart_item', {
    tableName: 'cart_items',
    customer(){
        return this.belongsTo('Customer')
    },
    product_variant(){
        return this.belongsTo('Product_variant')
    }
})

module.exports = {Product, 
    Brand, 
    Category, 
    Gender, 
    Activity, 
    Blend, 
    Micron, 
    Fit, 
    Variant, 
    Size, 
    Product_variant,
    Role,
    User,
    Blacklisted_token,
    Order_status,
    Customer,
    Order,
    Order_item,
    Cart_item
}