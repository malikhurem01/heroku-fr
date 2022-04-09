import React, { useCallback, useContext, useEffect, useState } from "react";

import ProductsGrid from "../../Components/Products/ProductsGrid";

import productService from "../../Services/productsService";

import ExploreMoreButton from "../../Components/UI/ExploreMoreButton";
import arrow from "../../Assets/Svg/arrowRight.svg";

import AppContext from "../../Store/Context-API/app-context";
import {
  BY_CREATION_DATE,
  BY_EXPIRATION_DATE,
} from "../../Data/Constants/sort";

import classes from "./LandingPage.module.css";
import { Link } from "react-router-dom";

const LandingPage = () => {
  // Context hook
  const {
    isDataLoading,
    isDataLoadingHandler,
    categoriesState,
    handleCategoryFetch,
  } = useContext(AppContext);

  //States
  const [newArrivalsActive, setNewArrivalsActive] = useState(true);
  const [lastChanceActive, setLastChanceActive] = useState(false);
  const [allProductsFetched, setAllProductsFetched] = useState(false);
  const [configState, setConfigState] = useState({
    offset: 0,
    sort: BY_CREATION_DATE,
  });
  const [productsState, setProductsState] = useState([]);
  const [advertProduct, setAdvertProduct] = useState({});

  const { title, startPrice, imageMainUrl, productId } = advertProduct;

  //Handlers
  const handleDataReset = () => {
    const updatedProductState = [];
    setProductsState(() => updatedProductState);
    setAllProductsFetched(false);
  };

  const handleTabs = ({ newArrivals, lastChance }) => {
    setNewArrivalsActive(newArrivals);
    setLastChanceActive(lastChance);
  };

  const handleTabChange = (tab) => {
    handleDataReset();
    if (tab === "NEW_ARRIVALS") {
      const updatedConfigState = {
        offset: 0,
        sort: BY_CREATION_DATE,
      };
      setConfigState(() => updatedConfigState);
      handleTabs({ newArrivals: true, lastChance: false });
    } else if (tab === "LAST_CHANCE") {
      const updatedConfigState = {
        offset: 0,
        sort: BY_EXPIRATION_DATE,
      };
      setConfigState(() => updatedConfigState);
      handleTabs({ newArrivals: false, lastChance: true });
    }
  };

  const handleExploreMore = () => {
    //SET PAGE OFFSET
    const offsetValue = configState.offset + 1;
    const sort = newArrivalsActive ? BY_CREATION_DATE : BY_EXPIRATION_DATE;
    setConfigState({ offset: offsetValue, sort: sort });
  };

  const handleProductFetch = useCallback(async () => {
    const filterRequestBody = {
      category: null,
      subcategories: [],
      priceMin: 0,
      priceMax: 400,
      offset: configState.offset,
      pageSize: 8,
      sort: configState.sort,
    };
    //SET LOADING SCREEN
    isDataLoadingHandler(true);
    return productService
      .fetchProducts(filterRequestBody)
      .then(({ data }) => {
        const productsPage = data.products;
        //CHECK IF THERE ARE ANY PRODUCTS
        if (productsPage.length === 0) {
          setAllProductsFetched(true);
        } else {
          setAllProductsFetched(false);
        }
        if (productsPage.length > 0) {
          //SET ADVERT PRODUCT
          setAdvertProduct(productsPage[0].product);
          setProductsState((prevProducts) => {
            //ADD NEW PRODUCTS WITHOUT REMOVING PREVIOUS WHEN USING EXPLORE MORE BUTTON
            const updatedProducts = [...prevProducts, ...productsPage];
            return updatedProducts;
          });
        }
        if (productsPage.length < 8) {
          setAllProductsFetched(true);
        }
        isDataLoadingHandler(false);
      })
      .catch((err) => console.log("ERROR: " + err.message));
  }, [isDataLoadingHandler, configState.sort, configState.offset]);

  const handleSetCategoryFilter = (ev) => {
    const filter = {
      category: ev.target.parentNode.id,
      subcategories: [],
      priceMin: 0,
      priceMax: 400,
    };
    //handleSetFilter(filter);
  };

  useEffect(() => {
    //FETCH ALL AVAILABLE CATEGORIES
    handleCategoryFetch();
  }, [handleCategoryFetch]);

  useEffect(() => {
    //FETCH PRODUCTS
    handleProductFetch();
  }, [handleProductFetch]);

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.categories_container}>
          <p>Categories</p>
          <ul className={classes.categoriesList}>
            {categoriesState.map(({ name, id }) => {
              return (
                <li id={id} key={name}>
                  <Link to={"/shop"} onClick={handleSetCategoryFilter}>
                    {name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={classes.product}>
          {!isDataLoading && (
            <React.Fragment>
              <div className={classes.advertisement_product_about}>
                <h3>{title}</h3>
                <h3>Start From ${startPrice}</h3>
                <p className={classes.paragraph}>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
                  placerat mi commodo odio condimentum fermentum. Integer
                  viverra ligula libero, id dapibus turpis lobortis et.
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Maecenas eget suscipit
                  nisl. Morbi a nisi condimentum, imperdiet risus id, sagittis
                  ligula.
                </p>
                <a
                  href={`/shop/product?productId=${productId}`}
                  className={classes.btn}
                >
                  BID NOW
                  <div className={classes.arrow}>
                    <img src={arrow} alt="arrow on a button" />
                  </div>
                </a>
              </div>
              <div className={classes.advertisement_product_image}>
                <img src={imageMainUrl} alt="highlighted product" />
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
      <div>
        <div className={classes.products_tabs}>
          <p
            onClick={() => {
              handleTabChange("NEW_ARRIVALS");
            }}
            className={newArrivalsActive ? classes.products_tab_active : " "}
          >
            New Arrivals
          </p>
          <p
            onClick={() => {
              handleTabChange("LAST_CHANCE");
            }}
            className={lastChanceActive ? classes.products_tab_active : " "}
          >
            Last Chance
          </p>
        </div>
        <div className={classes.products_container}>
          <ProductsGrid products={productsState} />
        </div>
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
    </React.Fragment>
  );
};

export default LandingPage;
