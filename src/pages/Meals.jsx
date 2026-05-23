import { useState } from 'react'

import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'


function getIngredientsFromMeal(mealData) {
  const ingredients = []

  for (let index = 1; index <= 20; index++) {
    const ingredient = mealData[`strIngredient${index}`]
    const measure = mealData[`strMeasure${index}`]

    if (ingredient && ingredient.trim()) {
      const amount = measure ? measure.trim() : ''
      ingredients.push(`${amount} ${ingredient.trim()}`.trim())
    }
  }

  return ingredients
}

function Meals() {
  const [mealSearch, setMealSearch] = useState('')
  const [mealDetails, setMealDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSearch() {
    const searchValue = mealSearch.trim()

    if (!searchValue) {
      setErrorMessage('Please enter a meal name.')
      setMealDetails(null)
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setMealDetails(null)

    try {
      const apiUrl =
        `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(searchValue)}`

      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Failed to connect to the Meals API.')
      }

      const data = await response.json()

      if (!data.meals || data.meals.length === 0) {
        setErrorMessage(`No meals found for "${mealSearch}". Try another name like "pasta" or "chicken".`)
        return
      }

      const firstMeal = data.meals[0]
      const mealTags = firstMeal.strTags
        ? firstMeal.strTags.split(',').map((tag) => tag.trim())
        : []

      setMealDetails({
        name: firstMeal.strMeal,
        category: firstMeal.strCategory,
        area: firstMeal.strArea,
        instructions: firstMeal.strInstructions,
        thumbnail: firstMeal.strMealThumb,
        tags: mealTags,
        youtube: firstMeal.strYoutube,
        source: firstMeal.strSource,
        ingredients: getIngredientsFromMeal(firstMeal),
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
        <h1 className="page-title">🍽️ Meal Finder</h1>
        <p className="page-subtitle">
          Search for meal recipes from around the world.
        </p>
      </div>

      <div className="search-box">
        <div className="input-group">
          <label htmlFor="meal-input">Meal Name</label>

          <input
            id="meal-input"
            type="text"
            placeholder="e.g. pasta, chicken, sushi"
            value={mealSearch}
            onChange={(event) => setMealSearch(event.target.value)}
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

      {isLoading && <Loading message="Fetching meal data..." />}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {mealDetails && (
        <div className="result-card">
          <h2>🍴 {mealDetails.name}</h2>

          {mealDetails.thumbnail && (
            <div style={{ marginBottom: '1.25rem' }}>
              <img
                src={mealDetails.thumbnail}
                alt={mealDetails.name}
                style={{
                  width: '100%',
                  maxWidth: '320px',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              />
            </div>
          )}

          <div className="info-grid" style={{ marginBottom: '1.25rem' }}>
            <div className="info-item">
              <div className="info-label">Category</div>
              <div className="info-value">{mealDetails.category}</div>
            </div>

            <div className="info-item">
              <div className="info-label">Cuisine</div>
              <div className="info-value">{mealDetails.area}</div>
            </div>

            {mealDetails.tags.length > 0 && (
              <div className="info-item" style={{ gridColumn: '1 / -1' }}>
                <div className="info-label">Tags</div>

                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.4rem',
                    marginTop: '0.3rem',
                  }}
                >
                  {mealDetails.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        borderRadius: '20px',
                        padding: '0.2rem 0.75rem',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ marginBottom: '1.25rem' }}>
            <div className="info-label" style={{ marginBottom: '0.6rem' }}>
              Ingredients
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: '0.4rem',
              }}
            >
              {mealDetails.ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px',
                    padding: '0.4rem 0.75rem',
                    fontSize: '0.85rem',
                    color: 'var(--text)',
                  }}
                >
                  🥄 {ingredient}
                </div>
              ))}
            </div>
          </div>

          {mealDetails.instructions && (
            <div style={{ marginBottom: '1.25rem' }}>
              <div className="info-label" style={{ marginBottom: '0.5rem' }}>
                Instructions
              </div>

              <div
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                  borderRadius: '10px',
                  padding: '1rem',
                  fontSize: '0.88rem',
                  lineHeight: '1.7',
                  color: 'var(--text)',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  whiteSpace: 'pre-line',
                }}
              >
                {mealDetails.instructions}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {mealDetails.youtube && (
              <a
                href={mealDetails.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="maps-link"
                style={{
                  background: '#fee2e2',
                  borderColor: '#fecaca',
                  color: '#dc2626',
                }}
              >
                ▶️ Watch on YouTube
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Meals
