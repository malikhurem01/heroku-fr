import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";

import NavLocation from "../../Components/Header/Location/NavLocation";
import Notification from "./Notification";
import AuthContext from "../../Store/auth-context";
import productService from "../../Services/productsService";
import bidService from "../../Services/bidService";
import constants from "../../Data/Constants/bid";

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

  const handleImageChange = (ev) => {
    setMainImage(ev.target.src);
  };

  const handleBidHistory = (bidHistory) => {
    setProductBidHistory(() => bidHistory);
  };

  const handleBidRequest = async () => {
    if (!userDataState) {
      window.location.replace("/login");
      return;
    }
    let token = JSON.parse(sessionStorage.getItem("user_jwt"));
    let data = {
      product_id: productId,
      bid_price: bidPrice,
    };
    try {
      await bidService.makeBid(token.access_token, data);
      let bidState = { state: "SUCCESS", message: constants.SUCCESS_MESSAGE };
      setBidNotification(() => bidState);
      bidService.getBidHistory(productId).then((response) => {
        if (response.data.highestBid) {
          handleBidHistory(response.data);
          if (response.data.latest_bidder_id === userDataState.user_id) {
            setIsUserLatestBidder(true);
          }
        } else {
          handleBidHistory({
            lastest_bidder_id: null,
            highestBid: product.start_price,
            numberOfBids: 0,
          });
        }
      });
    } catch (err) {
      let bidState = { state: "ERROR", message: constants.ERROR_MESSAGE };
      setBidNotification(() => bidState);
    }
  };

  useEffect(() => {
    productService.fetchProductById(productId).then((response) => {
      setProduct(() => response.data.product);
      setImages(() => response.data.images);
      setMainImage(() => response.data.product.image_main_url);
      if (userDataState) {
        if (
          response.data.product.user_id["user_id"] === userDataState.user_id
        ) {
          setIsAvailable(false);
        }
      }
    });
  }, [productId, userDataState]);

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
      } else {
        const bidHistory = {
          latest_bidder_id: null,
          highestBid: product.start_price,
          numberOfBids: 0,
        };
        setProductBidHistory(() => bidHistory);
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
              <span className={classes.product_emphasize}>10 Weeks 6 Days</span>
            </p>
          </div>
          {!isUserLatestBidder &&
            isAvailable &&
            bidNotification.state !== "SUCCESS" && (
              <div className={classes.product_bid_container}>
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
