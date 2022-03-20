import React, { useCallback, useContext, useEffect, useState } from "react";

import ProductsGrid from "../../Components/Products/ProductsGrid";

import productService from "../../Services/productsService";

import arrow from "../../Assets/Svg/arrowRight.svg";

import classes from "./LandingPage.module.css";
import ExploreMoreButton from "../../Components/UI/ExploreMoreButton";

import AuthContext from "../../Store/auth-context";

// TODO
// Implement proper categories filtering in next sprint and revisit this code.
const categories = [
  { name: "Fashion", url: "/categories?category=Fashion" },
  { name: "Accesories", url: "/categories?category=Accesories" },
  { name: "Jewlery", url: "/categories?category=Jewlery" },
  { name: "Shoes", url: "/categories?category=Shoes" },
  { name: "Sportware", url: "/categories?category=Sportware" },
  { name: "Home", url: "/categories?category=Home" },
  { name: "Electronics", url: "/categories?category=Electronics" },
  { name: "Mobile", url: "/categories?category=Mobile" },
  { name: "Computer", url: "/categories?category=Computer" },
  { name: "All Categories", url: "/categories?category=All" },
];

const LandingPage = () => {
  const { isDataFetchedHandler } = useContext(AuthContext);

  const [newArrivalsActive, setNewArrivalsActive] = useState(true);
  const [lastChanceActive, setLastChanceActive] = useState(false);
  const [productsState, setProductsState] = useState([]);
  const [advertProduct, setAdvertProduct] = useState({ title: null });
  const [allProductsFetched, setAllProductsFetched] = useState(false);
  const [offset, setOffset] = useState(0);

  const resetDisplayedData = () => {
    setOffset(0);
    setProductsState([]);
    setAllProductsFetched(false);
  };

  const handleTabChange = (tab) => {
    resetDisplayedData();
    if (tab === "NEW_ARRIVALS") {
      handleProductFetch("createdAt", 0);
      tabsHandler({ newArrivals: true, lastChance: false });
    } else if (tab === "LAST_CHANCE") {
      handleProductFetch("auctionDateEnd", 0);
      tabsHandler({ newArrivals: false, lastChance: true });
    }
  };

  const tabsHandler = ({ newArrivals, lastChance }) => {
    setNewArrivalsActive(newArrivals);
    setLastChanceActive(lastChance);
  };

  const handleProductFetch = useCallback(
    (sort, offset) => {
      isDataFetchedHandler(false);
      productService.fetchAllProducts(sort, offset).then((response) => {
        isDataFetchedHandler(true);
        const productsPage = response.data.products.content;
        if (productsPage.length === 0) {
          setAllProductsFetched(true);
        }
        if (productsPage.length > 0) {
          setProductsState((prevProducts) => {
            const updatedProducts = [...prevProducts, ...productsPage];
            return updatedProducts;
          });
          setAdvertProduct(() => productsPage[0]);
        }
      });
    },
    [isDataFetchedHandler]
  );

  const handleExploreMore = () => {
    const sort = newArrivalsActive ? "createdAt" : "auctionDateEnd";
    const offsetValue = offset + 1;
    setOffset(offsetValue);
    handleProductFetch(sort, offsetValue);
  };

  useEffect(() => {
    handleProductFetch("createdAt", 0);
  }, [handleProductFetch]);

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.categories_container}>
          <p>Categories</p>
          <ul className={classes.categoriesList}>
            {categories.map(({ name, url }) => {
              return (
                <li key={name}>
                  <a href={url}>{name}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={classes.product}>
          <div className={classes.advertisement_product_about}>
            <h3>{advertProduct.title}</h3>
            <h3>Start From ${advertProduct.startPrice}</h3>
            <p className={classes.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              placerat mi commodo odio condimentum fermentum. Integer viverra
              ligula libero, id dapibus turpis lobortis et. Pellentesque
              habitant morbi tristique senectus et netus et malesuada fames ac
              turpis egestas. Maecenas eget suscipit nisl. Morbi a nisi
              condimentum, imperdiet risus id, sagittis ligula.
            </p>
            <a
              href={`/shop/product?productId=${advertProduct.productId}`}
              className={classes.btn}
            >
              BID NOW
              <div className={classes.arrow}>
                <img src={arrow} alt="arrow on a button" />
              </div>
            </a>
          </div>
          <div className={classes.advertisement_product_image}>
            <img src={advertProduct.imageMainUrl} alt="highlighted product" />
          </div>
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
