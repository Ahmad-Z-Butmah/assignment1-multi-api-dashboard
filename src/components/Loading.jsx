function Loading({ message = 'Fetching data...' }) {
  return (
    <div className="loading-wrapper">
      <div className="spinner"></div>
      <p className="loading-text">{message}</p>
    </div>
  )
}

export default Loading
