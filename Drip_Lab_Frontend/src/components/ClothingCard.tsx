import * as React from 'react';

interface ClothingCardProps {
    id: string;
    name: string;
    category: string;
    imageUrl: string;
    onDelete: (id: string) => void;
}

const ClothingCard: React.FC<ClothingCardProps> =({ id, name, category, imageUrl, onDelete }) => {
 return (
     <div className="realtive group bg-white rounded=2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100">

         {/* The Trash Button */}
         <button
         onClick={(e) => {
             e.stopPropagation();
             onDelete(id);
         }}
         className="absolute top-4 right-4 z-50 bg-red-500  text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
         >
             🗑️
         </button>

         {/* Image Container */}
         <div className="h-64 bg-slate-200 overflow-hidden relative">
             <img
             src={imageUrl}
             alt={name}
             className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
             />
             <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{category}</span>
             </div>
         </div>

         {/* Details */}
         <div className="p-4">
             <h3 className="font-bold text-gray-800 uppercase tracking-tight">{name}</h3>
             <p className="text-sm text-gray-400 mt-1 uppercase">Ready for styling</p>
         </div>
     </div>
 );
};

export default ClothingCard;