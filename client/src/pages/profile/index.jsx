import { useAppStore } from "@/store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
  ADD_PROFILE_IMAGE_ROUTE,
  HOST,
  REMOVE_PROFILE_IMAGE_ROUTE,
  UPDATE_PROFILE_ROUTE,
} from "@/utils/constants.js";
import { IoIosArrowRoundBack } from "react-icons/io";
import emptyImage from "@/assets/empty.jpg";

const Profile = () => {
  const { userInfo, setUserInfo } = useAppStore();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(0);
  const fileInputRef = useRef(null);

  useEffect(() => {
    console.log("=== Profile useEffect Debug ===");
    console.log("userInfo:", userInfo);

    if (userInfo.profileSetup) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setSelectedColor(userInfo.selectedColor);
    }
    if (userInfo.image) {
      console.log("User has image:", userInfo.image);
      // Check if the image is already a full URL (Cloudinary) or needs the old HOST prefix
      if (userInfo.image.startsWith("http")) {
        console.log("Setting Cloudinary image:", userInfo.image);
        setImage(userInfo.image); // Cloudinary URL
      } else {
        console.log("Setting legacy image:", `${HOST}/${userInfo.image}`);
        setImage(`${HOST}/${userInfo.image}`); // Legacy local file
      }
    } else {
      console.log("No image in userInfo, setting to null");
      setImage(null);
    }
  }, [userInfo]);

  const validateProfile = () => {
    if (!firstName) {
      toast.error("First name required");
      return false;
    }
    if (!lastName) {
      toast.error("Last name required");
      return false;
    }
    return true;
  };

  const handleNavigate = () => {
    if (userInfo.profileSetup) {
      navigate("/chat");
    } else {
      toast.error("Please setup profile");
    }
  };

  const saveChanges = async () => {
    if (validateProfile()) {
      try {
        const res = await apiClient.post(
          UPDATE_PROFILE_ROUTE,
          { firstName, lastName, color: selectedColor },
          { withCredentials: true }
        );
        if (res.status === 200 && res.data) {
          setUserInfo({ ...res.data });
          toast.success("Profile updated");
          navigate("/chat");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleFileInputClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("=== Image Upload Debug ===");
      console.log("File selected:", file.name, file.type, file.size);

      const formData = new FormData();
      formData.append("profile-image", file);

      try {
        console.log("Sending upload request...");
        const res = await apiClient.post(ADD_PROFILE_IMAGE_ROUTE, formData, {
          withCredentials: true,
        });

        console.log("Upload response:", res.data);

        if (res.status === 200 && res.data.image) {
          console.log("Upload successful, new image URL:", res.data.image);
          // Update the user store with the new Cloudinary URL
          setUserInfo({ ...userInfo, image: res.data.image });
          // Set the local image state with the Cloudinary URL
          setImage(res.data.image);
          toast.success("Image updated successfully");
        } else {
          console.log("Upload failed - invalid response");
          toast.error("Failed to upload image");
        }
      } catch (error) {
        console.log("Error uploading image:", error);
        console.log("Error response:", error.response?.data);
        toast.error("Failed to upload image");
      }
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await apiClient.delete(REMOVE_PROFILE_IMAGE_ROUTE, {
        withCredentials: true,
      });
      if (res.status === 200) {
        setUserInfo({ ...userInfo, image: null });
        toast.success("Image removed successfully");
        setImage(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-white h-[100vh] flex items-center justify-center flex-col gap-10">
      <div className="flex flex-col gap-10 w-[80vw] md:w-max">
        <div>
          <IoIosArrowRoundBack
            onClick={handleNavigate}
            className="text-4xl lg:text-6xl text-opacity-90 cursor-pointer"
          />
        </div>
        <div className="grid grid-cols-2">
          <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className=" m-auto h-full md:w-48 md:h-48 relative flex flex-col items-center justify-center w-full"
          >
            <Avatar className="h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
              {image ? (
                <AvatarImage
                  src={image}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <AvatarFallback className="h-32 w-32 md:w-48 md:h-48 bg-gray-200 flex items-center justify-center">
                  <img
                    src={emptyImage}
                    alt="default profile"
                    className="object-cover w-full h-full"
                  />
                </AvatarFallback>
              )}
            </Avatar>
            {hovered && (
              <div
                className="h-32 w-32 md:w-48 md:h-48 absolute  flex items-center justify-center bg-black/50 rounded-full cursor-pointer"
                onClick={image ? handleDeleteImage : handleFileInputClick}
              >
                {image ? (
                  <FaTrash className="text-white text-3xl cursor-pointer" />
                ) : (
                  <FaPlus className="text-white text-3xl cursor-pointer" />
                )}
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={handleImageChange}
              name="profile-image"
              accept=".png, .jpg, .jpeg, .webp"
            />
          </div>
          <div className=" flex min-w-32 md:min-w-64 flex-col gap-5 text-black items-center justify-center">
            <div className="w-full">
              Email:
              <Input
                placeholder="Email"
                type="email"
                disabled
                value={userInfo.email}
                className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
              />
            </div>
            <div className="w-full">
              First Name:
              <Input
                placeholder="First Name"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
              />
            </div>
            <div className="w-full">
              Last Name:
              <Input
                placeholder="Last Name"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                className="focus:border-blue-500 block w-full rounded border px-3.5 py-2 shadow focus:outline-none"
              />
            </div>
          </div>
        </div>
        <div className="w-full outline-none">
          <Button
            className="ease-out focus:outline-none transition-all duration-150 active:scale-[98%] transform bg-blue-600 disabled:opacity-100 hover:bg-blue-800 w-full rounded p-3 text-white shadow"
            onClick={saveChanges}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
