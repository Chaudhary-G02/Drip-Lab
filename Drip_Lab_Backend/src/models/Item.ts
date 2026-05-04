import mongoose, { Schema, Document } from 'mongoose';

export interface Item extends Document {
    name: string;
    category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Shoes' | 'Accessories';
    gender: 'Men' | 'Women' | 'Unisex';
    imageUrl: string;
    brand?: string;
    color?: string;
    createdAt: Date;
}

const ItemSchema: Schema = new Schema({
    name: { type: String, required: true },
    category: {
        type: String,
        required: true,
        enum: ['Tops', 'Bottoms', 'Outerwear', 'Shoes', 'Accessories']
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex'],
        default: 'Unisex'
    },
    imageUrl: { type: String, required: true },
    brand: { type: String },
    color: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Item', ItemSchema);