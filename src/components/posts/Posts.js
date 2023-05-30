//Hiển thị toàn bộ mảng Posts (trong đó có chứa nhiều post thành phần)
import "./posts.scss";
import Post from "../post.js/Post";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useContext } from "react";
const Posts = () => {
  const { currentUser } = useContext(AuthContext);

  const { isLoading, error, data } = useQuery(["posts"], async () => {
    // data được fetch ra có thể dưới dạng return của 1 function hoặc là một cụm giá trị nào đó.
    let res = await axios.get(
      "http://localhost:8080/api/posts?userId=" + currentUser.id,
      {
        withCredentials: true, // cais nay phai có moi khi goi axios vì ban đầu đã đặt http only khi res.cookie nên cần
        //cái này để cho phép truy xuất lấy cookies
      }
    );

    return res.data;
  });

  console.log(data);

  return (
    <div className="posts">
      {isLoading ? (
        "Loading"
      ) : error ? (
        <h3>Can't load data from server. Please try again</h3>
      ) : (
        data.map((post) => {
          return <Post post={post} key={post.id} />;
        })
      )}
    </div>
  );
};

export default Posts;
