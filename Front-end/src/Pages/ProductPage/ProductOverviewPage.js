import React, { useContext, useEffect, useState } from "react";

import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import NavLocation from "../../Components/Header/Location/NavLocation";

import productService from "../../Services/productsService";

import bidService from "../../Services/bidService";

import AuthContext from "../../Store/auth-context";

import arrow from "../../Assets/arrowRight.svg";

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

  const params = useParams();
  const userContext = useContext(AuthContext);

  const [product, setProduct] = useState(INITIAL_PRODUCT_STATE);
  const [bidNotification, setBidNotification] = useState(
    INITIAL_BID_NOTIFICATION_STATE
  );
  const [productBidHistory, setProductBidHistory] = useState(
    INITIAL_PRODUCT_HISTORY_STATE
  );
  const [mainImage, setMainImage] = useState({});
  const [images, setImages] = useState([]);
  const [bid, setBid] = useState(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [isUserLatestBidder, setIsUserLatestBidder] = useState(false);

  const ERROR_MESSAGE =
    "There are higher bids than yours. You could give a second try!";

  const SUCCESS_MESSAGE = "Congrats! You are the highest bider!";

  //  const OUTBID_MESSAGE = "Congratulations! You outbid the competition.";

  const handleImageChange = (ev) => {
    setMainImage(ev.target.src);
  };

  const handleBidRequest = async () => {
    let token = JSON.parse(sessionStorage.getItem("user_jwt"));
    let data = {
      product_id: params.productId,
      bid_price: bid,
    };
    try {
      await bidService.makeBid(token.access_token, data);
      let bidState = { state: "SUCCESS", message: SUCCESS_MESSAGE };
      setBidNotification(() => bidState);
      bidService.getBidHistory(params.productId).then((response) => {
        if (response.data.highestBid) {
          setProductBidHistory(() => response.data);
          if (
            response.data.latest_bidder_id === userContext.userDataState.user_id
          ) {
            setIsUserLatestBidder(true);
          }
        } else {
          const bidHistory = {
            latest_bidder_id: null,
            highestBid: product.start_price,
            numberOfBids: 0,
          };
          setProductBidHistory(() => bidHistory);
        }
      });
    } catch (err) {
      let bidState = { state: "ERROR", message: ERROR_MESSAGE };
      setBidNotification(() => bidState);
    }
  };

  useEffect(() => {
    productService.fetchProductById(params.productId).then((response) => {
      setProduct(() => response.data.product);
      setImages(() => response.data.images);
      setMainImage(() => response.data.product.image_main_url);
      if (userContext.userDataState) {
        if (
          response.data.product.user_id["user_id"] ===
          userContext.userDataState.user_id
        ) {
          setIsAvailable(false);
        }
      }
    });
  }, [params.productId, userContext.userDataState]);

  useEffect(() => {
    bidService.getBidHistory(params.productId).then((response) => {
      if (response.data.highestBid > 0) {
        setProductBidHistory(() => response.data);
        if (
          response.data.latest_bidder_id === userContext.userDataState.user_id
        ) {
          setIsUserLatestBidder(true);
        }
      } else {
        const bidHistory = {
          latest_bidder_id: null,
          highestBid: product.start_price,
          numberOfBids: 0,
        };
        setProductBidHistory(() => bidHistory);
      }
    });
  }, [
    params.productId,
    product.start_price,
    userContext.userDataState.user_id,
  ]);

  return (
    <React.Fragment>
      <NavLocation
        location={product.title}
        path={{ main: "Shop", page: "Single product" }}
      />
      {bidNotification.state === "ERROR" ? (
        <div
          className={
            classes.bid_notification_container +
            " " +
            classes.bid_notification_error
          }
        >
          <p>{bidNotification.message}</p>
        </div>
      ) : (
        ""
      )}
      {bidNotification.state === "SUCCESS" || isUserLatestBidder ? (
        <div
          className={
            classes.bid_notification_container +
            " " +
            classes.bid_notification_success
          }
        >
          <p>{SUCCESS_MESSAGE || bidNotification.message}</p>
        </div>
      ) : (
        ""
      )}
      {bidNotification.state === "OUTBID" ? (
        <div
          className={
            classes.bid_notification_container +
            " " +
            classes.bid_notification_outbid
          }
        >
          <p>{bidNotification.message}</p>
        </div>
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
              ${product.start_price}.00
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
              <span className={classes.product_emphasize}>10 Weeks 6 Days</span>
            </p>
          </div>
          {userContext.userDataState && !isUserLatestBidder ? (
            bidNotification.state !== "SUCCESS" && isAvailable ? (
              <div className={classes.product_bid_container}>
                <input
                  onChange={(ev) => setBid(ev.target.value)}
                  className={classes.bid_input}
                  type="number"
                  placeholder={`Enter $${
                    productBidHistory.highestBid || product.start_price
                  } or higher`}
                />
                <p onClick={handleBidRequest} className={classes.btn}>
                  Place bid
                  <div className={classes.arrow}>
                    <img src={arrow} alt="arrow on a button" />
                  </div>
                </p>
              </div>
            ) : (
              ""
            )
          ) : (
            ""
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
