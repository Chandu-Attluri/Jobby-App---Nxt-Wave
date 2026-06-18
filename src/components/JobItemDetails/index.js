import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {MdLocationOn} from 'react-icons/md'
import {GiSuitcase} from 'react-icons/gi'
import Header from '../Header'
import SimilarJobCard from '../SimilarJobItem'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobDetails: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsite: data.company_website_url,
    jobDescription: data.job_description,
    id: data.id,
    title: data.title,
    rating: data.rating,
    skills: data.skills,
    place: data.location,
    jobType: data.employment_type,
    salary: data.package_per_annum,
    lifeAtCompany: data.life_at_company,
  })

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedData(eachSimilarJob),
      )
      this.setState({
        jobDetails: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (!response.ok) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="products-details-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for</p>
      <button type="button" className="button" onClick={this.getJobData}>
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobDetails, similarJobsData} = this.state
    const {
      companyLogoUrl,
      companyWebsite,
      jobDescription,
      title,
      rating,
      salary,
      jobType,
      place,
      lifeAtCompany,
      skills,
    } = jobDetails

    return (
      <>
        <div className="column-job-item-details">
          <div className="row-1">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="logo-url"
            />
            <div className="col-2">
              <h1 className="job-details-head">{title}</h1>
              <p className="rating">{rating}</p>
            </div>
          </div>
          <div className="row-3">
            <div className="small-row">
              <p className="suit-and-location">
                <MdLocationOn /> {place}
              </p>
              <p className="suit-and-location">
                <GiSuitcase /> {jobType}
              </p>
            </div>
            <p className="sal">{salary}</p>
          </div>
          <hr className="hr-line" />
          <div className="space-between">
            <h1 className="desc-head">Description</h1>
            <a href={companyWebsite} className="link">
              Visit
            </a>
          </div>
          <p className="desc5">{jobDescription}</p>
          <h1 className="skills">Skills</h1>
          <ul className="flex-wrap">
            {skills.map(eachSkill => (
              <li key={eachSkill.name}>
                <img src={eachSkill.image_url} alt={eachSkill.name} />
              </li>
            ))}
          </ul>
          <h1 className="life">Life At Company</h1>
          {lifeAtCompany && (
            <div className="life-row">
              <p className="com-desc">{lifeAtCompany.description}</p>
              <img
                src={lifeAtCompany.image_url}
                alt="life at company"
                className="life-image"
              />
            </div>
          )}
        </div>
        <h1 className="similar-products-heading">Similar Jobs</h1>
        <ul className="similar-products-list">
          {similarJobsData.map(eachSimilarJob => (
            <li key={eachSimilarJob.id}>
              <SimilarJobCard similarJobDetails={eachSimilarJob} />
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
