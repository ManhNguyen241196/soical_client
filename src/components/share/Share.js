import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../context/authContext";
import axios from "axios";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");

  const upload = async () => {
    try {
      // tại upload này cũng phải tạo 1 formData mới để gửi lên một đường link ở backend dưới định dạng request
      //của 1 form  như cách submit form bình thường. Nhưng do không có html đẻ tạo form như bình thường nên sẽ dùng cái này
      //để tạo vắn tắt 1 form ẩn và có chức năng đẩy form lên link server backand như form binh thường.
      const formData = new FormData();
      formData.append("file", file); // thêm key và value vào form nó giống như value được điền vào input có name là key
      const res = await axios.post(
        // post lên route backend như post lên  axios với values (định djang 1 object) như bình thường
        "http://localhost:8080/api/upload",
        formData
      ); // sau khi post lên thì object chứa file này sẽ được chuyển tiếp về backend xử lí.
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const { currentUser } = useContext(AuthContext);

  // bat dau su dụng useQuery để gọi query get posts ở bên post
  const queryClient = useQueryClient();

  const mutation = useMutation(
    async (newPost) => {
      console.log("mutation được gọi");
      return await axios.post("http://localhost:8080/api/posts", newPost, {
        withCredentials: true,
      });
    },

    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["posts"]);
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
    if (file) {
      /// neu có file tren input của input file thì mới chạy upload
      imgUrl = await upload();
    }
    mutation.mutate({ desc, img: imgUrl }); // dù có file hay không thì mutation vẫn chạy với biến được khai báo.
    //kể cả khi giá trị của biến k có thì nó vẫn sẽ chạy hàm mutation  và gửi giá trị đó lên API posts ở backend.
    setDesc(""); // sau khi đẩy giá trị xong thì sẽ set về rỗng như ban đầu
    setFile(null);
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={`./upload/${currentUser.profilePic}`} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && ( //nếu tồn tại file thì sẽ show hình ảnh này ra đồng thời  tạo trên tham chiếu cho nó
              <img className="file" alt="" src={URL.createObjectURL(file)} /> // đặt tên định danh duy nhất cho q file có thể được tham chiếu tồn tại
              // ở tại máy hoặc lưu trên mạng TUY NHIEN cái này chỉ hya sử dụng làm thumnail hoặc ảnh preview tạm thời vì đóng tab hoặc ngưng chạy thì
              // link đó cũng mất đi. CHỉ là link lưu trữ tạm thời.
            )}
          </div>
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
