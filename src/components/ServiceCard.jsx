import { useNavigate } from 'react-router-dom'

function ServiceCard({ icon, iconClass, title, description, buttonText, path }) {
  const navigate = useNavigate()

  return (
    <div className="service-card">
      <div className={`card-icon ${iconClass}`}>
        {icon}
      </div>
      <h2 className="card-title">{title}</h2>
      <p className="card-description">{description}</p>
      <button className="btn-card" onClick={() => navigate(path)}>
        {buttonText} →
      </button>
    </div>
  )
}

export default ServiceCard
