import InputWithLabel from "./InputWithLabel";


// Subcomponent SearchForm:
const SearchForm = ({ searchTerm, onSearchInput, onSearchSubmit }) => (
  <>
    <form onSubmit={onSearchSubmit}>
      <InputWithLabel id="searchInput"
                      value={searchTerm}
                      type="text"
                      onInputChange={onSearchInput}
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