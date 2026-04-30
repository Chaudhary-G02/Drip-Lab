import React, { useState } from 'react';
import axios from 'axios';
import {Navigate, useNavigate} from 'react-router-dom';

const AddItem: React.FC = () => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('Tops');
    const navigate = useNavigate();
    const [gender, setGender] = useState('Unisex');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return alert("Please select an image first!");

        setIsUploading(true);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('gender', gender);
        formData.append('image', file);

        try {
            await axios.post('http://localhost:5000/api/items', formData, {
                headers: {'Content-Type': 'multipart/form-data'}
            });
            alert("Item added to your Digital Closet!");
            navigate('/closet');
        } catch (error) {
            console.error("Error adding item:", error);
            alert("Upload failed. Check your connection.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
            <h2 className="text-3xl font-black italic text-primary mb-6 uppercase tracking-tighter">Digitize Item</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. File Upload With Preview */}
            <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-2xl p-6 bg-slate-50 hover:bg-slate-100 transition-all relative overflow-hidden group">
                {preview ? (
                    <img src={preview} alt="Preview" className="h-40 w-full object-contain rounded-lg"/>
                ) : (
                    <div className="text-center py-4">
                        <span className="text-3xl">📷</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase mt-2">Upload Photo</p>
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    required
                />
            </div>

            {/* 2. Item Name */}
            <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Item
                    Name</label>
                <input
                    placeholder="e.g. Oversized Black Hoodie"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            {/* 3. Category Select */}
            <div>
                <label
                    className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Category</label>
                <select
                    className="w-full p-4 bg-slate-50 rounded-xl border-none focus:ring-primary outline-none font-bold text-sm"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option>Tops</option>
                    <option>Bottoms</option>
                    <option>Outerwear</option>
                    <option>Shoes</option>
                </select>
            </div>

            {/* 4. Gender Choice */}
            <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Section /Gender</p>
                <div className="flex gap-2">
                    {['Men', 'Women', 'Unisex'].map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setGender(option)}
                            className={`flex-1 py-2 rounded-full text-[10px] font-black transition-all border-2 uppercase tracking-widest ${
                                gender === option
                                    ? 'bg-primary border-primary text-white shadow-md'
                                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>

                <button
                    type="submit"
                    disabled={isUploading}
                    className={`w-full py-4 rounded-xl font-bold uppercase tracking-[0.2em] shadow-lg transition-all active:scale-95 ${
                        isUploading ? 'bg-gray--300 cursor-not-allowed' : 'bg-primary text-white hover:bg-blue-900'
                    }`}
                >
                    {isUploading ? "Uploading..." : "Add to Closet"}
                </button>
            </form>
        </div>
    );
};

export default AddItem;