import { useState } from 'react'

import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function Country() {
  const [searchText, setSearchText] = useState('')
  const [countryDetails, setCountryDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorText, setErrorText] = useState('')

  async function handleSearch() {
    const countryName = searchText.trim()

    if (!countryName) {
      setErrorText('Please enter a country name.')
      setCountryDetails(null)
      return
    }

    setIsLoading(true)
    setErrorText('')
    setCountryDetails(null)

    try {
      const requestUrl =
        `https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fields=name,capital,region,subregion,population,flags,currencies,languages,timezones,maps`

      const response = await fetch(requestUrl)

      if (response.status === 404) {
        setErrorText(`Country "${searchText}" was not found. Please check the name and try again.`)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to connect to Countries API.')
      }

      const result = await response.json()
      const selectedCountry = result[0]

      const currencies = selectedCountry.currencies
        ? Object.values(selectedCountry.currencies)
            .map((currency) => `${currency.name} (${currency.symbol ?? ''})`)
            .join(', ')
        : 'N/A'

      const languages = selectedCountry.languages
        ? Object.values(selectedCountry.languages).join(', ')
        : 'N/A'

      const countryData = {
        commonName: selectedCountry.name?.common ?? 'N/A',
        officialName: selectedCountry.name?.official ?? 'N/A',
        capital: selectedCountry.capital?.[0] ?? 'N/A',
        region: selectedCountry.region ?? 'N/A',
        subregion: selectedCountry.subregion ?? 'N/A',
        population: selectedCountry.population?.toLocaleString() ?? 'N/A',
        flagUrl: selectedCountry.flags?.svg ?? selectedCountry.flags?.png ?? '',
        flagAlt: selectedCountry.flags?.alt ?? '',
        currencies,
        languages,
        timezones: selectedCountry.timezones?.join(', ') ?? 'N/A',
        googleMaps: selectedCountry.maps?.googleMaps ?? null,
      }

      setCountryDetails(countryData)
    } catch (error) {
      setErrorText(error.message || 'Something went wrong. Please try again.')
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
        <h1 className="page-title">🌍 Country Info</h1>
        <p className="page-subtitle">
          Search for detailed information about any country.
        </p>
      </div>

      <div className="search-box">
        <div className="input-group">
          <label htmlFor="country-input">Country Name</label>

          <input
            id="country-input"
            type="text"
            placeholder="e.g. Palestine, Jordan, Iran"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
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

      {isLoading && <Loading message="Fetching country data..." />}

      {errorText && <ErrorMessage message={errorText} />}

      {countryDetails && (
        <div className="result-card">
          <h2>🏳️ {countryDetails.commonName}</h2>

          {countryDetails.flagUrl && (
            <div style={{ marginBottom: '1.25rem' }}>
              <img
                src={countryDetails.flagUrl}
                alt={countryDetails.flagAlt || `Flag of ${countryDetails.commonName}`}
                className="country-flag"
              />
            </div>
          )}

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Common Name</div>
              <div className="info-value">{countryDetails.commonName}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Official Name</div>
              <div className="info-value" style={{ fontSize: '0.88rem' }}>
                {countryDetails.officialName}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Capital</div>
              <div className="info-value">{countryDetails.capital}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Region</div>
              <div className="info-value">{countryDetails.region}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Subregion</div>
              <div className="info-value">{countryDetails.subregion}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Population</div>
              <div className="info-value">{countryDetails.population}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Currencies</div>
              <div className="info-value" style={{ fontSize: '0.88rem' }}>
                {countryDetails.currencies}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Languages</div>
              <div className="info-value" style={{ fontSize: '0.88rem' }}>
                {countryDetails.languages}
              </div>
            </div>

            <div className="info-item" style={{ gridColumn: '1 / -1' }}>
              <div className="info-label">Timezones</div>
              <div className="info-value" style={{ fontSize: '0.88rem' }}>
                {countryDetails.timezones}
              </div>
            </div>
          </div>

          {countryDetails.googleMaps && (
            <a
              href={countryDetails.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="maps-link"
            >
              🗺️ View on Google Maps
            </a>
          )}
        </div>
      )}
    </div>
  )
}

export default Country