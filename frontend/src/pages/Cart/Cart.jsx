import React, { useContext } from "react";
import "./Cart.css";
import { StoreContext } from "../../context/StoreContext";
import { Link, useNavigate } from "react-router-dom";

const Cart = () => {
  const {
    food_list,
    cartItems,
    removeFromCart,
    getTotalCartAmount,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // Check if the cart is empty
  const isCartEmpty = food_list.every((item) => !cartItems[item._id]);

  return (
    <div className="cart">
      <div className="cart-items">
        <h2>Your Cart</h2>
        {isCartEmpty ? (
          <p className="empty-cart">Your cart is empty. Add some items!</p>
        ) : (
          <>
            <div className="cart-items-header">
              <p>Item</p>
              <p>Title</p>
              <p>Price</p>
              <p>Quantity</p>
              <p>Total</p>
              <p>Remove</p>
            </div>
            <hr />
            {food_list.map((item) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={item._id}>
                    <div className="cart-items-row">
                      <Link to={`/item/${item._id}`}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="cart-item-image"
                        />
                      </Link>
                      <p>{item.name}</p>
                      <p>#{item.price}</p>
                      <p>{cartItems[item._id]}</p>
                      <p>#{item.price * cartItems[item._id]}</p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="remove-btn"
                      >
                        x
                      </button>
                    </div>
                    <hr />
                  </div>
                );
              }
              return null;
            })}
          </>
        )}
      </div>

      {!isCartEmpty && (
        <div className="cart-bottom">
          <div className="cart-total">
            <h2>Cart Totals</h2>
            <div>
              <div className="cart-total-details">
                <p>Subtotals</p>
                <p>#{getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>#{getTotalCartAmount() === 0 ? 0 : 2000}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>#{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2000}</b>
              </div>
            </div>
            <button onClick={() => navigate('/order')}>PROCEED TO CHECKOUT</button>
          </div>
          <div className="cart-promocode">
            <div>
              <p>If you have a promocode, Enter it here</p>
              <div className="cart-promocode-input">
                <input type="text" placeholder="promo code" />
                <button>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
