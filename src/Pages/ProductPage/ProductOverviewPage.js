import React, { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import NavLocation from "../../Components/Header/Location/NavLocation";
import Notification from "./Notification";
import AuthContext from "../../Store/auth-context";
import productService from "../../Services/productsService";
import bidService from "../../Services/bidService";
import constants from "../../Data/Constants/bid";

import arrow from "../../Assets/arrowRight.svg";
import exclamationMark from "../../Assets/exclamation-mark.svg";

import calculateSQLDaysRemaining from "../../Utils/calculateDaysRemaining";

import classes from "./ProductOverviewPage.module.css";

const ProductOverviewPage = () => {
  const INITIAL_BID_NOTIFICATION_STATE = {
    state: null,
    message: null,
  };

  const INITIAL_PRODUCT_HISTORY_STATE = {
    latest_bidder_id: null,
    highestBid: null,
    numberOfBids: null,
  };

  const INITIAL_PRODUCT_STATE = {};

  const { productId } = useParams();
  const { userDataState } = useContext(AuthContext);
  const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);
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

  const handleTimeRemaining = useCallback(() => {
    const WEEKS_REMAINING = Math.floor(
      calculateSQLDaysRemaining(product.auction_date_end) / 7
    );
    const DAYS_REMAINING =
      calculateSQLDaysRemaining(product.auction_date_end) % 7;
    setWeeks(WEEKS_REMAINING);
    setDays(DAYS_REMAINING);
  }, [product.auction_date_end]);

  const handleImageChange = (ev) => {
    setMainImage(ev.target.src);
  };

  const handleBidHistory = (bidHistory) => {
    setProductBidHistory(() => bidHistory);
  };

  const handleBidRequest = async () => {
    if (!bidPrice) {
      setError("Please input a value.");
      return;
    }
    if (bidPrice > productBidHistory.highestBid + 1000) {
      setError("Input a realistic bid.");
      setBidPrice(null);
      return;
    }
    let token = JSON.parse(sessionStorage.getItem("user_jwt"));
    let data = {
      product_id: productId,
      bid_price: bidPrice,
    };
    bidService
      .makeBid(token.access_token, data)
      .then((bidResponse) => {
        let userId = bidResponse.data.user_id.user_id;
        setBidNotification({
          state: "SUCCESS",
          message: constants.SUCCESS_MESSAGE,
        });
        handleBidHistory({
          latest_bidder_id: userId,
          highestBid: bidResponse.data.bid_price,
          numberOfBids: ++productBidHistory.numberOfBids,
        });
        if (userId === userDataState.user_id) {
          setIsUserLatestBidder(true);
        }
      })
      .catch((err) => {
        setBidNotification({
          state: "ERROR",
          message: constants.ERROR_MESSAGE,
        });
      });
  };

  useEffect(() => {
    productService.fetchProductById(productId).then((response) => {
      setProduct(() => response.data.product);
      setImages(() => response.data.images);
      setMainImage(() => response.data.product.image_main_url);
      handleTimeRemaining();
      if (userDataState) {
        if (
          response.data.product.user_id["user_id"] === userDataState.user_id
        ) {
          setIsAvailable(false);
        }
      }
    });
  }, [productId, userDataState, handleTimeRemaining]);

  useEffect(() => {
    bidService.getBidHistory(productId).then((response) => {
      if (response.data.highestBid > 0) {
        setProductBidHistory(() => response.data);
        if (userDataState) {
          if (response.data.latest_bidder_id === userDataState.user_id) {
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
                  src={image.image_url}
                  alt="no product cover"
                  key={image.image_url}
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
              ${product.start_price}
            </span>
          </p>
          <div className={classes.about_product_auction}>
            <p>
              Highest bid:&nbsp;
              <span className={classes.product_emphasize}>
                ${productBidHistory.highestBid || product.start_price}
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
                {userDataState ? (
                  <React.Fragment>
                    <input
                      onChange={(ev) => setBidPrice(ev.target.value)}
                      className={classes.bid_input}
                      type="number"
                      placeholder={`Enter $${
                        productBidHistory.highestBid || product.start_price
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
