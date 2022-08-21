const {Customer} = require('../models')

const registerCustomer = async (customerData) => {
    const customer = new Customer(customerData);
    await customer.save();

    return customer;
}

module.exports = {
    registerCustomer
}