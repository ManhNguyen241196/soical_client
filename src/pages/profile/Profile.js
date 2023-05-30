import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useContext, useState } from "react";
import { AuthContext } from "../../components/context/authContext";
import Update from "../../components/update/Update";

const Profile = () => {
  const queryClient = useQueryClient();
  const { currentUser } = useContext(AuthContext);
  const [openUpdate, setOpenUpdate] = useState(false);

  let location = useLocation();
  let str = location.pathname;
  let userId = str.match(/(\d+)/)[0];

  //method get follow
  const getAllFollowUser = useQuery(["followUser", userId], async () => {
    let res = await axios.get(
      "http://localhost:8080/api/relationship?followedUser=" + userId,
      {
        withCredentials: true, // cais nay phai có moi khi goi axios vì ban đầu đã đặt http only khi res.cookie nên cần
        //cái này để cho phép truy xuất lấy cookies
      }
    );
    return res.data;
  });
  let FollowState = () => {
    let newArr = getAllFollowUser.data.map((item) => {
      return item.followerUserId;
    });
    console.log(newArr);
    return newArr;
  };
  const { isLoading, error, data } = useQuery(["user", userId], async () => {
    let res = await axios.get(
      "http://localhost:8080/api/users/find/" + userId,
      {
        withCredentials: true, // cais nay phai có moi khi goi axios vì ban đầu đã đặt http only khi res.cookie nên cần
        //cái này để cho phép truy xuất lấy cookies
      }
    );
    return res.data;
  });

  const mutation = useMutation(
    async () => {
      let res = await axios.post(
        "http://localhost:8080/api/relationship?followedUser= " + userId,
        {},
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["followUser", userId]);
      },
    }
  );

  const deleteMutation = useMutation(
    async () => {
      let res = await axios.delete(
        "http://localhost:8080/api/relationship?followedUser= " + userId,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["followUser", userId]);
      },
    }
  );

  const handleFollow = () => {
    mutation.mutate();
  };
  const deleteFollow = () => {
    deleteMutation.mutate();
  };

  return (
    <div className="profile">
      {isLoading ? (
        "Loading...."
      ) : error ? (
        <h1> {error.message}</h1>
      ) : (
        <>
          <div className="images">
            <img src={`../upload/${data.coverPic}`} alt="" className="cover" />
            <img
              src={`../upload/${data.profilePic}`}
              alt=""
              className="profilePic"
            />
          </div>
          <div className="profileContainer">
            <div className="uInfo">
              <div className="left">
                <a href="http://facebook.com">
                  <FacebookTwoToneIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <InstagramIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <TwitterIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <LinkedInIcon fontSize="large" />
                </a>
                <a href="http://facebook.com">
                  <PinterestIcon fontSize="large" />
                </a>
              </div>
              <div className="center">
                <span>{data.name}</span>
                <div className="info">
                  <div className="item">
                    <PlaceIcon />
                    <span>{data.city}</span>
                  </div>
                  <div className="item">
                    <LanguageIcon />
                    <span>{data.website}</span>
                  </div>
                </div>

                {parseInt(userId) === currentUser.id ? (
                  <button
                    onClick={() => {
                      setOpenUpdate(true);
                    }}
                  >
                    update
                  </button>
                ) : FollowState().includes(currentUser.id) ? (
                  <button onClick={deleteFollow}>Followed</button>
                ) : (
                  <button onClick={handleFollow}>+ Follow</button>
                )}
              </div>
              <div className="right">
                <EmailOutlinedIcon />
                <MoreVertIcon />
              </div>
            </div>
            {openUpdate && <Update setOpenUpdate={setOpenUpdate} user={data} />}
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
