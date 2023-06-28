import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup, Button, Form } from 'react-bootstrap';
import { BsTrash, BsCart3 } from 'react-icons/bs';
import TopNav from '../components/TopNav/TopNav';
import Footer from '../components/Footer/Footer';
import './Cart.css';

const Cart = () => {
  const [productList, setProductList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [cartMessage, setCartMessage] = useState('');
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    phoneNumber: '',
    department: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://backend-ecommerce-chi.vercel.app/carrito');
        const data = await response.json();
        setProductList(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productList.slice(indexOfFirstProduct, indexOfLastProduct);

  const handlePageClick = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const addToCart = async (product) => {
    try {
      const response = await axios.post('https://backend-ecommerce-chi.vercel.app/carrito', product);
      setCartMessage('Producto añadido al carrito');
    } catch (error) {
      console.log(error);
    }
  };

  const removeProduct = async (productId) => {
    try {
      await axios.delete(`https://backend-ecommerce-chi.vercel.app/carrito/${productId}`);
      const updatedProductList = productList.filter((product) => product.id !== productId);
      setProductList(updatedProductList);
    } catch (error) {
      console.log(error);
    }
  };

  const removeAllProducts = async () => {
    try {
      await axios.delete('https://backend-ecommerce-chi.vercel.app/carrito');
      setProductList([]);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = () => {
    let total = 0;

    currentProducts.forEach((product) => {
      if (product.precio_oferta) {
        total += parseFloat(product.precio_oferta);
      } else {
        total += parseFloat(product.precio);
      }
    });

    return total.toFixed(2);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShippingData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aquí puedes realizar la lógica para enviar los datos de envío al backend
    console.log('Datos de envío:', shippingData);
  };

  return (
    <>
      <TopNav />

      <div className="cart-list-0">
        <div className="product-list">
          <h2 className="cart-title">Productos en el carrito:</h2>
          <div className="product-list-container">
            <div className="items-container">
              {currentProducts.map((product) => (
                <div key={product.id} className="cart-item">
                  <h3 className="cart-name">{product.nombre}</h3>
                  <img src={product.imagen} alt={product.nombre} className="product-image" />
                  <p className="cart-description">{product.descripcion}</p>
                  <p className="cart-price">Precio: ${product.precio}</p>
                  {product.precio_oferta && (
                    <p className="cart-offer-price">Precio de oferta: ${product.precio_oferta}</p>
                  )}
                  <button
                    className="remove-product-button"
                    onClick={() => removeProduct(product.id)}
                  >Eliminar producto
                    <BsTrash />
                  </button>
                </div>
              ))}
            </div>

            <div className="shipping-form">
              <h2 className="shipping-title">Datos de Envío</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="firstName">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    value={shippingData.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="lastName">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="address">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={shippingData.address}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="phoneNumber">
                  <Form.Label>Número de Teléfono</Form.Label>
                  <Form.Control
                    type="text"
                    name="phoneNumber"
                    value={shippingData.phoneNumber}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Form.Group controlId="department">
                  <Form.Label>Departamento</Form.Label>
                  <Form.Control
                    type="text"
                    name="department"
                    value={shippingData.department}
                    onChange={handleInputChange}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Registrar Envío
                </Button>
              </Form>
              {currentProducts.length > 0 && (
            <button className="remove-all-button" onClick={removeAllProducts}>
              Eliminar todos los productos
            </button>
          )}
            </div>
          </div>


        </div>
      </div>

      <div className="cart-total">
        <p>Total: ${calculateTotal()}</p>
        <button className="buy-button">Comprar</button>
      </div>

      <Footer />
    </>
  );
};

export default Cart;
