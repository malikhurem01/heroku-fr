import React, { useCallback, useContext, useEffect, useState } from "react";

import AppContext from "../../Store/Context-API/app-context";
import ProductsGrid from "../../Components/Products/ProductsGrid";
import productService from "../../Services/productsService";

import gridActiveSvg from "../../Assets/Svg/gridActiveSvg.svg";
import gridNotActiveSvg from "../../Assets/Svg/gridNotActiveSvg.svg";
import listActiveSvg from "../../Assets/Svg/listActiveSvg.svg";
import listNotActiveSvg from "../../Assets/Svg/listNotActiveSvg.svg";

import minusSvg from "../../Assets/Svg/minusSvg.svg";

import "nouislider/dist/nouislider.css";
import noUiSlider from "nouislider";
import "./Slider.css";

import {
  BY_CREATION_DATE,
  BY_START_PRICE,
  BY_ALPHABET,
  BY_EXPIRATION_DATE,
  BY_START_PRICE_DESCENDING,
} from "../../Data/Constants/sort";

import classes from "./Shop.module.css";
import ExploreMoreButton from "../../Components/UI/ExploreMoreButton";
import ProductsList from "../../Components/Products/ProductsList";
import Category from "./Category";

const Shop = () => {
  const [products, setProductsState] = useState([]);
  const [allProductsFetched, setAllProductsFetched] = useState(false);
  const [productPreview, setProductPreview] = useState("GRID");
  const [priceFilter, setPriceFilter] = useState({ priceMin: 0, priceMax: 0 });
  const [priceRangeState, setPriceRangeState] = useState({ min: 0, max: 0 });
  const [filters, setFilters] = useState({
    category: null,
    subcategories: [],
    priceMin: 0,
    priceMax: 0,
    offset: 0,
    sort: BY_ALPHABET,
    direction: 0,
  });

  const { isDataLoadingHandler, handleCategoryFetch, categoriesState } =
    useContext(AppContext);

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
  const handlePreview = (preview) => {
    setProductPreview(preview);
  };

  //Adds a filter
  const handleAddFilter = (updatedFilter) => {
    let newState = {
      category: filters.category,
      subcategories: filters.subcategories,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      offset: filters.offset,
      sort: filters.sort,
      direction: filters.direction,
    };
    if (updatedFilter.category) {
      newState.category = updatedFilter.category;
    }
    if (updatedFilter.subcategory) {
      newState.subcategories.push(updatedFilter.subcategory);
    }
    if (updatedFilter.priceMin) {
      newState.priceMin = updatedFilter.priceMin;
    }
    if (updatedFilter.priceMax) {
      newState.priceMax = updatedFilter.priceMax;
    }
    if (updatedFilter.offset) {
      newState.offset = updatedFilter.offset;
    }
    if (updatedFilter.sort) {
      newState.sort = updatedFilter.sort;
    }
    if (updatedFilter.direction === 0 || updatedFilter.direction === 1) {
      newState.direction = updatedFilter.direction;
    }
    setFilters(() => newState);
  };

  //Removes a filter
  const handleRemoveFilter = (updatedFilter) => {
    let newState = {
      category: filters.category,
      subcategories: filters.subcategories,
      priceMin: filters.priceMin,
      priceMax: filters.priceMax,
      offset: filters.offset,
      sort: filters.sort,
      direction: filters.direction,
    };
    if (updatedFilter.category) {
      newState.category = null;
    }
    if (updatedFilter.subcategory) {
      let filteredSubcategoriesArray = newState.subcategories.filter(
        (el) => el.id !== updatedFilter.subcategory.id
      );
      newState.subcategories = filteredSubcategoriesArray;
    }
    if (updatedFilter.priceMin > 0) {
      newState.priceMin = 0;
    }
    if (updatedFilter.priceMax > 0) {
      newState.priceMax = 0;
    }
    if (updatedFilter.offset) {
      newState.offset = updatedFilter.offset;
    }
    if (updatedFilter.sort) {
      newState.sort = updatedFilter.sort;
    }
    if (updatedFilter.direction === 0 || updatedFilter.direction === 1) {
      newState.direction = updatedFilter.direction;
    }
    setFilters(() => newState);
  };

  const hasAnyFilter = () => {
    return (
      filters.category !== null ||
      filters.subcategories.length > 0 ||
      filters.priceMin > 0 ||
      filters.priceMax > 0
    );
  };

  //Calculate and return price range from fetched products
  const getFetchedProductsPriceRange = useCallback((products) => {
    const min = Math.min(...products.map((data) => data.product.startPrice));
    const max = Math.max(...products.map((data) => data.product.startPrice));
    return [min, max];
  }, []);

  const initializePriceSlider = useCallback(
    (priceMin, priceMax, overallMin, overallMax) => {
      //Get the slider container element
      let slider = document.getElementById("slider");
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
          setPriceFilter(() => {
            return {
              priceMin: Math.round(value[0]),
              priceMax: Math.round(value[1]),
            };
          });
        });
        //Update filter state when the mouse key is released
        slider.noUiSlider.on("change", (value) => {
          const min = Math.round(value[0]);
          const max = Math.round(value[1]);
          setTimeout(() => {
            setFilters((prevState) => {
              const updatedState = {
                category: prevState.category,
                subcategories: prevState.subcategories,
                priceMin: min,
                priceMax: max,
                sort: prevState.sort,
                offset: prevState.offset,
                direction: prevState.direction,
              };
              return updatedState;
            });
          }, 500);
        });
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
    []
  );

  //Handler for fetching products
  const handleProductFetch = useCallback(async () => {
    const filterRequestBody = {
      category: filters.category,
      subcategories: filters.subcategories.map((el) => el.id),
      priceMin: filters.priceMin,
      priceMax: filters.priceMax > 0 ? filters.priceMax : 2000,
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
        if (filters.offset === 0) {
          setProductsState(() => []);
        }
        //CHECK IF THERE ARE ANY PRODUCTS, IF NO, HIDE THE "EXPLORE MORE" BUTTON
        if (productsPage.length === 0) {
          setAllProductsFetched(true);
        } else {
          setAllProductsFetched(false);
        }
        /*
          THE FOLLOWING LINES OF CODE REPRESENT CONFIGURATION FOR PRICE SLIDER
          - CALCULATE THE OVERALL PRICE RANGE OF ALL LOADED PRODUCTS
          - KEEP THE PREVIOUS STATE OF PRICE SLIDER WHEN FILTERS STATE IS CHANGED
        */
        let [minRange, maxRange] = [100, 100];
        let [updatedMinRange, updatedMaxRange] = getFetchedProductsPriceRange(
          data.products
        );
        if (minRange > updatedMinRange) {
          minRange = updatedMinRange;
        }
        maxRange = updatedMaxRange;
        let overallMin, overallMax;
        setPriceRangeState((prevState) => {
          if (prevState.min === 0 && prevState.max === 0) {
            overallMin = minRange;
            overallMax = maxRange;
            return { min: minRange, max: maxRange };
          } else {
            overallMin = prevState.min;
            overallMax = prevState.max;
            return { min: prevState.min, max: prevState.max };
          }
        });
        let min, max;
        if (filters.priceMin === 0 && filters.priceMax === 0) {
          min = overallMin;
          max = overallMax;
          setPriceFilter(() => {
            const updatedState = {
              priceMin: overallMin,
              priceMax: overallMax,
            };
            return updatedState;
          });
        } else {
          min = filters.priceMin;
          max = filters.priceMax;
        }
        //IF MORE PRODUCTS ARE FETCHED WITH "EXPLORE MORE" BUTTON, DO NOT RESET THE PRODUCTS STATE COMPLETELY
        if (productsPage.length > 0) {
          setProductsState((prevProducts) => {
            //ADD NEW PRODUCTS WITHOUT REMOVING PREVIOUS WHEN USING EXPLORE MORE BUTTON
            const updatedProducts = [...prevProducts, ...productsPage];
            return updatedProducts;
          });
        }
        /*
          IF THERE ARE LESS THAN 8 (WHICH IS THE PAGE SIZE) PRODUCTS LOADED, THEN AUTOMATICALLY DISABLE THE "EXPLORE MORE" BUTTON
          BECAUSE THERE ARE NO MORE PRODUCTS TO BE FETCHED
        */
        if (productsPage.length < 8) {
          setAllProductsFetched(true);
        }
        //INITIALIZE THE PRICE SLIDER WITH THE PREVIOUSLY CALCULATED PRICE RANGES AND VALUES
        initializePriceSlider(min, max, overallMin, overallMax);
        //HIDE THE LOADING SCREEN
        isDataLoadingHandler(false);
      })
      .catch((err) => console.log("ERROR: " + err.message));
  }, [
    isDataLoadingHandler,
    initializePriceSlider,
    getFetchedProductsPriceRange,
    filters,
  ]);

  //State and methods to be passed down to Category and Subcategory child components
  const filterState = {
    filters,
    handleAddFilter,
    handleRemoveFilter,
  };

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
              return (
                <Category
                  key={category.name}
                  category={category}
                  filterState={filterState}
                />
              );
            })}
          </ul>
        </div>
        <div className={classes.subFilterContainer}>
          <div className={classes.priceFilterContainer}>
            <p className={classes.categoryTitle}>Price Range</p>
            <div className={classes.priceContainer}>
              <input
                id="min"
                value={priceFilter.priceMin}
                type="number"
                placeholder="$10"
                onChange={(ev) => {
                  if (ev.target.value) {
                    const filter = {
                      priceMin: parseInt(ev.target.value),
                      priceMax: priceFilter.priceMax,
                    };
                    setPriceFilter(() => filter);
                  }
                }}
              />
              <img src={minusSvg} alt="minus svg" />
              <input
                id="max"
                value={priceFilter.priceMax}
                type="number"
                placeholder="$1000"
                onChange={(ev) => {
                  const filter = {
                    priceMin: priceFilter.priceMin,
                    priceMax: parseInt(ev.target.value),
                  };
                  setPriceFilter(() => filter);
                }}
              />
            </div>
            <div id="slider"></div>
          </div>
        </div>
      </div>
      <div className={classes.shopProductsContainer}>
        {hasAnyFilter() && (
          <div className={classes.filtersListContainer}>
            {filters.category ? (
              <div
                onClick={() => {
                  const removedFilter = { category: filters.category };
                  handleRemoveFilter(removedFilter);
                }}
                className={classes.filterItem}
              >
                <p>Category: {filters.category}</p>
                <span>X</span>
              </div>
            ) : (
              ""
            )}
            {filters.subcategories.map((el) => {
              return (
                <div
                  onClick={() => {
                    const removedFilter = {
                      subcategory: { id: el.id, name: el.name },
                    };
                    handleRemoveFilter(removedFilter);
                  }}
                  key={el.id}
                  className={classes.filterItem}
                >
                  <p>Subcategory: {el.name}</p>
                  <span>X</span>
                </div>
              );
            })}
            {filters.priceMin > 0 || filters.priceMax > 0 ? (
              <div
                onClick={() => {
                  const removedFilter = {
                    priceMin: filters.priceMin,
                    priceMax: filters.priceMax,
                  };
                  handleRemoveFilter(removedFilter);
                }}
                className={classes.filterItem}
              >
                <p>
                  Price: ${filters.priceMin} - ${filters.priceMax}
                </p>
                <span>X</span>
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
              onClick={() => handlePreview("GRID")}
              src={productPreview === "LIST" ? gridNotActiveSvg : gridActiveSvg}
              alt="grid icon"
            />
            <span>Grid</span>
            <img
              onClick={() => handlePreview("LIST")}
              src={productPreview === "LIST" ? listActiveSvg : listNotActiveSvg}
              alt="list icon"
            />
            <span>List</span>
          </div>
        </div>
        {productPreview === "GRID" ? (
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
