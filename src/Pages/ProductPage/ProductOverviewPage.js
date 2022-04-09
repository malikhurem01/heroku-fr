import React, { useCallback, useContext, useEffect, useState } from "react";
import useQuery from "../../Hooks/useQuery";
import NavLocation from "../../Components/Header/Location/NavLocation";
import Notification from "./Notification";
import AuthContext from "../../Store/Context-API/auth-context";
import productService from "../../Services/productsService";
import bidService from "../../Services/bidService";
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from "../../Data/Constants/bid";

import arrow from "../../Assets/Svg/arrowRight.svg";
import exclamationMark from "../../Assets/Svg/exclamation-mark.svg";

import calculateDaysRemaining from "../../Utils/calculateDaysRemaining";

import classes from "./ProductOverviewPage.module.css";
import AppContext from "../../Store/Context-API/app-context";

const ProductOverviewPage = () => {
  //INITIAL STATES
  const INITIAL_BID_NOTIFICATION_STATE = {
    notificationState: null,
    notificationMessage: null,
  };

  const INITIAL_PRODUCT_HISTORY_STATE = {
    latestBidderId: null,
    highestBid: null,
    numberOfBids: null,
  };

  const INITIAL_PRODUCT_STATE = {};

  const INITIAL_IMAGES_STATE = [];

  //STATES
  const [bidPrice, setBidPrice] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isUserLatestBidder, setIsUserLatestBidder] = useState(false);
  const [error, setError] = useState(false);
  const [weeks, setWeeks] = useState(0);
  const [days, setDays] = useState(0);
  const [mainImage, setMainImage] = useState({});
  const [images, setImages] = useState(INITIAL_IMAGES_STATE);
  const [productState, setProduct] = useState(INITIAL_PRODUCT_STATE);
  const [bidNotification, setBidNotification] = useState(
    INITIAL_BID_NOTIFICATION_STATE
  );
  const [productBidHistory, setProductBidHistory] = useState(
    INITIAL_PRODUCT_HISTORY_STATE
  );

  const { notificationState, notificationMessage } = bidNotification;
  const { highestBid, numberOfBids } = productBidHistory;
  const { title, description, startPrice } = productState;

  //HOOKS
  const query = useQuery();
  const { userDataState } = useContext(AuthContext);
  const { isDataLoadingHandler } = useContext(AppContext);

  const productIdParameter = query.get("productId");

  const isLoggedIn = userDataState ? true : false;

  //HANDLERS
  const handleImageChange = ({ target }) => {
    setMainImage(target.src);
  };

  const handleBidPrice = ({ target }) => {
    setBidPrice(target.value);
  };

  const handleBidHistory = (bidHistory) => {
    setProductBidHistory(() => bidHistory);
  };

  const handleTimeRemainingState = useCallback((weeks, days) => {
    setWeeks(weeks);
    setDays(days);
  }, []);

  const handleBidRequest = async () => {
    //IF THERE IS NO BID PRICE SEND AN ERROR MESSAGE
    if (!bidPrice) {
      setError("Please input a value.");
      return;
    }
    //IF THE PRICE IS ENORMOUSLY HIGH SEND AN ERROR MESSAGE
    if (bidPrice > highestBid * 2) {
      setError("Input a realistic bid.");
      return;
    }
    //GATHER AUTHORIZATION HEADER DATA
    let { access_token } = JSON.parse(sessionStorage.getItem("user_jwt"));
    let data = {
      productId: productIdParameter,
      bidPrice: bidPrice,
    };
    //DISPLAY LOADING SCREEN
    isDataLoadingHandler(true);
    return (
      bidService
        .makeBid(access_token, data)
        //IF SUCCESS
        .then(({ data }) => {
          //SET NOTIFICATION
          let userId = data.user.userId;
          setBidNotification({
            notificationState: "SUCCESS",
            notificationMessage: SUCCESS_MESSAGE,
          });
          //UPDATE BID HISTORY
          handleBidHistory({
            latestBidderId: userId,
            highestBid: data.bidPrice,
            numberOfBids: numberOfBids + 1,
          });
          //SET LATEST BIDDER NOTIFICATION
          setIsUserLatestBidder(true);
          //REMOVE LOADING SCREEN
          isDataLoadingHandler(false);
        })
        //IF FAILURE
        .catch(() => {
          //SET ERROR NOTIFICATION
          setBidNotification({
            notificationState: "ERROR",
            notificationMessage: ERROR_MESSAGE,
          });
          //REMOVE LOADING SCREEN
          isDataLoadingHandler(false);
        })
    );
  };

  const handleTimeRemaining = useCallback(
    (date, { auctionDateEnd }) => {
      const WEEKS_REMAINING = Math.floor(
        calculateDaysRemaining(date, auctionDateEnd) / 7
      );
      const DAYS_REMAINING = calculateDaysRemaining(date, auctionDateEnd) % 7;
      handleTimeRemainingState(WEEKS_REMAINING, DAYS_REMAINING);
    },
    [handleTimeRemainingState]
  );

  const handleFetchProduct = useCallback(async () => {
    //SET LOADING SCREEN
    isDataLoadingHandler(true);

    //GET REQUEST
    return productService
      .fetchProductById(productIdParameter)
      .then(({ data, headers }) => {
        //SET PRODUCT STATE
        setProduct(() => data.product);
        setImages(data.product.images);
        setMainImage(() => data.product.imageMainUrl);
        handleTimeRemaining(headers.date, data.product);
        if (userDataState) {
          //IF THE LOGGED IN USER IS THE OWNER, DISABLE BIDDING
          if (data.product.user["userId"] === userDataState.userId) {
            setIsAvailable(false);
          }
        }
        isDataLoadingHandler(false);
      });
  }, [
    isDataLoadingHandler,
    handleTimeRemaining,
    productIdParameter,
    userDataState,
  ]);

  const handleFetchBidHistory = useCallback(async () => {
    return bidService.getBidHistory(productIdParameter).then(({ data }) => {
      //CHECKS WHETHER THE HIGHEST BID EXISTS
      if (data.highestBid) {
        setProductBidHistory(() => data);
        if (userDataState) {
          //CHECKS WHETHER THE LOGGED IN USER IS THE LATTEST BIDDER, IF YES SET THE NOTIFICATION
          if (data.latestBidderId === userDataState.userId) {
            let bidState = {
              notificationState: "SUCCESS",
              notificationMessage: SUCCESS_MESSAGE,
            };
            setBidNotification(() => bidState);
            setIsUserLatestBidder(true);
          }
        }
      }
    });
  }, [productIdParameter, userDataState]);

  //HOOKS FOR DATA FETCHING
  useEffect(() => {
    handleFetchProduct();
  }, [handleFetchProduct]);

  useEffect(() => {
    handleFetchBidHistory();
  }, [handleFetchBidHistory]);

  return (
    <React.Fragment>
      <NavLocation
        location={title}
        path={{ main: "Shop", page: "Single product" }}
      />
      {notificationState && (
        <Notification state={notificationState} message={notificationMessage} />
      )}

      <div className={classes.about_product_container}>
        <div className={classes.about_product_pictures_container}>
          <div className={classes.about_product_main_picture}>
            <img src={mainImage} alt="product main" />
          </div>
          <div className={classes.about_product_pictures_row}>
            {images.map(({ imageUrl }) => {
              return (
                <img
                  onClick={handleImageChange}
                  src={imageUrl}
                  alt="no product cover"
                  key={imageUrl}
                />
              );
            })}
          </div>
        </div>
        <div className={classes.about_product_information}>
          <p className={classes.about_product_main_title}>{title}</p>
          <p className={classes.about_product_starting_price}>
            Starts from &nbsp;
            <span className={classes.product_emphasize}>${startPrice}</span>
          </p>
          <div className={classes.about_product_auction}>
            <p>
              Highest bid:&nbsp;
              <span className={classes.product_emphasize}>
                ${highestBid || startPrice}
              </span>
            </p>
            <p>
              Number of bids:&nbsp;
              <span className={classes.product_emphasize}>
                {numberOfBids || 0}
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
            notificationState !== "SUCCESS" && (
              <div className={classes.product_bid_container}>
                {isLoggedIn ? (
                  <React.Fragment>
                    <input
                      onChange={handleBidPrice}
                      className={classes.bid_input}
                      type="number"
                      placeholder={`Enter $${
                        highestBid || startPrice
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
            <p className={classes.paragraph}>{description}</p>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ProductOverviewPage;
