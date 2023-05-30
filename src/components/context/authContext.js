// context này sẽ lấy giá trị user lưu từ trong Storage để lấy data truyền xuống cho các compoent con. Xác thực
// việc login thông qua cookies còn localStorage sẽ lấy các thuộc tính của ubject user để phục vụ cho việc hiển thị
//các thông tin của user về sau này tren các component con.

// việc sử dụng react context để có thể truyền biến lư trong này đi khắp tât cả các component con nó
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext(); // dong lệnh chính để tạo ra API context và set nó thanh 1 biên
// export  nó đi được thì mới có thể sử dụng trong các component bên dưới

export const AuthContextProvider = ({ children }) => {
  // state mặc định ban đầu của currentUSer là lấy dữ liệu từ localStorage. Dữ liệu phải được chuyển về dạng object bình thường từ JSON(kiểu
  // định nghĩa mặc định trong localStorage )
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // nếu chạy hàm login nó sẽ setState cho currentUser. Các giá trị để set sẽ lấy từ database. Cụ thể sẽ là 1 API do backend trả ra.
  const login = async (inputs) => {
    let res = await axios.post("http://localhost:8080/api/auth/login", inputs, {
      // res trả lại 1 object chứa infor user do auth bên phía backend  trả về
      withCredentials: true,
    });
    console.log(res.data);
    setCurrentUser(res.data);
  };

  //Lần đầu load sẽ chạy useEffect này và từ những lần sau nếu currentUser bị thay đổi thì sẽ chạy hàm này để set giá trị cho localStorage
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);
  return (
    //return này chạy function provider mặc định của context để cung cấp các giá trị biến
    // cho các component con của nó (ở đây được đinh nghĩa là cac children của component cha AuthContextProvider )

    // ở đây nó sẽ truyền xuống 1 biến currentUSer và 1 function. Khi functiuon này được import nó sẽ trỏ trực tiếp lên parent
    //có chứa function này. -> setCurrentUser -> hiển thị lại và đồng thoeif set và get user trong localStorage để đặt cho biến
    //currentUser để truyền xuống các component con.

    //lệnh xet provider để cung cấp cho các component con bên dưới
    <AuthContext.Provider value={{ currentUser, login, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
