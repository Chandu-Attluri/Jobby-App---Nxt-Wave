import {Link} from 'react-router-dom'
import Header from '../Header'

import './index.css'

const NotFound = () => (
  <>
    <Header />
    <Link to="/bad-path">
      <div className="not-found-container">
        <h1>Page Not Found</h1>
        <p>we're sorry,the page you requested could not be found</p>
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
          className="not-found-img"
        />
      </div>
    </Link>
  </>
)

export default NotFound
