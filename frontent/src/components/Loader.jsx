
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">

    <div className="h-48 bg-gray-200" />

    <div className="p-4 space-y-3">

      <div className="h-4 bg-gray-200 rounded w-3/4" />

      <div className="h-3 bg-gray-200 rounded w-full" />

      <div className="h-3 bg-gray-200 rounded w-2/3" />

      <div className="flex justify-between items-center pt-2">


        <div className="h-5 bg-gray-200 rounded w-16" />


        <div className="h-8 bg-gray-200 rounded w-24" />
      </div>
    </div>
  </div>
);

const Loader = ({ count = 6 }) => (
 
  
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default Loader;
