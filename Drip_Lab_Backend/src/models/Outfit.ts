import mongoose, { Schema, Document } from 'mongoose';

export interface Outfit extends Document {
    name: string;
    items: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const OutfitSchema: Schema = new Schema({
    name: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<Outfit>('Outfit', OutfitSchema);