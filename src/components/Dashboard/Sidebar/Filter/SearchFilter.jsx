import { useDispatch, useSelector } from "react-redux";
import { setSearchFilter } from "/src/redux/actions/app";
import { FormattedMessage } from "react-intl";

const SearchFilter = () => {
  const dispatch = useDispatch();
  const value = useSelector((state) => state.app.get("searchFilter"));

  return (
    <div className="SearchFilter">
      <FormattedMessage
        id="filter.searchItem"
        description="Title of the Search-Filter"
        defaultMessage="Search Item..."
      >
        {(title) => (
          <input
            type="search"
            placeholder={title}
            value={value}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
          />
        )}
      </FormattedMessage>
    </div>
  );
};

export default SearchFilter;
