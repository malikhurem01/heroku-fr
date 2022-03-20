import React, { useCallback, useContext, useEffect, useState } from "react";
import useQuery from "../../Hooks/useQuery";
import NavLocation from "../../Components/Header/Location/NavLocation";
import Notification from "./Notification";
import AuthContext from "../../Store/auth-context";
import productService from "../../Services/productsService";
import bidService from "../../Services/bidService";
import constants from "../../Data/Constants/bid";

import arrow from "../../Assets/Svg/arrowRight.svg";
import exclamationMark from "../../Assets/Svg/exclamation-mark.svg";

import calculateDaysRemaining from "../../Utils/calculateDaysRemaining";

import classes from "./ProductOverviewPage.module.css";

const ProductOverviewPage = () => {
  const INITIAL_BID_NOTIFICATION_STATE = {
    state: null,
    message: null,
  };

  const INITIAL_PRODUCT_HISTORY_STATE = {
    latestBidderId: null,
    highestBid: null,
    numberOfBids: null,
  };

  const INITIAL_PRODUCT_STATE = {};

  const { userDataState, isDataFetchedHandler } = useContext(AuthContext);

  const [bidNotification, setBidNotification] = useState(
    INITIAL_BID_NOTIFICATION_STATE
  );
  const [productBidHistory, setProductBidHistory] = useState(
    INITIAL_PRODUCT_HISTORY_STATE
  );
  const [mainImage, setMainImage] = useState({});
  const [images, setImages] = useState([]);
  const [bidPrice, setBidPrice] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isUserLatestBidder, setIsUserLatestBidder] = useState(false);
  const [error, setError] = useState(false);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);

  const query = useQuery();
  const productId = query.get("productId");

  const isLoggedIn = userDataState ? true : false;

  const handleImageChange = (ev) => {
    setMainImage(ev.target.src);
  };

  const handleBidPrice = (ev) => {
    setBidPrice(ev.target.value);
  };

  const handleBidHistory = (bidHistory) => {
    setProductBidHistory(() => bidHistory);
  };

  const handleBidRequest = async () => {
    if (!bidPrice) {
      setError("Please input a value.");
      return;
    }
    if (bidPrice > productBidHistory.highestBid * 2) {
      setError("Input a realistic bid.");
      setBidPrice(null);
      return;
    }
    let token = JSON.parse(sessionStorage.getItem("user_jwt"));
    let data = {
      productId: productId,
      bidPrice: bidPrice,
    };
    isDataFetchedHandler(false);
    bidService
      .makeBid(token.access_token, data)
      .then((bidResponse) => {
        isDataFetchedHandler(true);
        let userId = bidResponse.data.userId.userId;
        setBidNotification({
          state: "SUCCESS",
          message: constants.SUCCESS_MESSAGE,
        });
        handleBidHistory({
          latestBidderId: userId,
          highestBid: bidResponse.data.bidPrice,
          numberOfBids: ++productBidHistory.numberOfBids,
        });
        if (userId === userDataState.userId) {
          setIsUserLatestBidder(true);
        }
      })
      .catch((err) => {
        isDataFetchedHandler(true);
        setBidNotification({
          state: "ERROR",
          message: constants.ERROR_MESSAGE,
        });
      });
  };

  const handleTimeRemaining = useCallback((date, responseProduct) => {
    const WEEKS_REMAINING = Math.floor(
      calculateDaysRemaining(date, responseProduct.auctionDateEnd) / 7
    );
    const DAYS_REMAINING =
      calculateDaysRemaining(date, responseProduct.auctionDateEnd) % 7;
    setWeeks(WEEKS_REMAINING);
    setDays(DAYS_REMAINING);
  }, []);

  const handleFetchProduct = useCallback(() => {
    isDataFetchedHandler(false);
    productService.fetchProductById(productId).then((response) => {
      isDataFetchedHandler(true);
      setProduct(() => response.data.product);
      setImages(() => response.data.images);
      setMainImage(() => response.data.product.imageMainUrl);
      handleTimeRemaining(response.headers.date, response.data.product);
      if (userDataState) {
        if (response.data.product.userId["userId"] === userDataState.userId) {
          setIsAvailable(false);
        }
      }
    });
  }, [isDataFetchedHandler, handleTimeRemaining, productId, userDataState]);

  useEffect(() => {
    handleFetchProduct();
  }, [handleFetchProduct]);

  useEffect(() => {
    bidService.getBidHistory(productId).then((response) => {
      if (response.data.highestBid > 0) {
        setProductBidHistory(() => response.data);
        if (userDataState) {
          if (response.data.latestBidderId === userDataState.userId) {
            console.log("uslo je");
            let bidState = {
              state: "SUCCESS",
              message: constants.SUCCESS_MESSAGE,
            };
            setBidNotification(() => bidState);
            setIsUserLatestBidder(true);
          }
        }
      }
    });
  }, [productId, product.start_price, userDataState]);
  return (
    <React.Fragment>
      <NavLocation
        location={product.title}
        path={{ main: "Shop", page: "Single product" }}
      />
      {bidNotification.state ? (
        <Notification
          state={bidNotification.state}
          message={bidNotification.message}
        />
      ) : (
        ""
      )}

      <div className={classes.about_product_container}>
        <div className={classes.about_product_pictures_container}>
          <div className={classes.about_product_main_picture}>
            <img src={mainImage} alt="product main" />
          </div>
          <div className={classes.about_product_pictures_row}>
            {images.map((image) => {
              return (
                <img
                  onClick={handleImageChange}
                  src={image.imageUrl}
                  alt="no product cover"
                  key={image.imageUrl}
                />
              );
            })}
          </div>
        </div>
        <div className={classes.about_product_information}>
          <p className={classes.about_product_main_title}>{product.title}</p>
          <p className={classes.about_product_starting_price}>
            Starts from &nbsp;
            <span className={classes.product_emphasize}>
              ${product.startPrice}
            </span>
          </p>
          <div className={classes.about_product_auction}>
            <p>
              Highest bid:&nbsp;
              <span className={classes.product_emphasize}>
                ${productBidHistory.highestBid || product.startPrice}
              </span>
            </p>
            <p>
              Number of bids:&nbsp;
              <span className={classes.product_emphasize}>
                {productBidHistory.numberOfBids || 0}
              </span>
            </p>
            <p>
              Time left:&nbsp;
              <span className={classes.product_emphasize}>
                {weeks === 1 ? `${weeks} Week` : `${weeks} Weeks`}{" "}
                {days === 1 ? `${days} Day` : `${days} Days`}
              </span>
            </p>
          </div>
          {!isUserLatestBidder &&
            isAvailable &&
            bidNotification.state !== "SUCCESS" && (
              <div className={classes.product_bid_container}>
                {isLoggedIn ? (
                  <React.Fragment>
                    <input
                      onChange={handleBidPrice}
                      className={classes.bid_input}
                      type="number"
                      placeholder={`Enter $${
                        productBidHistory.highestBid || product.startPrice
                      } or higher`}
                    />

                    <button onClick={handleBidRequest} className={classes.btn}>
                      Place bid
                      <div className={classes.arrow}>
                        <img src={arrow} alt="arrow on a button" />
                      </div>
                    </button>
                  </React.Fragment>
                ) : (
                  <div className={classes.bid_error}>
                    <p>Please log in to place a bid.</p>{" "}
                    <img src={exclamationMark} alt="exclamation mark" />
                  </div>
                )}

                {error && (
                  <div className={classes.bid_high_error}>
                    <p>{error}</p>{" "}
                    <img src={exclamationMark} alt="exclamation mark" />
                  </div>
                )}
              </div>
            )}
          {!isAvailable && (
            <div className={classes.user_owner}>
              <p>You can not place a bid on your own product</p>{" "}
              <img src={exclamationMark} alt="exclamation mark" />
            </div>
          )}
          <div className={classes.products_tabs}>
            <p className={classes.products_tab_active} onClick={() => {}}>
              Details
            </p>
          </div>
          <div className={classes.products_container}>
            <p className={classes.paragraph}>{product.description}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductOverviewPage;
