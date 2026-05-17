import { useState } from 'react'

import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function removeHtmlTags(text) {
  if (!text) {
    return 'No summary available.'
  }

  return text.replace(/<[^>]*>/g, '')
}

function getStatusStyle(status) {
  if (status === 'Running') {
    return { background: '#d1fae5', color: '#065f46' }
  }

  if (status === 'Ended') {
    return { background: '#fee2e2', color: '#991b1b' }
  }

  return { background: '#fef3c7', color: '#92400e' }
}

function getCastList(showData) {
  const castItems = showData._embedded?.cast ?? []

  return castItems.slice(0, 6).map((item) => ({
    name: item.person?.name ?? 'Unknown',
    character: item.character?.name ?? 'Unknown',
    image: item.person?.image?.medium ?? null,
  }))
}

function TVShows() {
  const [searchText, setSearchText] = useState('')
  const [showDetails, setShowDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSearch() {
    const showName = searchText.trim()

    if (!showName) {
      setErrorMessage('Please enter a TV show name.')
      setShowDetails(null)
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setShowDetails(null)

    try {
      const apiUrl =
        `https://api.tvmaze.com/singlesearch/shows?q=${encodeURIComponent(showName)}&embed[]=cast&embed[]=seasons`

      const response = await fetch(apiUrl)

      if (response.status === 404) {
        setErrorMessage(`TV show "${searchText}" was not found. Try another name like "Breaking Bad" or "Friends".`)
        return
      }

      if (!response.ok) {
        throw new Error('Failed to connect to the TVMaze API.')
      }

      const data = await response.json()
      const seasons = data._embedded?.seasons ?? []

      setShowDetails({
        name: data.name,
        type: data.type,
        language: data.language,
        status: data.status,
        premiered: data.premiered,
        ended: data.ended,
        rating: data.rating?.average,
        genres: data.genres ?? [],
        summary: removeHtmlTags(data.summary),
        network: data.network?.name ?? data.webChannel?.name ?? 'N/A',
        country: data.network?.country?.name ?? 'N/A',
        image: data.image?.original ?? data.image?.medium ?? null,
        runtime: data.runtime,
        cast: getCastList(data),
        totalSeasons: seasons.length,
        schedule: data.schedule?.days?.join(', ') || 'N/A',
        scheduleTime: data.schedule?.time || 'N/A',
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
        <h1 className="page-title">🎬 TV Show Search</h1>
        <p className="page-subtitle">
          Search for detailed information about any TV show.
        </p>
      </div>

      <div className="search-box">
        <div className="input-group">
          <label htmlFor="show-input">TV Show Name</label>

          <input
            id="show-input"
            type="text"
            placeholder="e.g. Breaking Bad, Friends, Game of Thrones"
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

      {isLoading && <Loading message="Fetching TV show data..." />}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {showDetails && (
        <div className="result-card">
          <h2>🎬 {showDetails.name}</h2>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            {showDetails.image && (
              <img
                src={showDetails.image}
                alt={showDetails.name}
                style={{
                  width: '160px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-md)',
                  objectFit: 'cover',
                  flexShrink: 0,
                }}
              />
            )}

            <div style={{ flex: 1, minWidth: '220px' }}>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">Status</div>

                  <div>
                    <span
                      style={{
                        ...getStatusStyle(showDetails.status),
                        borderRadius: '20px',
                        padding: '0.2rem 0.75rem',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                      }}
                    >
                      {showDetails.status}
                    </span>
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Rating</div>
                  <div className="info-value large">
                    {showDetails.rating ? `⭐ ${showDetails.rating}/10` : 'N/A'}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Network</div>
                  <div className="info-value">{showDetails.network}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">Country</div>
                  <div className="info-value">{showDetails.country}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">Premiered</div>
                  <div className="info-value">{showDetails.premiered ?? 'N/A'}</div>
                </div>

                {showDetails.ended && (
                  <div className="info-item">
                    <div className="info-label">Ended</div>
                    <div className="info-value">{showDetails.ended}</div>
                  </div>
                )}

                <div className="info-item">
                  <div className="info-label">Seasons</div>
                  <div className="info-value">
                    {showDetails.totalSeasons > 0 ? showDetails.totalSeasons : 'N/A'}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Runtime</div>
                  <div className="info-value">
                    {showDetails.runtime ? `${showDetails.runtime} min` : 'N/A'}
                  </div>
                </div>

                <div className="info-item">
                  <div className="info-label">Language</div>
                  <div className="info-value">{showDetails.language ?? 'N/A'}</div>
                </div>

                <div className="info-item">
                  <div className="info-label">Type</div>
                  <div className="info-value">{showDetails.type ?? 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {showDetails.genres.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="info-label" style={{ marginBottom: '0.5rem' }}>
                Genres
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {showDetails.genres.map((genre) => (
                  <span
                    key={genre}
                    style={{
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      borderRadius: '20px',
                      padding: '0.2rem 0.75rem',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}

          {showDetails.schedule !== 'N/A' && (
            <div className="info-item" style={{ marginBottom: '1.25rem' }}>
              <div className="info-label">Schedule</div>
              <div className="info-value" style={{ fontSize: '0.9rem' }}>
                📅 {showDetails.schedule} at {showDetails.scheduleTime}
              </div>
            </div>
          )}

          <div style={{ marginBottom: '1.25rem' }}>
            <div className="info-label" style={{ marginBottom: '0.5rem' }}>
              Summary
            </div>

            <div
              style={{
                background: 'var(--surface-2)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '1rem',
                fontSize: '0.9rem',
                lineHeight: '1.7',
                color: 'var(--text)',
              }}
            >
              {showDetails.summary}
            </div>
          </div>

          {showDetails.cast.length > 0 && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="info-label" style={{ marginBottom: '0.75rem' }}>
                Top Cast
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                  gap: '0.75rem',
                }}
              >
                {showDetails.cast.map((member, index) => (
                  <div
                    key={index}
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '0.75rem',
                      textAlign: 'center',
                    }}
                  >
                    {member.image ? (
                      <img
                        src={member.image}
                        alt={member.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          marginBottom: '0.5rem',
                          border: '2px solid var(--border)',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          background: 'var(--primary-light)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          margin: '0 auto 0.5rem',
                          fontSize: '1.5rem',
                        }}
                      >
                        👤
                      </div>
                    )}

                    <div
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 700,
                        color: 'var(--text)',
                      }}
                    >
                      {member.name}
                    </div>

                    <div
                      style={{
                        fontSize: '0.72rem',
                        color: 'var(--text-secondary)',
                        marginTop: '0.15rem',
                      }}
                    >
                      as {member.character}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default TVShows