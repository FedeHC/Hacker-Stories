import InputWithLabel from "./InputWithLabel";


// Subcomponent SearchForm:
const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit, dataList }) => (
  <>
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="searchInput"
                      value={searchTerm}
                      type="text"
                      onInputChange={onSearchInput}
                      dataList={dataList}
                      isFocused={true}
      >Search:</InputWithLabel>

      <button id="submitButton"
              type="submit"
              disabled={!searchTerm}
      >Submit!</button>

      <br /> <br />
    </form>
    <br />
  </>
);

export default SearchForm;