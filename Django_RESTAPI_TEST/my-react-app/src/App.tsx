import { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { useGoogleLogin } from '@react-oauth/google';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      // Перевіряємо, чи справжній користувач ще існує
      axios.get('http://localhost:4097/api/check-user/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
          .then((res) => {
            setUser(JSON.parse(storedUser)); // або res.data.user
          })
          .catch((err) => {
            console.warn("User not valid, clearing storage...");
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setUser(null);
          });
    }
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
      <>
        {user ? (
            <div>
              <h1>Hello, {user.firstname || user.username}!</h1>
              {user.image && (
                  <img
                      src={`http://localhost:4097${user.image}`}
                      alt="User avatar"
                      style={{ width: '120px', borderRadius: '50%' }}
                  />
              )}
              <br />
              <button onClick={logout}>Logout</button>
            </div>
        ) : (
            <>
              <h1>Hello World</h1>
              <button onClick={() => loginByGoogle()}>
                Sign in with Google 🚀
              </button>
            </>
        )}
      </>
  );
}

export default App;
