const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const crypticSchema = new Schema({
    title: { type: String, required: [true, 'Title of product is required.'] },
    seller: {type: Schema.Types.ObjectId, ref:'User'},
    condition: { 
        type: String, 
        required: [true, 'Condition of product is required.'],
        enum: ['New', 'Like New', 'Good', 'Fair', 'Poor'] 
        },
    price: { type: Number, min: [.01, 'Price of product must be at least $0.01.'], required: [true, 'Price of product is required.'] },
    imageUrl: { type: String, required: [true, 'Image URL for product is required.'] },
    description: { 
        type: String, 
        required: [true, 'Description of product is required'],
        minLength: [10, 'Description of product must be at least 10 characters long.']
    }
}, 
{ timestamps: true }
);

// Collection name is 'product' in the database
module.exports = mongoose.model('Product', crypticSchema);
