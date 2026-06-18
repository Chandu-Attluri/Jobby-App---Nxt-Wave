import {Link} from 'react-router-dom'

import './index.css'

const Profile = () => (
  <Link to="/profile">
    <div className="profile-img">
      <h1 className="profile-head">Rahul Attuluri</h1>
      <p className="para">Lead Software developer and AI/ML expert.</p>
    </div>
  </Link>
)

export default Profile
