import * as React from 'react';

interface ClothingCardProps {
    name: string;
    category: string;
    imageUrl: string;
}

const ClothingCard: React.FC<ClothingCardProps> =({ name, category, imageUrl }) => {
 return (
     <div className="bg-white rounded=2xl overflow-hidden shadow-sm hover:shadow-xl transition-all group cursor-pointer border border-gray-100">
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