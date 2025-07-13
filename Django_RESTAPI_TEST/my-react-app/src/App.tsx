import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { useGoogleLogin } from '@react-oauth/google';

interface User {
  firstname?: string;
  username?: string;
  image?: string;
}

interface ProductImage {
  id: number;
  image: string;
  image_url: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: ProductImage[];
}

interface Category {
  id: number;
  name: string;
  products: Product[];
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      axios.get('http://localhost:4097/api/check-user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
          .then(() => setUser(JSON.parse(storedUser)))
          .catch(() => {
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          });
    }
  }, []);

  useEffect(() => {
    setLoadingCategories(true);
    axios.get<Category[]>('http://localhost:4097/api/categories-with-products/')
        .then(res => {
          setCategories(res.data);
        })
        .catch(err => {
          console.error('Error loading categories:', err);
        })
        .finally(() => setLoadingCategories(false));
  }, []);

  const loginByGoogle = useGoogleLogin({
    onSuccess: async tokenResponse => {
      try {
        const res = await axios.post('http://localhost:4097/api/google-login/', {
          access_token: tokenResponse.access_token,
        });

        localStorage.setItem("token", res.data.access);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
      } catch (error) {
        console.error("Login error:", error);
      }
    },
  });

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
      <div>
        {/* Header */}
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          backgroundColor: '#B8E2EB',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
        }}>
          <div>
            {user ? (
                <strong>Hello, {user.firstname || user.username}!</strong>
            ) : (
                <strong>Hello World</strong>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {user?.image && (
                <img
                    src={`http://localhost:4097${user.image}`}
                    alt="User"
                    style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                />
            )}
            {user ? (
                <button onClick={logout}>Logout</button>
            ) : (
                <button onClick={() => loginByGoogle()}>
                  Sign in with Google 🚀
                </button>
            )}
          </div>
        </header>

        {/* Main content */}
        <main style={{ padding: '2rem', paddingTop: '50px'  }}>
          <h2>Товари по категоріях</h2>
          {loadingCategories ? (
              <p>Завантаження...</p>
          ) : (
              categories.map(category => (
                  <div key={category.id} style={{ marginBottom: '2rem' }}>
                    <h3>{category.name}</h3>
                    <div style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '1rem'
                    }}>
                      {category.products.length === 0 ? (
                          <p>Немає товарів</p>
                      ) : (
                          category.products.map(product => (
                              <div key={product.id} style={{
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                padding: '1rem',
                                width: '200px',
                                textAlign: 'center'
                              }}>
                                {product.images.length > 0 && (
                                    <img
                                        src={product.images[0].image_url}
                                        alt={product.name}
                                        style={{
                                          width: '100%',
                                          height: '150px',
                                          objectFit: 'cover',
                                          borderRadius: '4px',
                                          marginBottom: '0.5rem'
                                        }}
                                    />
                                )}
                                <h4>{product.name}</h4>
                                <p>{product.description}</p>
                                <p><strong>{product.price} грн</strong></p>
                              </div>
                          ))
                      )}
                    </div>
                  </div>
              ))
          )}
        </main>
      </div>
  );
}

export default App;
