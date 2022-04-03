import React, { useCallback, useContext, useEffect, useState } from "react";
import AppContext from "../../Store/Context-API/app-context";
import ProductsGrid from "../../Components/Products/ProductsGrid";
import productService from "../../Services/productsService";

import gridActiveSvg from "../../Assets/Svg/gridActiveSvg.svg";
import gridNotActiveSvg from "../../Assets/Svg/gridNotActiveSvg.svg";
import listActiveSvg from "../../Assets/Svg/listActiveSvg.svg";
import listNotActiveSvg from "../../Assets/Svg/listNotActiveSvg.svg";

import minusSvg from "../../Assets/Svg/minusSvg.svg";

import { BY_CREATION_DATE } from "../../Data/Constants/sort";

import classes from "./Shop.module.css";
import ExploreMoreButton from "../../Components/UI/ExploreMoreButton";
import ProductsList from "../../Components/Products/ProductsList";
import Category from "./Category";
import useQuery from "../../Hooks/useQuery";

const Shop = () => {
  const [products, setProductsState] = useState([]);
  const [offset, setOffset] = useState(0);
  const [allProductsFetched, setAllProductsFetched] = useState(false);
  const [sort, setSort] = useState(BY_CREATION_DATE);
  const [productPreview, setProductPreview] = useState("GRID");

  const { isDataLoadingHandler, handleCategoryFetch, categoriesState } =
    useContext(AppContext);
  const query = useQuery();

  const handleExploreMore = () => {
    //SET PAGE OFFSET
    const offsetValue = offset + 1;
    setOffset(offsetValue);
    //FETCH MORE PRODUCTS
    handleProductFetch(sort, offsetValue);
  };

  const handleSortAction = ({ target }) => {
    const offsetValue = 0;
    setOffset(offsetValue);
    setAllProductsFetched(false);
    setProductsState([]);
    setSort(target.value);
    handleProductFetch(target.value, offsetValue);
  };

  const handlePreview = (preview) => {
    setProductPreview(preview);
  };

  const handleProductFetch = useCallback(
    async (offset, sort) => {
      //SET LOADING SCREEN
      isDataLoadingHandler(true);
      const categoryId = query.get("categoryId");
      (async function (id) {
        if (id) {
          return productService.fetchByCategoryId(id, sort, offset);
        } else {
          return productService.fetchAllProducts(sort, offset);
        }
      })(categoryId)
        .then(({ data }) => {
          const productsPage = data.productDTOPage;
          //CHECK IF THERE ARE ANY PRODUCTS
          if (productsPage.length === 0) {
            setAllProductsFetched(true);
          }
          if (productsPage.length > 0) {
            setProductsState((prevProducts) => {
              //ADD NEW PRODUCTS WITHOUT REMOVING PREVIOUS WHEN USING EXPLORE MORE BUTTON
              const updatedProducts = [...prevProducts, ...productsPage];
              return updatedProducts;
            });
          }
          isDataLoadingHandler(false);
        })
        .catch((err) => console.log("ERROR: " + err.message));
    },
    [isDataLoadingHandler, query]
  );

  useEffect(() => {
    handleCategoryFetch();
    handleProductFetch(offset, sort);
  }, [handleProductFetch, handleCategoryFetch, offset, sort]);

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
          <div>
            <p className={classes.categoryTitle}>Price Range</p>
            <div className={classes.priceContainer}>
              <input type="number" placeholder="$10" />
              <img src={minusSvg} alt="minus svg" />
              <input type="number" placeholder="$1000" />
            </div>
          </div>
        </div>
      </div>
      <div className={classes.shopProductsContainer}>
        <div className={classes.filterAndSortBar}>
          <div className={classes.selectSort}>
            <select
              name="cars"
              id="cars"
              defaultValue="createdAt"
              onInput={handleSortAction}
            >
              <option value="createdAt">Default sorting</option>
              <option value="createdAt">Newness</option>
              <option value="startPrice">Price</option>
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
