import * as React from 'react';

const DashboardStats= ({ stats}: {stats:any}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">

            {/* Card:1 Total Items */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 bg-blue-50 px-4 py-2 rounded-full">
                    Vault Volume
                </span>
                <h3 className="text-5xl font-black italic text-primary mt-6 tracking-tighter">
                    {stats?.totalItems || 0}
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">
                    Pieces in Closet
                </p>
            </div>

            {/* Card2: Total Outfits */}
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 bg-purple-50 px-4 py-2 rounded-full">
                   Curation Index
               </span>
                <h3 className="text-5xl font-black italic text-primary mt-6 tracking-tighter">
                    {stats?.totalItems || 0}
                </h3>
                <p className="text-gray-400 text-xs font-bold uppercase mt-2 tracking-widest">
                    Saved Lookbook Outfits
                </p>
            </div>

            {/* Card3: Latest Activity  */}
            <div className="bg-primary p-8 rounded-[3rem] shadow-xl relative overflow-hidden group">
                <div className="relative z-10">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                        Recent Activity
                    </span>
                    <h3 className="text-2xl font-black italic text-white mt-6 uppercase tracking-tight">
                        {stats?.latestLook?.name || "No Looks yet"}
                    </h3>
                    <p className="text-white/40 text-[10px] font-bold uppercase mt-2 tracking-[0.2em]">
                        Last Curated: {stats?.latestLook ? new Date(stats.latestLook.createdAt).toLocaleDateString(): 'N/A'}
                    </p>
                </div>
                {/* Background Decoration */}
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
            </div>

        </div>
    );
};

export default DashboardStats;