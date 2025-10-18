export default function PackagesGrid({ packages, handleEnrollNow, busySlug }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {packages.map((pkg, index) => {
        const slug = (pkg.slug || pkg.title || index).toString().toLowerCase().replace(/\s+/g, "-");
        return (
          <div
            key={pkg.id || index}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="flex flex-col sm:flex-row items-stretch">
                {/* Left: cover image (full-width on mobile, left on sm+) */}
                <div className="order-1 sm:order-none w-full sm:w-44 p-4 sm:p-5 flex items-center justify-center bg-gray-50 rounded-t-2xl sm:rounded-t-none sm:rounded-l-2xl overflow-hidden">
                  <img
                    src={pkg.image}
                    alt={pkg.title}
                    className="w-36 h-48 sm:w-36 sm:h-48 object-contain drop-shadow-lg"
                  />
                </div>

                {/* Right: details */}
                <div className="order-2 p-4 sm:p-5 flex-1 flex flex-col justify-between rounded-b-2xl sm:rounded-b-none sm:rounded-r-2xl">
                <div>
                  <h3 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-500 to-purple-600 bg-clip-text text-transparent mb-2">{pkg.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{pkg.shortDescription || pkg.description}</p>

                  {/* Checklist */}
                  <div className="space-y-2 mb-4">
                    {(pkg.features || []).slice(0, 5).map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full bg-green-50 text-green-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-7.071 7.071a1 1 0 01-1.414 0L3.293 9.171a1 1 0 011.414-1.414l4.243 4.242 6.364-6.364a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </span>
                        <div className="text-gray-700 text-sm">{feature}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3">
                  <div className="flex items-baseline gap-3">
                    <div className="text-2xl font-extrabold text-gray-900">₹{pkg.price}</div>
                    {pkg.originalPrice && (
                      <div className="text-gray-400 line-through text-sm">₹{pkg.originalPrice}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleEnrollNow(pkg)}
                    disabled={busySlug === slug}
                    className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold shadow hover:from-cyan-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {busySlug === slug ? "Opening…" : "Buy Now"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
