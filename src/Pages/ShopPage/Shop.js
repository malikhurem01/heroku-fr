import React, { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../../Store/Context-API/app-context";
import ProductsGrid from "../../Components/Products/ProductsGrid";
import productService from "../../Services/productsService";

import gridActiveSvg from "../../Assets/Svg/gridActiveSvg.svg";
import gridNotActiveSvg from "../../Assets/Svg/gridNotActiveSvg.svg";
import listActiveSvg from "../../Assets/Svg/listActiveSvg.svg";
import listNotActiveSvg from "../../Assets/Svg/listNotActiveSvg.svg";
import minusSvg from "../../Assets/Svg/minusSvg.svg";

import classes from "./Shop.module.css";
import "nouislider/dist/nouislider.css";
import "./Slider.css";

import noUiSlider from "nouislider";
import Category from "./Category";
import ExploreMoreButton from "../../Components/UI/ExploreMoreButton";
import ProductsList from "../../Components/Products/ProductsList";

import {
  BY_CREATION_DATE,
  BY_START_PRICE,
  BY_ALPHABET,
  BY_EXPIRATION_DATE,
  BY_START_PRICE_DESCENDING,
} from "../../Data/Constants/sort";

const Shop = () => {
  const [products, setProductsState] = useState([]);
  const [allProductsFetched, setAllProductsFetched] = useState(false);
  const [productPreview, setProductPreview] = useState("grid");
  const [priceFilter, setPriceFilter] = useState({ priceMin: 0, priceMax: 0 });
  const [priceRangeState, setPriceRangeState] = useState({ min: 0, max: 0 });
  const [timeout, setTimeoutState] = useState(null);

  //App Context imports
  const {
    isDataLoadingHandler,
    handleCategoryFetch,
    setFilters,
    handleAddFilter,
    handleRemoveFilter,
    categoriesState,
    filters,
  } = useContext(AppContext);

  //Explore more handler
  const handleExploreMore = () => {
    const offsetValue = filters.offset + 1;
    const updatedConfigState = {
      offset: offsetValue,
      sort: filters.sort,
      direction: filters.direction,
    };
    handleAddFilter(updatedConfigState);
  };

  //When user selects a sort | Event
  const handleSortAction = ({ target }) => {
    let sortDirection;
    let selectedOptionindex =
      document.getElementById("sortDropdown").selectedIndex;
    //If the sort is descending instead of ascending, only third option in the SELECT input has that feature
    if (parseInt(selectedOptionindex) === 3) {
      sortDirection = 1;
    } else {
      sortDirection = 0;
    }
    //Update config state with latest offset, sort and direction properties
    const updatedConfigState = {
      offset: 0,
      sort: target.value,
      direction: sortDirection,
    };
    handleAddFilter(updatedConfigState);
  };

  //Grid or list preview handler
  const handlePreview = ({ target }) => {
    setProductPreview(target.name);
  };

  const hasAnyFilter = () => {
    return (
      filters.categories.length > 0 ||
      filters.subcategories.length > 0 ||
      filters.priceMin > 0 ||
      filters.priceMax > 0
    );
  };

  //Calculate and return price range from fetched products
  const getFetchedProductsPriceRange = useCallback((products) => {
    const min = Math.min(...products.map(({ product }) => product.startPrice));
    const max = Math.max(...products.map(({ product }) => product.startPrice));
    return [min, max];
  }, []);

  const initializePriceSlider = useCallback(
    (priceMin, priceMax, overallMin, overallMax) => {
      //Get the slider container element
      const slider = document.getElementById("slider");
      try {
        //Initialize the slider
        noUiSlider.create(slider, {
          start: [priceMin, priceMax],
          connect: true,
          range: {
            min: overallMin,
            max: overallMax,
          },
        });
        //Change price in input fields on each slider update
        slider.noUiSlider.on("update", (value) => {
          const min = Math.round(value[0]);
          const max = Math.round(value[1]);
          setPriceFilter(() => {
            return {
              priceMin: min,
              priceMax: max,
            };
          });
        });
        //Update filter state when the mouse key is released
        slider.noUiSlider.on("change", (value) => {
          const min = Math.round(value[0]);
          const max = Math.round(value[1]);
          setTimeout(() => {
            setPriceFilter(() => {
              return {
                priceMin: min,
                priceMax: max,
              };
            });
            setFilters(({ categories, subcategories, sort, direction }) => {
              const updatedState = {
                categories: categories,
                subcategories: subcategories,
                priceMin: min,
                priceMax: max,
                offset: 0,
                sort: sort,
                direction: direction,
              };
              return updatedState;
            });
          }, 500);
        });
        //IF THERE IS AN ERROR, IT MEANS THAT A SLIDER ALREADY EXISTS, THEN JUST UPDATE THE CONFIGURATION
      } catch {
        slider.noUiSlider.updateOptions({
          start: [priceMin, priceMax],
          range: {
            min: overallMin,
            max: overallMax,
          },
        });
      }
    },
    [setFilters]
  );

  //Handle price change when user uses the price slider
  const handlePriceInputChange = ({ target }) => {
    clearTimeout(timeout);
    let filter;
    if (target.id === "max") {
      filter = {
        priceMin: priceFilter.priceMin,
        priceMax: parseInt(target.value),
      };
    } else if (target.id === "min") {
      filter = {
        priceMin: parseInt(target.value),
        priceMax: priceFilter.priceMax,
      };
    }
    initializePriceSlider(
      filter.priceMin,
      filter.priceMax,
      priceRangeState.min,
      priceRangeState.max
    );
    setTimeoutState(() => {
      return setTimeout(() => {
        handleAddFilter({
          priceMin: priceFilter.priceMin,
          priceMax: priceFilter.priceMax,
        });
      }, 1000);
    });
  };

  //Handler for fetching products
  const handleProductFetch = useCallback(async () => {
    const filterRequestBody = {
      category: filters.categories.map(({ id }) => id),
      subcategories: filters.subcategories.map(({ id }) => id),
      priceMin: filters.priceMin,
      priceMax: filters.priceMax || 10000,
      offset: filters.offset,
      sort: filters.sort,
      direction: filters.direction,
    };
    //SET LOADING SCREEN
    isDataLoadingHandler(true);
    return productService
      .fetchProducts(filterRequestBody)
      .then(({ data }) => {
        const productsPage = data.products;
        if (filterRequestBody.offset === 0) {
          setProductsState(() => []);
        }
        //CHECK IF THERE ARE ANY PRODUCTS, IF NO, HIDE THE "EXPLORE MORE" BUTTON
        if (productsPage.length === 0) {
          setAllProductsFetched(true);
        } else {
          setAllProductsFetched(false);
        }
        //IF MORE PRODUCTS ARE FETCHED WITH "EXPLORE MORE" BUTTON, DO NOT RESET THE PRODUCTS STATE COMPLETELY
        let updatedProducts;
        if (productsPage.length > 0) {
          setProductsState((prevProducts) => {
            //ADD NEW PRODUCTS WITHOUT REMOVING PREVIOUS WHEN USING EXPLORE MORE BUTTON
            updatedProducts = [...prevProducts, ...productsPage];
            updatedProducts = updatedProducts.filter(
              (item, index) => updatedProducts.indexOf(item) === index
            );
            return updatedProducts;
          });
        }
        /*
          THE FOLLOWING LINES OF CODE REPRESENT CONFIGURATION FOR PRICE SLIDER
          - CALCULATE THE OVERALL PRICE RANGE OF ALL LOADED PRODUCTS
          - KEEP THE PREVIOUS STATE OF PRICE SLIDER WHEN FILTERS STATE IS CHANGED
        */
        if (filters.priceMin === 0 && filters.priceMax === 0) {
          setPriceFilter(() => {
            return { priceMin: 0, priceMax: 0 };
          });
        }
        let [priceFilterMin, priceFilterMax] = [null, null];
        let [minRange, maxRange] = [null, null];
        setPriceFilter((prevState) => {
          priceFilterMax = prevState.priceMax;
          priceFilterMin = prevState.priceMin;
          return prevState;
        });
        if (priceFilterMin === 0 && priceFilterMax === 0) {
          [minRange, maxRange] = getFetchedProductsPriceRange(updatedProducts);
          priceFilterMin = minRange;
          priceFilterMax = maxRange;
          setPriceRangeState(() => {
            return { min: minRange, max: maxRange };
          });
        }
        setPriceRangeState((prevState) => {
          minRange = prevState.min;
          maxRange = prevState.max;
          return prevState;
        });
        /*
          IF THERE ARE LESS THAN 8 (WHICH IS THE PAGE SIZE) PRODUCTS LOADED, THEN AUTOMATICALLY DISABLE THE "EXPLORE MORE" BUTTON
          BECAUSE THERE ARE NO MORE PRODUCTS TO BE FETCHED
        */
        if (productsPage.length < 8) {
          setAllProductsFetched(true);
        }
        //INITIALIZE THE PRICE SLIDER WITH THE PREVIOUSLY CALCULATED PRICE RANGES AND VALUES
        initializePriceSlider(
          priceFilterMin,
          priceFilterMax,
          minRange,
          maxRange
        );
        //HIDE THE LOADING SCREEN
        isDataLoadingHandler(false);
      })
      .catch(({ message }) => console.log("ERROR: " + message));
  }, [
    isDataLoadingHandler,
    initializePriceSlider,
    getFetchedProductsPriceRange,
    filters,
  ]);

  useEffect(() => {
    handleCategoryFetch();
  }, [handleCategoryFetch]);

  useEffect(() => {
    handleProductFetch();
  }, [handleProductFetch, filters]);

  return (
    <div className={classes.shopContainer}>
      <div className={classes.shopCategoriesContainer}>
        <div className={classes.subFilterContainer}>
          <p className={classes.categoryTitle}>PRODUCT CATEGORIES</p>
          <ul className={classes.categoriesList}>
            {categoriesState.map((category) => {
              return <Category key={category.name} category={category} />;
            })}
          </ul>
        </div>
        <div className={classes.subFilterContainer}>
          <div className={classes.priceFilterContainer}>
            <p className={classes.categoryTitle}>Price Range</p>
            <div className={classes.priceContainer}>
              <input
                disabled
                id="min"
                value={priceFilter.priceMin}
                type="number"
                placeholder="$10"
              />
              <img src={minusSvg} alt="minus svg" />
              <input
                disabled
                id="max"
                value={priceFilter.priceMax}
                type="number"
                placeholder="$1000"
              />
            </div>
            <div id="slider"></div>
          </div>
        </div>
      </div>
      <div className={classes.shopProductsContainer}>
        {hasAnyFilter() && (
          <div className={classes.filtersListContainer}>
            {filters.categories.map(({ id, name }) => {
              return (
                <div key={id} className={classes.filterItem}>
                  <p>Category: {name}</p>
                  <span
                    onClick={() => {
                      const removedFilter = {
                        category: { id, name },
                      };
                      handleRemoveFilter(removedFilter);
                    }}
                  >
                    X
                  </span>
                </div>
              );
            })}
            {filters.subcategories.map(({ id, name }) => {
              return (
                <div key={id} className={classes.filterItem}>
                  <p>Subcategory: {name}</p>
                  <span
                    onClick={() => {
                      const removedFilter = {
                        subcategory: { id, name },
                      };
                      handleRemoveFilter(removedFilter);
                    }}
                  >
                    X
                  </span>
                </div>
              );
            })}
            {filters.priceMin > 0 || filters.priceMax > 0 ? (
              <div className={classes.filterItem}>
                <p>
                  Price: ${filters.priceMin} - ${filters.priceMax}
                </p>
                <span
                  onClick={() => {
                    const removedFilter = {
                      priceMin: filters.priceMin,
                      priceMax: filters.priceMax,
                    };
                    handleRemoveFilter(removedFilter);
                  }}
                >
                  X
                </span>
              </div>
            ) : (
              ""
            )}
          </div>
        )}
        <div className={classes.filterAndSortBar}>
          <div className={classes.selectSort}>
            <select id="sortDropdown" onInput={handleSortAction}>
              <option value={BY_ALPHABET}>Default sorting</option>
              <option value={BY_CREATION_DATE}>Added: New to Old</option>
              <option value={BY_START_PRICE}>Price: Low to High</option>
              <option value={BY_START_PRICE_DESCENDING}>
                Price: High to Low
              </option>
              <option value={BY_EXPIRATION_DATE}>Time left</option>
            </select>
          </div>
          <div className={classes.viewIconsContainer}>
            <img
              name="grid"
              onClick={handlePreview}
              src={productPreview === "list" ? gridNotActiveSvg : gridActiveSvg}
              alt="grid icon"
            />
            <span>Grid</span>
            <img
              name="list"
              onClick={handlePreview}
              src={productPreview === "list" ? listActiveSvg : listNotActiveSvg}
              alt="list icon"
            />
            <span>List</span>
          </div>
        </div>
        {productPreview === "grid" ? (
          <ProductsGrid products={products} />
        ) : (
          <ProductsList products={products} />
        )}
        <div
          onClick={handleExploreMore}
          className={classes.exploreMore_container}
        >
          {!allProductsFetched ? (
            <ExploreMoreButton />
          ) : (
            <p className={classes.no_products_message}>No more products</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;
