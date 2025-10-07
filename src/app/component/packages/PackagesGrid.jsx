export default function PackagesGrid({ packages, handleEnrollNow, busySlug }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {packages.map((pkg, index) => (
        <div key={pkg.id || index} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden hover:from-purple-800/30 hover:to-cyan-800/30 transition-all duration-300 transform hover:-translate-y-2 border border-gray-700/50 group">
          {/* Package Image */}
          <div className="relative h-40 sm:h-48 overflow-hidden">
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

            {/* Price Overlay */}
            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 sm:px-3">
              <span className="text-gray-900 font-bold text-xs sm:text-sm">{pkg.price}</span>
              <span className="text-gray-500 line-through text-xs ml-1">{pkg.originalPrice}</span>
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
              <h3 className="text-white font-bold text-base sm:text-lg leading-tight group-hover:text-cyan-400 transition-colors">
                {pkg.title}
              </h3>
            </div>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          {/* Package Content */}
          <div className="p-4 sm:p-5">
            <p className="text-gray-300 text-xs sm:text-sm mb-3 sm:mb-4 leading-relaxed">
              {pkg.description}
            </p>

            {/* Income Details */}
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-2 sm:p-3 mb-3 sm:mb-4">
              <div className="text-green-400 font-semibold text-xs sm:text-sm mb-1 sm:mb-2">
                <span className="font-bold text-lg sm:text-xl">{pkg.price}</span>
                  <span className="text-gray-500 line-through text-xs ml-1">{pkg.originalPrice}</span>
              </div>
              <div className="space-y-1">

              </div>
            </div>

            {/* Features */}
            <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
              {pkg.features.slice(0, 3).map((feature, idx) => (
                <div key={idx} className="flex items-center text-gray-300 text-xs sm:text-sm">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-cyan-400 rounded-full mr-2"></div>
                  {feature}
                </div>
              ))}
              {pkg.features.length > 3 && (
                <div className="text-gray-400 text-xs">
                  +{pkg.features.length - 3} more features
                </div>
              )}
            </div>

            {/* Enroll Button */}
            <button
              type="button"
              onClick={() => handleEnrollNow(pkg)}
              disabled={busySlug === (pkg.slug || pkg.title).toString().toLowerCase().replace(/\s+/g, "-")}
              className="w-full inline-block text-center bg-gradient-to-r from-cyan-500 to-purple-600 text-white py-2 sm:py-2.5 rounded-lg font-medium hover:from-cyan-600 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {busySlug === (pkg.slug || pkg.title).toString().toLowerCase().replace(/\s+/g, "-") ? "Opening…" : "Enroll Now"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
