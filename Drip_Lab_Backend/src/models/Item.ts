import mongoose, { Schema, Document } from 'mongoose';

export interface Item extends Document {
    name: string;
    category: 'Tops' | 'Bottoms' | 'Outerwear' | 'Shoes' | 'Accessories';
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
        enum: ['Tops', 'Bottoms', 'Shoes', 'Accessories']
    },
    imageUrl: { type: String, required: true },
    brand: { type: String },
    color: { type: String },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<Item>('Item', ItemSchema);