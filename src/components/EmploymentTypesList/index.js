import './index.css'

const EmploymentTypesList = props => {
  const renderEmploymentTypesList = () => {
    const {employmentTypesList} = props

    return employmentTypesList.map(employment => {
      const {changeEmploymentType, activeEmploymentType} = props
      const onClickEmploymentTypeItem = () =>
        changeEmploymentType(employment.employmentTypeId)

      const employmentClassName =
        activeEmploymentType === employment.employmentTypeId
          ? `and-up active-rating`
          : `and-up`

      return (
        <li
          className="rating-item"
          key={employment.employmentTypeId}
          onClick={onClickEmploymentTypeItem}
        >
          <input
            type="checkbox"
            id={employment.employmentTypeId}
            value={employment.employmentTypeId}
          />
          <label
            className={employmentClassName}
            htmlFor={employment.employmentTypeId}
          >
            {employment.label}
          </label>
        </li>
      )
    })
  }

  return (
    <div className="filters-group-container">{renderEmploymentTypesList()}</div>
  )
}

export default EmploymentTypesList
