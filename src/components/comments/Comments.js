import "./comments.scss";
import { useMutation } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";

const Comments = ({ postID }) => {
  const { currentUser } = useContext(AuthContext);
  const [cmts, setCmts] = useState([]);

  // add comt
  const [description, setDesc] = useState("");

  const fetchCmt = async (id) => {
    let res = await axios.get(
      "http://localhost:8080/api/comments?postId=" + id,
      {
        withCredentials: true, // cais nay phai có moi khi goi axios vì ban đầu đã đặt http only khi res.cookie nên cần
        //cái này để cho phép truy xuất lấy cookies
      }
    );
    setCmts(res.data);
  };

  useEffect(() => {
    fetchCmt(postID);
  }, [postID]);

  const mutation = useMutation(
    async (newCmt) => {
      return await axios.post(
        "http://localhost:8080/api/comments?postId=" + postID,
        newCmt,
        {
          withCredentials: true,
        }
      );
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        fetchCmt(postID);
      },
    }
  );

  const reloadData = (event) => {
    event.preventDefault();
    mutation.mutate({ description });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={`./upload/${currentUser.profilePic}`} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          name="description"
          onChange={(e) => setDesc(e.target.value)}
          value={description}
        />
        <button type="submit" onClick={reloadData}>
          Send
        </button>
      </div>

      {cmts &&
        cmts.map((comment) => (
          <div className="comment" key={comment.id}>
            <img src={`./upload/${comment.profilePic}`} alt="" />
            <div className="info">
              <Link
                to={`/profile/${comment.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span>{comment.name}</span>
              </Link>
              <p>{comment.desc}</p>
            </div>
            <span className="date">
              {moment(comment.createAt).fromNow(true)}
            </span>
          </div>
        ))}
    </div>
  );
};

export default Comments;
