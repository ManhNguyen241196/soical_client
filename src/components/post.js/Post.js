// component hiển thị cụ thể từng post
import "./post.scss";
//import icon
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { Link } from "react-router-dom";
import { useContext, useState } from "react";
import Comments from "../comments/Comments";

import moment from "moment";

//get likes
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/authContext";
const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false); // useState phục vụ cho việc ẩn hiện component state

  const queryClient = useQueryClient();

  const { currentUser } = useContext(AuthContext);

  //get likes
  const { isLoading, error, data } = useQuery(["likes", post.id], () =>
    fetch("http://localhost:8080/api/likes?postId=" + post.id).then((res) =>
      res.json()
    )
  );
  console.log("tại post id ", post.id, "có số like là ", data);

  //-------------------------------------------------
  const mutation = useMutation(
    async (liked) => {
      let res = await axios.post(
        "http://localhost:8080/api/likes?postId=" + post.id,
        {},
        {
          withCredentials: true, // cais nay phai có moi khi goi axios vì ban đầu đã đặt http only khi res.cookie nên cần
          //cái này để cho phép truy xuất lấy cookies
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );
  const deleteMutation = useMutation(
    async () => {
      let res = await axios.delete(
        "http://localhost:8080/api/likes?postId=" + post.id,
        {
          withCredentials: true, // cais nay phai có moi khi goi axios vì ban đầu đã đặt http only khi res.cookie nên cần
          //cái này để cho phép truy xuất lấy cookies
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["likes"]);
      },
    }
  );

  function timeFromNow() {
    return moment(post.createAt).fromNow(true);
  }

  //TEMPORARY
  const handleLike = () => {
    mutation.mutate(data.includes(currentUser.id));
  };
  const deleteLike = () => {
    deleteMutation.mutate(data.includes(currentUser.id));
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={`./upload/${post.profilePic}`} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`} // nếu click vào avata sẽ vao profile của user đó
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{timeFromNow()}</span>
            </div>
          </div>
          <MoreHorizIcon />
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={`./upload/${post.img}`} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {isLoading ? (
              "loading"
            ) : data.includes(currentUser.id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={deleteLike}
              />
            ) : (
              <FavoriteBorderOutlinedIcon onClick={handleLike} />
            )}
            {data && data.length} Likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            12 comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
          l
        </div>
        {commentOpen && <Comments postID={post.id} />}
      </div>
    </div>
  );
};

export default Post;
