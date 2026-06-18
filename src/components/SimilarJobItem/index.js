import {MdLocationOn} from 'react-icons/md'
import {GiSuitcase} from 'react-icons/gi'

import './index.css'

const SimilarJobCard = props => {
  const {similarJobDetails} = props

  return (
    <li className="similar-job-item">
      <div className="alternative">
        <div className="first-row">
          <img
            src={similarJobDetails.companyLogoUrl}
            alt="similar job company logo"
            className="image"
          />
          <div className="first-col">
            <h1 className="title-head">{similarJobDetails.title}</h1>
            <p className="rating-para">{similarJobDetails.rating}</p>
          </div>
        </div>
        <div className="sec-col">
          <h1 className="desc-head2">Description</h1>
          <p className="description2">{similarJobDetails.jobDescription}</p>
        </div>
        <div className="last-row">
          <div className="list" key={`${similarJobDetails.id}-location`}>
            <MdLocationOn className="icon2" />
            <p className="place2">{similarJobDetails.place}</p>
          </div>
          <div className="list" key={`${similarJobDetails.id}-employment-type`}>
            <GiSuitcase className="icon2" />
            <p className="place2">{similarJobDetails.jobType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
