export default function WhyChooseProfitWay() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 px-4">
            Why Choose <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">ProfitWay</span>
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto px-4">
            Start earning while you learn with our proven income system
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[
            {
              icon: "💰",
              title: "Guaranteed Income",
              description: "Start earning from day one with our proven income generation system"
            },
            {
              icon: "📈",
              title: "Progressive Growth",
              description: "Your income grows as you progress through higher packages"
            },
            {
              icon: "🎯",
              title: "Dual Income Streams",
              description: "Both active and passive income opportunities in every package"
            },
            {
              icon: "🤝",
              title: "Community Support",
              description: "Join a network of successful earners and learn from their experience"
            },
            {
              icon: "📚",
              title: "Comprehensive Training",
              description: "Complete courses covering all aspects of digital income generation"
            },
            {
              icon: "🔄",
              title: "Continuous Support",
              description: "Ongoing mentorship and support to maximize your earnings"
            }
          ].map((feature, index) => (
            <div key={index} className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200">
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
