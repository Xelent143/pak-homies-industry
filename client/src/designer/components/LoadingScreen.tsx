
export const LoadingScreen = () => {
    return (
        <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">
            <div className="flex flex-col items-center animate-fade-in">
                <img
                    src="/fayr3d_logo.png"
                    alt="Fayr3D"
                    className="w-24 h-24 object-contain mb-8 animate-pulse"
                />
                <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="w-full h-full bg-blue-500 origin-left animate-[shimmer_1.5s_infinite]" />
                </div>
                <p className="mt-4 text-white/60 font-medium text-sm">Loading 3D Engine...</p>
            </div>
        </div>
    );
};
