import * as React from 'react';

interface OutfitModalProps {
    outfit: any;
    onClose: () => void;
}

const OutfitModal: React.FC<OutfitModalProps> = ({ outfit, onClose }) => {
    if (!outfit) return null;

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-primary/20 backdrop-blur-md" onClick={onClose}></div>

            {/* Modal Content */}
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
                {/* Header*/}
                <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
                    <div>
                        <h2 className="text-3xl font-black italic uppercase text-primary tracking-tighter">{outfit.name}</h2>
                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.3em] mt-1">Curated on {new Date(outfit.createdAt).toLocaleDateString()}</p>
                    </div>
                    <button onClick={onClose} className="bg-slate-50 hover:bg-slate-100 text-primary p-4 rounded-2xl transition-all">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24"stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12"/></svg>
                    </button>
                </div>

                {/* Item Grid */}
                <div className="flex-1 overflow-y-auto p-10 bg-slate-50/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {outfit.items.map((item: any) => (
                            <div key={item._id} className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-100 flex gap-6 items-center">
                            <div className="w-32 h-32 rounded-2xl overflow-hidden border border-slate-50 shrink-0">
                                <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                            </div>
                              <div>
                                <span className="text-[8px] font-black uppercase tracking-widest text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{item.category}</span>
                                <h4 className="text-lg font-bold text-primary mt-2 uppercase tracking-tight">{item.name}</h4>
                                <p className="text-[10px] text-gray-400 font-medium uppercase mt-1">Ref: {item._id.slice(-6)}</p>
                            </div>
                       </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OutfitModal;