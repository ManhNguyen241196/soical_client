import { useState } from "react";
import "./update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";

const Update = ({ setOpenUpdate, user }) => {
  //khia bao de update file img
  const [cover, setCover] = useState(null);
  const [profile, setProfile] = useState(null);

  const queryClient = useQueryClient();

  const [texts, setTexts] = useState({
    name: user.name,
    city: user.city,
    website: user.website,
  });

  const handleChange = (e) => {
    setTexts((prev) => {
      return { ...prev, [e.target.name]: [e.target.value] };
    });
  };

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      let res = await axios.post("http://localhost:8080/api/upload", formData, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation(
    async (userInfor) => {
      let res = await axios.put(
        "http://localhost:8080/api/users/find/" + user.id,
        userInfor,
        {
          withCredentials: true,
        }
      );
      return res.data;
    },
    {
      onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries(["user", user.id]);
        window.alert("update thong tin thanh cong");
      },
    }
  );

  const handleClick = async (e) => {
    e.preventDefault();
    let newCoverUrl;
    let newProfileUrl;
    if (cover) {
      newCoverUrl = await upload(cover);
    } else {
      newCoverUrl = user.coverPic;
    }
    if (profile) {
      newProfileUrl = await upload(profile);
    } else {
      newProfileUrl = user.profilePic;
    }

    mutation.mutate({
      ...texts,
      coverPic: newCoverUrl,
      profilePic: newProfileUrl,
    });
    setOpenUpdate(false);
  };
  //TODO: find a better way to get image URL

  // let coverUrl;
  // let profileUrl;
  // coverUrl = cover ? await upload(cover) : user.coverPic;
  // profileUrl = profile ? await upload(profile) : user.profilePic;

  // mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl });
  // setOpenUpdate(false);
  // setCover(null);
  // setProfile(null);
  return (
    <div className="update">
      <div className="wrapper">
        <h1>Update Your Profile</h1>
        <form>
          <div className="files">
            <label htmlFor="cover">
              <span>Cover Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    cover
                      ? URL.createObjectURL(cover)
                      : `../upload/${user.coverPic}`
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="cover"
              style={{ display: "none" }}
              onChange={(e) => setCover(e.target.files[0])}
            />
            {/* label cos htmlFor chinh laf for là 1 adtribute ở html Hàm ý là nó gán cho input mà nó trỏ tới. 
            click vào nó thì nó cũng sẽ chuyển hoạt động tới input mà nó trỏ tới. */}
            <label htmlFor="profile">
              <span>Profile Picture</span>
              <div className="imgContainer">
                <img
                  src={
                    profile
                      ? URL.createObjectURL(profile)
                      : `../upload/${user.profilePic}`
                  }
                  alt=""
                />
                <CloudUploadIcon className="icon" />
              </div>
            </label>
            <input
              type="file"
              id="profile"
              style={{ display: "none" }}
              onChange={(e) => setProfile(e.target.files[0])}
            />
          </div>
          <label>Name</label>
          <input
            type="text"
            value={texts.name}
            name="name"
            onChange={handleChange}
          />
          <label>Country / City</label>
          <input
            type="text"
            name="city"
            value={texts.city}
            onChange={handleChange}
          />
          <label>Website</label>
          <input
            type="text"
            name="website"
            value={texts.website}
            onChange={handleChange}
          />
          <button onClick={handleClick}>Update</button>
        </form>
        <button className="close" onClick={() => setOpenUpdate(false)}>
          close
        </button>
      </div>
    </div>
  );
};

export default Update;
