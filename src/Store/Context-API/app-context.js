import React, { useCallback, useState } from "react";
import categoryService from "../../Services/categoriesService";

const AppContext = React.createContext({
  isDataLoading: null,
  isDataLoadingHandler: () => {},
  categoriesState: null,
  handleCategoryFetch: () => {},
  isNavHidden: null,
  handleIsNavHidden: () => {},
});

export default AppContext;

export const AppContextProvider = ({ children }) => {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [categoriesState, setCategoriesState] = useState([]);
  const [isNavHidden, setIsNavHidden] = useState(false);

  const isDataLoadingHandler = useCallback((state) => {
    setIsDataLoading(state);
  }, []);

  const handleIsNavHidden = useCallback((state) => {
    setIsNavHidden(state);
  }, []);

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

  return (
    <AppContext.Provider
      value={{
        isDataLoading: isDataLoading,
        isDataLoadingHandler: isDataLoadingHandler,
        categoriesState: categoriesState,
        handleCategoryFetch: handleCategoryFetch,
        isNavHidden: isNavHidden,
        handleIsNavHidden: handleIsNavHidden,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
