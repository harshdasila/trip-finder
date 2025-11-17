export function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#f2f2f2] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header skeleton */}
        <div className="h-8 bg-gray-300 rounded animate-pulse w-1/4 mb-6"></div>
        
        {/* Grid of card skeletons - 2x2 layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6 , 7, 8].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-md overflow-hidden">
              {/* Image placeholder */}
              <div className="h-56 bg-gray-300 animate-pulse"></div>
              
              {/* Content */}
              <div className="p-5 space-y-3">
                {/* Title */}
                <div className="h-6 bg-gray-300 rounded animate-pulse w-3/4"></div>
                
                {/* Description lines */}
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-full"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-5/6"></div>
                </div>
                
                {/* Footer info */}
                <div className="flex justify-between items-center pt-3">
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4"></div>
                  <div className="h-4 bg-gray-300 rounded animate-pulse w-1/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}