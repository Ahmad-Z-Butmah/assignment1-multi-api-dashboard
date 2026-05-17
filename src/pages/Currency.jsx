import { useState } from 'react'

import Loading from '../components/Loading'

import ErrorMessage from '../components/ErrorMessage'

const currencyOptions = ['ILS', 'USD', 'EUR', 'JOD']




function Currency() {
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState('ILS')
  const [toCurrency, setToCurrency] = useState('USD')
  const [conversion, setConversion] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')



  
  async function handleConvert() {
    const amountValue = Number(amount)
    const from = fromCurrency.trim()
    const to = toCurrency.trim()

    if (!amount || amountValue <= 0) {
      setErrorMessage('Please enter an amount greater than 0.')
      setConversion(null)
      return
    }

    if (from === to) {
      setErrorMessage('From and To currencies cannot be the same.')
      setConversion(null)
      return
    }

    setIsLoading(true)
    setErrorMessage('')
    setConversion(null)

    try {
      const apiUrl = `https://api.frankfurter.dev/v2/rate/${from}/${to}`
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Failed to connect to currency API.')
      }

      const data = await response.json()
      const exchangeRate = data.rate

      if (!exchangeRate) {
        throw new Error(`Exchange rate for ${to} not found.`)
      }

      const finalAmount = (amountValue * exchangeRate).toFixed(2)

      setConversion({
        originalAmount: amountValue,
        fromCurrency: from,
        toCurrency: to,
        rate: exchangeRate,
        convertedAmount: finalAmount,
        date: data.date ?? null,
      })
    } catch (error) {
      setErrorMessage(error.message || 'Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">💱 Currency Converter</h1>
        <p className="page-subtitle">
          Convert money between major world currencies.
        </p>
      </div>

      <div className="search-box">
        <div className="input-group">
          <label htmlFor="amount-input">Amount</label>

          <input
            id="amount-input"
            type="number"
            placeholder="e.g. 100"
            min="0"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            disabled={isLoading}
          />
        </div>

        <div className="input-group">
          <label htmlFor="from-currency">From</label>

          <select
            id="from-currency"
            value={fromCurrency}
            onChange={(event) => setFromCurrency(event.target.value)}
            disabled={isLoading}
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="to-currency">To</label>

          <select
            id="to-currency"
            value={toCurrency}
            onChange={(event) => setToCurrency(event.target.value)}
            disabled={isLoading}
          >
            {currencyOptions.map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleConvert}
          disabled={isLoading}
        >
          {isLoading ? 'Converting...' : '💱 Convert'}
        </button>
      </div>

      {isLoading && <Loading message="Fetching exchange rates..." />}

      {errorMessage && <ErrorMessage message={errorMessage} />}

      {conversion && (
        <div className="result-card">
          <h2>Conversion Result</h2>

          <div className="conversion-result">
            <p className="amount-from">
              {conversion.originalAmount} {conversion.fromCurrency} =
            </p>

            <p className="amount-to">
              {conversion.convertedAmount} {conversion.toCurrency}
            </p>

            <p className="rate-info">
              1 {conversion.fromCurrency} = {conversion.rate} {conversion.toCurrency}
            </p>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <div className="info-label">Original Amount</div>
              <div className="info-value">
                {conversion.originalAmount} {conversion.fromCurrency}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Converted Amount</div>
              <div className="info-value">
                {conversion.convertedAmount} {conversion.toCurrency}
              </div>
            </div>

            <div className="info-item">
              <div className="info-label">Exchange Rate</div>
              <div className="info-value">
                1 {conversion.fromCurrency} = {conversion.rate} {conversion.toCurrency}
              </div>
            </div>

            {conversion.date && (
              <div className="info-item">
                <div className="info-label">Rate Date</div>
                <div className="info-value">{conversion.date}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Currency