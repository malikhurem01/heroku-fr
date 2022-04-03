import React, { useCallback, useState } from "react";
import categoryService from "../../Services/categoriesService";

const AppContext = React.createContext({
  isDataLoading: null,
  isDataLoadingHandler: () => {},
  categoriesState: null,
  handleCategoryFetch: () => {},
});

export default AppContext;

export const AppContextProvider = ({ children }) => {
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [categoriesState, setCategoriesState] = useState([]);

  const isDataLoadingHandler = useCallback((state) => {
    setIsDataLoading(state);
  }, []);

  const handleCategoryFetch = useCallback(async () => {
    return categoryService.fetchAllCategories().then(({ data }) => {
      let categoriesMapped = [];
      data.forEach(({ subcategoryDTOList, name }) => {
        let subcategories = [];
        subcategoryDTOList.forEach(({ name }) => {
          subcategories.push({ name });
        });
        categoriesMapped.push({ name, subcategories });
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
