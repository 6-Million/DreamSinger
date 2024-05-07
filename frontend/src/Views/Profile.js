import React, { useEffect, useState } from "react";
import { Card, Form, Input, Button } from "antd";
import { EditOutlined, CloseOutlined } from "@ant-design/icons";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserInfo } from "../store/modules/user";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userInfo, setUserInfo] = useState({
    email: "aaa@umass.edu",
    username: "aaa",
    realname: "aaa",
    gender: 0,
    age: 11,
    phone: "1",
  });

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchUserInfo());
  }, [dispatch]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (values) => {
    setUserInfo(values);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const genderText = userInfo.gender === 0 ? "男" : "女";

  return (
    <div>
      <Navbar />
      <div className="centered-container">
        <Card
          title="用户信息"
          extra={
            !isEditing && (
              <Button icon={<EditOutlined />} onClick={handleEdit}>
                编辑
              </Button>
            )
          }
          style={{ width: 300 }}
        >
          {!isEditing ? (
            <div>
              <p>邮箱: {userInfo.email}</p>
              <p>用户名: {userInfo.username}</p>
              <p>姓名: {userInfo.realname}</p>
              <p>性别: {genderText}</p>
              <p>年龄: {userInfo.age}</p>
              <p>电话: {userInfo.phone}</p>
            </div>
          ) : (
            <Form
              initialValues={userInfo}
              onFinish={handleSave}
              layout="vertical"
            >
              <Form.Item label="邮箱" name="email">
                <Input disabled />
              </Form.Item>
              <Form.Item label="用户名" name="username">
                <Input />
              </Form.Item>
              <Form.Item label="姓名" name="realname">
                <Input disabled />
              </Form.Item>
              <Form.Item label="性别" name="gender">
                <Input />
              </Form.Item>
              <Form.Item label="年龄" name="age">
                <Input type="number" />
              </Form.Item>
              <Form.Item label="电话" name="phone">
                <Input />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  保存
                </Button>
                <Button style={{ marginLeft: "10px" }} onClick={handleCancel}>
                  取消
                </Button>
              </Form.Item>
            </Form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Profile;
