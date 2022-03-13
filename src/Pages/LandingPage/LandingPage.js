import React, { useEffect, useState } from "react";

import ProductsGrid from "../../Components/Products/ProductsGrid";

import productService from "../../Services/productsService";

import arrow from "../../Assets/arrowRight.svg";

import classes from "./LandingPage.module.css";

// TODO
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
  const [newArrivalsActive, setNewArrivalsActive] = useState(true);
  const [lastChanceActive, setLastChanceActive] = useState(false);
  const [productsState, setProductsState] = useState([]);
  const [advertProduct, setAdvertProduct] = useState({ title: null });

  const tabsHandler = ({ newArrivals, lastChance }) => {
    setNewArrivalsActive(newArrivals);
    setLastChanceActive(lastChance);
  };

  useEffect(() => {
    productService.fetchAllProducts().then((response) => {
      if (response.data.length >= 1) {
        setProductsState(() => response.data);
        setAdvertProduct(() => response.data[2]);
      }
    });
  }, []);

  return (
    <React.Fragment>
      <div className={classes.container}>
        <div className={classes.categories_container}>
          <p>Categories</p>
          <ul className={classes.categoriesList}>
            {categories.map((el) => {
              return (
                <li key={el.name}>
                  <a href={el.url}>{el.name}</a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className={classes.product}>
          <div className={classes.advertisement_product_about}>
            <h3>{advertProduct.title}</h3>
            <h3>Start From ${advertProduct.start_price}</h3>
            <p className={classes.paragraph}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut
              placerat mi commodo odio condimentum fermentum. Integer viverra
              ligula libero, id dapibus turpis lobortis et. Pellentesque
              habitant morbi tristique senectus et netus et malesuada fames ac
              turpis egestas. Maecenas eget suscipit nisl. Morbi a nisi
              condimentum, imperdiet risus id, sagittis ligula.
            </p>
            <a
              href={`/shop/product/${advertProduct.product_id}`}
              className={classes.btn}
            >
              BID NOW
              <div className={classes.arrow}>
                <img src={arrow} alt="arrow on a button" />
              </div>
            </a>
          </div>
          <div className={classes.advertisement_product_image}>
            <img src={advertProduct.image_main_url} alt="highlighted product" />
          </div>
        </div>
      </div>
      <div>
        <div className={classes.products_tabs}>
          <p
            onClick={() => {
              tabsHandler({ newArrivals: true, lastChance: false });
            }}
            className={newArrivalsActive ? classes.products_tab_active : " "}
          >
            New Arrivals
          </p>
          <p
            onClick={() => {
              tabsHandler({ newArrivals: false, lastChance: true });
            }}
            className={lastChanceActive ? classes.products_tab_active : " "}
          >
            Last Chance
          </p>
        </div>
        <div className={classes.products_container}>
          <ProductsGrid products={productsState} />
        </div>
      </div>
    </React.Fragment>
  );
};

export default LandingPage;
