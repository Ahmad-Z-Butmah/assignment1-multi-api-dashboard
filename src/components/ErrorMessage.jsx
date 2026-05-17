function ErrorMessage({ message }) {
  return (
    <div className="error-box">
      <span className="error-icon">⚠️</span>
      <p className="error-text">{message}</p>
    </div>
  )
}

export default ErrorMessage
