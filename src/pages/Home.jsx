import ServiceCard from '../components/ServiceCard'

const dashboardItems = [
  {
    icon: '🌤️',
    iconClass: 'weather',
    title: 'Weather',
    description: 'Get current weather by city name.',
    buttonText: 'Open Weather',
    path: '/weather',
  },      
  
  {
    icon: '💱',
    iconClass: 'currency',
    title: 'Currency Converter',
    description: 'Convert money between currencies.',
    buttonText: 'Open Converter',
    path: '/currency',
  },
  {
    icon: '🌍',
    iconClass: 'country',
    title: 'Country Info',
    description: 'Search country details.',
    buttonText: 'Open Countries',
    path: '/country',
  },
  {
    icon: '🍽️',
    iconClass: 'meals',
    title: 'Meal Finder',
    description: 'Search for meal recipes from around the world.',
    buttonText: 'Open Meals',
    path: '/meals',
  },
  {
    icon: '🎬',
    iconClass: 'tvshows',
    title: 'TV Show Search',
    description: 'Search for detailed info about any TV show.',
    buttonText: 'Open TV Shows',
    path: '/tvshows',
  },
]

function Home() {
  return (
    <div>
      <div className="home-header">
        <h1 className="home-title">
          Multi <span>API</span> Dashboard
        </h1>

        <p className="home-subtitle">
          Search weather, convert currencies, explore countries, find recipes,
          and discover TV shows — all using public REST APIs.
        </p>
      </div>

      <div className="cards-grid">
        {dashboardItems.map((item) => (
          <ServiceCard
            key={item.path}
            icon={item.icon}
            iconClass={item.iconClass}
            title={item.title}
            description={item.description}
            buttonText={item.buttonText}
            path={item.path}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
