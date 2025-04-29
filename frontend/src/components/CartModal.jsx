import { useCartStore } from "../store/useCartStore";

function CartModal({ isOpen, onClose }) {
  const { cartItems, removeFromCart } = useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-base-200 p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-bold mb-4">Your Cart</h2>
        {cartItems.length === 0 ? (
          <p className="text-sm">No items in cart.</p>
        ) : (
          <ul className="space-y-2">
            {cartItems.map((item) => (
              <li key={item.id} className="flex justify-between items-center">
                <span>{item.name} - ${item.price}</span>
                <button
                  className="text-red-500 text-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4 flex justify-end">
          <button className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartModal;
