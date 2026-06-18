import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import SalaryRanges from '../SalaryRanges'
import EmploymentTypesList from '../EmploymentTypesList'
import SearchInput from '../SearchInput'
import Header from '../Header'
import JobItem from '../JobItem'
import Profile from '../Profile'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    activeEmploymentType: '',
    activeSalaryRange: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfile()
  }

  getProfile = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const response = await fetch('https://apis.ccbp.in/profile', {
      headers: {Authorization: `Bearer ${jwtToken}`},
    })
    if (response.ok) {
      const data = await response.json()
      this.setState({profileData: data.profile_details})
    }
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {activeEmploymentType, activeSalaryRange, searchInput} = this.state
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        title: job.title,
        rating: job.rating,
        imageUrl: job.company_logo_url,
        id: job.id,
        place: job.location,
        jobType: job.employment_type,
        salary: job.package_per_annum,
        description: job.job_description,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else if (!response.ok) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  changeEmploymentType = id => {
    this.setState(
      prev => ({
        activeEmploymentType: prev.activeEmploymentType.includes(id)
          ? prev.activeEmploymentType.filter(e => e !== id)
          : [...prev.activeEmploymentType, id],
      }),
      this.getJobs,
    )
  }

  changeSalaryRange = activeSalaryRange => {
    this.setState({activeSalaryRange}, this.getJobs)
  }

  enterSearchInput = () => {
    this.getJobs()
  }

  changeSearchInput = searchInput => {
    this.setState({searchInput})
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.enterSearchInput()
    }
  }

  renderFailureView = () => (
    <div className="products-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.getJobs}>
        Retry
      </button>
    </div>
  )

  renderJobsListView = () => {
    const {jobsList} = this.state
    const shouldShowJobsList = jobsList.length > 0

    return shouldShowJobsList ? (
      <div className="all-products-container">
        <ul className="products-list">
          {jobsList.map(job => (
            <JobItem jobData={job} key={job.id} />
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-products-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-products-img"
          alt="no jobs"
        />
        <h1 className="no-products-heading">No Jobs Found</h1>
        <p className="no-products-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="products-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="ffffff" height="50" width="50" />
    </div>
  )

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsListView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {
      activeEmploymentType,
      searchInput,
      activeSalaryRange,
      profileData,
    } = this.state

    return (
      <div className="input">
        <Header />
        <SearchInput
          className="search-input"
          searchInput={searchInput}
          changeSearchInput={this.changeSearchInput}
          enterSearchInput={this.enterSearchInput}
        />
        <div className="all-products-section">
          <div className="col">
            <Profile profileData={profileData} />
            <h1 className="head">Type Of Employment</h1>
            <EmploymentTypesList
              employmentTypesList={employmentTypesList}
              activeEmploymentType={activeEmploymentType}
              changeEmploymentType={this.changeEmploymentType}
            />
            <h1 className="head">Salary Range</h1>
            <SalaryRanges
              salaryRangesList={salaryRangesList}
              activeSalaryRange={activeSalaryRange}
              changeSalaryRange={this.changeSalaryRange}
            />
          </div>
          {this.renderAllJobs()}
        </div>
      </div>
    )
  }
}

export default Jobs
