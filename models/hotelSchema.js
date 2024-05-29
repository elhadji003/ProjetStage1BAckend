const mongoose = require('mongoose')

const hotelSchemas = mongoose.Schema(
    {
        nameHotel: {type: String, require: true},
        address: {type: String, require: true},
        email: {type: String, require: true},
        number: {type: String, require: true},
        price: {type: String, require: true},
        devise: {type: String, require: true},
        image: {type: String, require: true},
    },{
        timestamps: true,
    }
);

module.exports = mongoose.model('Product', hotelSchemas)