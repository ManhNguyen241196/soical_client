import React from "react";
import Register from "./pages/register/Register";
import Login from "../src/pages/login/Login";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import LeftBar from "./components/leftBar/LeftBar";
import RightBar from "./components/rightBar/RightBar";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import { Navigate } from "react-router-dom";

//auth API content react
import { useContext } from "react";
import { AuthContext } from "./components/context/authContext";

//use react - Query  để fetch data thuận lợi hơn. Lưu ý các dùng như bình thường sử dụng use
// Effect và use State vẫn dùng được bình thường
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function App() {
  const { currentUser } = useContext(AuthContext); // biến quyết định xem có user đặng nhập hay k. Sẽ uqyeets định hiển thị của các component
  // biến ở đây thay đổi cũng  sẽ tác động giống như setState và mỗi compoent sử dụng phải gọi nó 1 lần

  const queryClient = new QueryClient();

  const ProtectedRoute = (props) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return props.children;
  };

  const Layout = () => {
    return (
      <QueryClientProvider client={queryClient}>
        <div>
          {/* nho rang nam giua 2 ther component la children cua component */}
          <ProtectedRoute>
            {" "}
            <Navbar />
          </ProtectedRoute>

          <div style={{ display: "flex" }}>
            <LeftBar />
            <div style={{ flex: 6 }}>
              <Outlet />
              {/* Outlet sẽ chứa các phần component thay đổi ý là nằm ngoài các phần được giữ nguyên khi chuyển qua các trang khác nhau
            nó cũng chính component là đại diện cho các children của route parent layout chung 
            nếu tuyến đường chứa outlet (tuyến đường cha) không tồn tại thì các tuyến đường trong outlet cũng sẽ k tồn tại.*/}
            </div>
            <RightBar />
          </div>
        </div>
      </QueryClientProvider>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/profile/:id", // route profile lấy id.
          element: <Profile />,
        },
      ],
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
  ]);

  return (
    <div className="App">
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </div>
  );
}

export default App;
