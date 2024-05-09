import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button, Select } from "antd";
import { EditOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo, updateUserInfo } from "../store/modules/user";
import "./Profile.css";

function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const { userInfo } = useSelector((state) => state.user);
  // When initializing the state or updating it from userInfo:
  const [userInfor, setUserInfo] = useState({
    email: userInfo?.email || "",
    username: userInfo?.username || "",
    realname: userInfo?.realname || "",
    gender: userInfo.gender || "", // Ensuring gender is set correctly
    age: userInfo?.age || "",
    phone: userInfo?.phone || "",
  });

  useEffect(() => {
    if (userInfo) {
      setUserInfo({
        email: userInfo.email,
        username: userInfo.username,
        realname: userInfo.realname,
        gender: userInfo.gender,
        age: userInfo.age,
        phone: userInfo.phone,
      });
    }
  }, [userInfo]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (values) => {
    console.log("values: ", values);
    values.gender = Number(values.gender); // Make sure backend expects a number!
    // Check if values have changed
    const hasChanges = Object.keys(values).some(
      (key) => values[key] !== userInfor[key]
    );

    if (!hasChanges) {
      alert("No changes to save.");
      return; // Exit the function if no changes
    }

    dispatch(updateUserInfo(values)).then((updatedUser) => {
      if (updatedUser) {
        setUserInfo({
          email: updatedUser.email || userInfor.email,
          username: updatedUser.username || userInfor.username,
          realname: updatedUser.realname || userInfor.realname,
          gender:
            updatedUser.gender !== undefined
              ? updatedUser.gender
              : userInfor.gender,
          age: updatedUser.age || userInfor.age,
          phone: updatedUser.phone || userInfor.phone,
        });
        setIsEditing(false);
      } else {
        throw new Error("No user data returned after update.");
      }
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const genderText =
    userInfor?.gender === 0
      ? "Male"
      : userInfor.gender === 1
      ? "Female"
      : "Not Set";

  return (
    <div>
      <Navbar />
      <div className="centered-container">
        <Card
          title="User Information"
          extra={
            !isEditing && (
              <Button icon={<EditOutlined />} onClick={handleEdit}>
                Edit
              </Button>
            )
          }
          style={{ width: 500 }} // Adjusted width
        >
          {!isEditing ? (
            <div>
              <p>Email: {userInfor.email}</p>
              <p>Username: {userInfor.username}</p>
              <p>Real name: {userInfor.realname}</p>
              <p>Gender: {genderText}</p>
              <p>Age: {userInfor.age}</p>
              <p>Phone: {userInfor.phone}</p>
            </div>
          ) : (
            <Form
              key={userInfor.email} // Use a unique key to force re-rendering when userInfor changes
              initialValues={userInfor}
              onFinish={handleSave}
              layout="vertical"
            >
              <Form.Item label="Email" name="email">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Username" name="username">
                <Input />
              </Form.Item>
              <Form.Item label="Real name" name="realname">
                <Input disabled />
              </Form.Item>
              <Form.Item label="Gender" name="gender">
                <Select placeholder="Select gender">
                  <Select.Option value={0}>Male</Select.Option>
                  <Select.Option value={1}>Female</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="Age" name="age">
                <Select placeholder="Select age">
                  {Array.from({ length: 100 }, (_, i) => (
                    <Select.Option key={i + 1} value={i + 1}>
                      {i + 1}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
                <Button style={{ marginLeft: "10px" }} onClick={handleCancel}>
                  Cancel
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
}

export default Profile;
