import mongoose, { Schema, Document } from 'mongoose';

export interface Outfit extends Document {
    userId: string,
    name: string;
    items: mongoose.Types.ObjectId[];
    feedback?: 'like' | 'dislike' | 'none';
    createdAt: Date;
}

const OutfitSchema: Schema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    items: [{ type: Schema.Types.ObjectId, ref: 'Item', required: true }],
    feedback: {
        type: String,
        enum: ['like', 'dislike', 'none'],
        default: 'none'
    },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<Outfit>('Outfit', OutfitSchema);