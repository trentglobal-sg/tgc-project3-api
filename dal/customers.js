const {Customer} = require('../models')

const registerCustomer = async (customerData) => {
    const customer = new Customer(customerData);
    await customer.save();

    return customer;
}

const checkCustomerExists = async (email) => {
    const customer = await Customer.where({
        'email': email
    }).fetch({
        require: false
    })
    if (customer){
        return true
    } else {
        return false
    }
}

module.exports = {
    registerCustomer,
    checkCustomerExists
}