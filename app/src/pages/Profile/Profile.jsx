import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../fire_base";

const Profile = () => {
  const { currentUser } = useSelector((state) => state.user);
  const fileUploader = useRef(null);
  const [profileFormData, setProfileFormData] = useState({
    avatar: currentUser?.user?.avatar || "",
    userName: currentUser?.user?.userName || "",
    email: currentUser?.user?.email || "",
    password: "",
  });
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);

  const onInputChange = (e) => {
    const { id, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const onImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        console.log(error);
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setProfileFormData((prev) => ({
            ...prev,
            avatar: downloadURL,
          }));
        });
      }
    );
  };

  const handleSubmitProfileForm = async (e) => {
    e.preventDefault();
    try {
      // Update profile information
      console.log(profileFormData);
    } catch (error) {
      console.log("Error updating profile:", error);
    }
  };

  return (
    <div className="flex justify-center items-center my-24">
      <div className="flex flex-col gap-5">
        <h1 className="text-4xl text-center font-bold">Welcome Back </h1>

        <form
          onSubmit={handleSubmitProfileForm}
          className="flex gap-4 justify-center flex-col w-[450px]">
          <input
            type="file"
            hidden
            ref={fileUploader}
            onChange={onImageChange}
          />
          <img
            src={profileFormData.avatar}
            onClick={() => fileUploader.current.click()}
            alt="Profile"
            className="w-24 h-24 rounded-full items-center self-center cursor-pointer object-cover border "
          />
          <p className="text-sm self-center">
            {fileUploadError ? (
              <span className="text-red-700">
                Error Image upload (image must be less than 2 mb)
              </span>
            ) : filePerc > 0 && filePerc < 100 ? (
              <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
            ) : filePerc === 100 ? (
              <span className="text-green-700">
                Image successfully uploaded!
              </span>
            ) : (
              ""
            )}
          </p>
          <input
            type="text"
            placeholder="userName"
            id="userName"
            className="focus:outline-none border border-black rounded-md p-2"
            value={profileFormData.userName}
            onChange={onInputChange}
          />
          <input
            type="email"
            placeholder="email"
            id="email"
            className="focus:outline-none border border-black rounded-md p-2"
            value={profileFormData.email}
            onChange={onInputChange}
          />
          <input
            type="password"
            placeholder="password"
            id="password"
            className="focus:outline-none border border-black rounded-md p-2"
            value={profileFormData.password}
            onChange={onInputChange}
          />
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium text-lg cursor-pointer rounded-md p-2 transition-all duration-300">
            Update Information
          </button>
          <button
            type="button"
            className="bg-gray-500 hover:bg-gray-600 text-white font-medium text-lg cursor-pointer rounded-md p-2 transition-all duration-300">
            Create Listing
          </button>
        </form>
        <div className="flex justify-between">
          <span className="text-red-500 cursor-pointer">Delete Account</span>
          <span className="text-red-500 cursor-pointer">Logout</span>
        </div>
      </div>
    </div>
  );
};

export default Profile;
