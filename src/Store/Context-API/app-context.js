import React, { useCallback, useState } from "react";

import categoryService from "../../Services/categoriesService";
import { BY_ALPHABET } from "../../Data/Constants/sort";

const AppContext = React.createContext({
  isDataLoading: null,
  isDataLoadingHandler: () => {},
  categoriesState: null,
  handleCategoryFetch: () => {},
  isNavHidden: null,
  handleIsNavHidden: () => {},
  filters: null,
  setFilters: () => {},
  handleAddFilter: () => {},
  handleRemoveFilter: () => {},
  handleSubcategoryFilter: () => {},
  handleCategoryFilter: () => {},
});

export default AppContext;

export const AppContextProvider = ({ children }) => {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [categoriesState, setCategoriesState] = useState([]);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    priceMin: 0,
    priceMax: 0,
    offset: 0,
    sort: BY_ALPHABET,
    direction: 0,
  });

  const isDataLoadingHandler = useCallback((state) => {
    setIsDataLoading(state);
  }, []);

  const handleIsNavHidden = useCallback((state) => {
    setIsNavHidden(state);
  }, []);

  //Adds a filter
  const handleAddFilter = ({
    category,
    subcategory,
    priceMin,
    priceMax,
    sort,
    offset,
    direction,
  }) => {
    setFilters((filters) => {
      let newState = {
        categories: filters.categories,
        subcategories: filters.subcategories,
        priceMin: filters.priceMin,
        priceMax: filters.priceMax,
        offset: 0,
        sort: filters.sort,
        direction: filters.direction,
      };
      if (category) {
        newState.subcategories = newState.subcategories.filter(
          (subcategory) => subcategory.categoryId !== category.id
        );
        newState.categories.push(category);
      }
      if (subcategory) {
        newState.categories = newState.categories.filter(
          (category) => category.id !== subcategory.categoryId
        );
        newState.subcategories.push(subcategory);
      }
      if (priceMin) {
        newState.priceMin = priceMin;
      }
      if (priceMax) {
        newState.priceMax = priceMax;
      }
      if (offset) {
        newState.offset = offset;
      }
      if (sort) {
        newState.sort = sort;
      }
      if (direction === 0 || direction === 1) {
        newState.direction = direction;
      }
      return newState;
    });
  };

  //Removes a filter
  const handleRemoveFilter = ({
    category,
    subcategory,
    priceMin,
    priceMax,
    sort,
    offset,
    direction,
  }) => {
    setFilters((prevState) => {
      let newState = {
        categories: prevState.categories,
        subcategories: prevState.subcategories,
        priceMin: prevState.priceMin,
        priceMax: prevState.priceMax,
        offset: 0,
        sort: prevState.sort,
        direction: prevState.direction,
      };
      if (category) {
        let filteredCategoriesArray = newState.categories.filter(
          (el) => el.id !== category.id
        );
        newState.categories = filteredCategoriesArray;
      }
      if (subcategory) {
        let filteredSubcategoriesArray = newState.subcategories.filter(
          (el) => el.id !== subcategory.id
        );
        newState.subcategories = filteredSubcategoriesArray;
      }
      if (priceMin > 0) {
        newState.priceMin = 0;
      }
      if (priceMax > 0) {
        newState.priceMax = 0;
      }
      if (offset) {
        newState.offset = offset;
      }
      if (sort) {
        newState.sort = sort;
      }
      if (direction === 0 || direction === 1) {
        newState.direction = direction;
      }
      return newState;
    });
  };

  //Fetch all categories available in the database
  const handleCategoryFetch = useCallback(async () => {
    return categoryService.fetchAllCategories().then(({ data }) => {
      let categoriesMapped = [];
      data.forEach(({ subcategories, name }) => {
        let subcategoriesArr = [];
        subcategories.forEach(({ name }) => {
          subcategoriesArr.push({ name });
        });
        categoriesMapped.push({ name, subcategories: subcategoriesArr });
      });
      setCategoriesState(data);
    });
  }, []);

  //Filter by category
  const handleCategoryFilter = (id, name, action) => {
    let hasCategoryFilter = false;
    if (action === "add") {
      //Check if there is already the same subcategory in the filter, if yes, then do not add it again
      filters.categories.forEach((el) => {
        if (parseInt(el.id) === parseInt(id)) {
          hasCategoryFilter = true;
        }
      });
      if (!hasCategoryFilter) {
        let filter = {
          category: { id: parseInt(id), name: name },
        };
        handleAddFilter(filter);
      }
    } else if (action === "remove") {
      let filter = {
        category: { id: parseInt(id), name: name },
      };
      handleRemoveFilter(filter);
    }
  };

  //Filter by subcategory
  const handleSubcategoryFilter = ({ target }) => {
    let hasSubcategoryFilter = false;
    if (target.checked) {
      //Check if there is already the same subcategory in the filter, if yes, then do not add it again
      filters.subcategories.forEach((el) => {
        if (el.id === target.id) {
          hasSubcategoryFilter = true;
        }
      });
      if (!hasSubcategoryFilter) {
        let filter = {
          subcategory: {
            id: parseInt(target.id),
            name: target.name,
            categoryId: parseInt(target.parentNode.dataset.categoryid),
          },
        };
        handleAddFilter(filter);
      }
    } else {
      let filter = {
        subcategory: { id: parseInt(target.id), name: target.name },
      };
      handleRemoveFilter(filter);
    }
  };

  return (
    <AppContext.Provider
      value={{
        isDataLoading: isDataLoading,
        isDataLoadingHandler: isDataLoadingHandler,
        categoriesState: categoriesState,
        handleCategoryFetch: handleCategoryFetch,
        isNavHidden: isNavHidden,
        handleIsNavHidden: handleIsNavHidden,
        filters: filters,
        setFilters: setFilters,
        handleAddFilter: handleAddFilter,
        handleRemoveFilter: handleRemoveFilter,
        handleSubcategoryFilter: handleSubcategoryFilter,
        handleCategoryFilter: handleCategoryFilter,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
