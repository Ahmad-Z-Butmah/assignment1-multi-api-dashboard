import { useState } from 'react'

import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

const weatherCodes = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  
  48: 'Icy fog',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Light showers',
  81: 'Showers',
  82: 'Heavy showers',
  85: 'Snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Heavy thunderstorm with hail',
}

function getWeatherDescription(code) {
  return weatherCodes[code] ?? `Code ${code}`
}

function Weather() {
  const [cityName, setCityName] = useState('')
  const [weatherInfo, setWeatherInfo] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSearch() {
    const cityValue = cityName.trim()

    if (!cityValue) {
      setErrorMessage('Please enter a city name.')
      setWeatherInfo(null)
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setWeatherInfo(null)

    try {
      const geoUrl =
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityValue)}&count=1`

      const geoResponse = await fetch(geoUrl)

      if (!geoResponse.ok) {
        throw new Error('Failed to connect to geocoding API.')
      }

      const geoData = await geoResponse.json()

      if (!geoData.results || geoData.results.length === 0) {
        setErrorMessage(`City "${cityName}" was not found. Please check the name and try again.`)
        return
      }

      const firstResult = geoData.results[0]
      const { latitude, longitude, name, country, timezone } = firstResult

      const weatherUrl =
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        '&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,is_day' +
        '&timezone=auto'

      const weatherResponse = await fetch(weatherUrl)

      if (!weatherResponse.ok) {
        throw new Error('Failed to connect to weather API.')
      }

      const weatherData = await weatherResponse.json()
      const currentWeather = weatherData.current

      setWeatherInfo({
        cityName: name,
        country,
        latitude,
        longitude,
        timezone,
        temperature: currentWeather.temperature_2m,
        humidity: currentWeather.relative_humidity_2m,
        windSpeed: currentWeather.wind_speed_10m,
        weatherCode: currentWeather.weather_code,
        isDay: currentWeather.is_day,
        lastUpdate: currentWeather.time,
        units: weatherData.current_units,
      })
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  function handleInputKeyDown(event) {
    if (event.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">🌤️ Weather</h1>
        <p className="page-subtitle">
          Get real-time weather information for any city.
        </p>
      </div>

      <div className="search-box">
        <div className="input-group">
          <label htmlFor="city-input">City Name</label>

          <input
            id="city-input"
            type="text"
            placeholder="e.g. Jerusalem, Tehran, Amman"
            value={cityName}
            onChange={(event) => setCityName(event.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={isLoading}
          />
        </div>

        <button
          className="btn btn-primary"
          onClick={handleSearch}
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : '🔍 Search'}
        </button>
      </div>

      {isLoading && <Loading message="Fetching weather data..." />}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {weatherInfo && (
        <div className="result-card">
          <h2>
            {weatherInfo.isDay ? '☀️' : '🌙'} {weatherInfo.cityName}, {weatherInfo.country}
          </h2>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Temperature</div>
              <div className="info-value large">
                {weatherInfo.temperature}
                {weatherInfo.units?.temperature_2m ?? '°C'}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Condition</div>
              <div className="info-value">
                {getWeatherDescription(weatherInfo.weatherCode)}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Humidity</div>
              <div className="info-value">
                {weatherInfo.humidity}
                {weatherInfo.units?.relative_humidity_2m ?? '%'}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Wind Speed</div>
              <div className="info-value">
                {weatherInfo.windSpeed} {weatherInfo.units?.wind_speed_10m ?? 'km/h'}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Time of Day</div>
              <div className="info-value">
                {weatherInfo.isDay ? '🌞 Day' : '🌙 Night'}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Weather Code</div>
              <div className="info-value">{weatherInfo.weatherCode}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Latitude</div>
              <div className="info-value">{weatherInfo.latitude}°</div>
            </div>

            <div className="info-item">
              <div className="info-label">Longitude</div>
              <div className="info-value">{weatherInfo.longitude}°</div>
            </div>

            <div className="info-item">
              <div className="info-label">Country</div>
              <div className="info-value">{weatherInfo.country}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Timezone</div>
              <div className="info-value">{weatherInfo.timezone}</div>
            </div>

            {weatherInfo.lastUpdate && (
              <div className="info-item">
                <div className="info-label">Last Update</div>
                <div className="info-value" style={{ fontSize: '0.85rem' }}>
                  {weatherInfo.lastUpdate.replace('T', ' ')}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Weather
