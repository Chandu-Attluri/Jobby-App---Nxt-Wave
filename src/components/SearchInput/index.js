import {BsSearch} from 'react-icons/bs'

const SearchInput = props => {
  const onChangeSearchInput = event => {
    const {changeSearchInput} = props
    changeSearchInput(event.target.value)
  }

  const onClickSearchButton = () => {
    const {enterSearchInput} = props
    enterSearchInput()
  }
  const renderSearchInput = () => {
    const {searchInput, enterSearchInput} = props
    return (
      <div className="search-input-container">
        <input
          value={searchInput}
          type="search"
          className="search-input"
          placeholder="Search"
          onChange={onChangeSearchInput}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              onClickSearchButton()
            }
          }}
        />
        <button
          type="button"
          data-testid="searchButton"
          onClick={onClickSearchButton}
        >
          <BsSearch className="search-icon" />
        </button>
      </div>
    )
  }

  return <div className="search-container">{renderSearchInput()}</div>
}

export default SearchInput
