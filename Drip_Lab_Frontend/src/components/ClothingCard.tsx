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
     <div className="relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 group">

         {/* Permanent Delete Button */}
         <button
         onClick={(e) => {
             e.stopPropagation();
             onDelete(id);
         }}
         className="absolute top-3 right-3 z-50 bg-white/90 backdrop-blur-md text-red-500 w-8 h-8 rounded-full flex items-center justify-center border border-gray-100 shadow-sm hover:text-white transition-all active:scale-90"
         title="Remove Item"
         >
             <svg
             xmlns="http://www.w3.org/2000/svg"
             className="h-4 w-4"
             fill="none"
             viewBox="0 0 24 24"
             stroke="currentColor"
             strokeWidth={2.5}
             >
                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
             </svg>
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