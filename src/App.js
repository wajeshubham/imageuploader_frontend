import React, { useState } from "react";
import "antd/dist/antd.css";
import "./App.css";
import { Form, Button, Progress, Input, Layout, Menu } from "antd";
import axios from "axios";
import ImgList from "./components/List";
import { server } from "./utils/server";

const { Content, Header } = Layout;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const App = () => {
  const [image, setImage] = useState("");
  const [title, setTitle] = useState("");
  const [progress, setProgress] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handelSubmit = async () => {
    setIsSubmitted(true);
    try {
      let imgData = new FormData();
      imgData.append("title", title);
      imgData.append("img", image);

      await axios({
        url: `${server}/api/upload/`,
        method: "POST",
        data: imgData,
        onUploadProgress: (progressEvent) => {
          // this on upload will show progress of
          // image upoading and not complete response from backend
          // after progress is 100% it will take some time to get response
          // from backend

          setProgress(
            Math.round((progressEvent.loaded * 100) / progressEvent.total) // calculate progress between 0-100
          );
        },
        headers: {
          Accept: "application/json",
          "Content-Type": "multipart/form-data",
        },
      }).then((res) => {
        // reload page after successfull submission
        window.location.reload();
      });
    } catch (error) {
      console.log(error);
    }
  };

  const imagePicker = async (e) => {
    e.preventDefault();
    setImage(e.target.files[0]);
  };

  const onFinish = async (values) => {
    console.log(values);
    handelSubmit();
  };

  return (
    <>
      <Layout className="layout">
        <Header className="header">
          <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
            <Menu.Item className="header-menu" key="1">
              Image uploader
            </Menu.Item>
          </Menu>
        </Header>
        <Content className="form-cont">
          {/* if progress is between 0-100 we will display progress bar*/}
          <Progress
            className="progress"
            style={{
              display: `${progress > 0 && progress < 100 ? "" : "none"}`,
            }}
            percent={progress}
          />

          {/* if progress is equal to 100 then we will display waiting response */}
          <p
            className="progress"
            style={{
              display: `${isSubmitted && progress === 100 ? "" : "none"}`,
            }}
          >
            Waiting for response from the server please wait...
          </p>

          <Form {...formItemLayout} onFinish={onFinish}>
            <p
              style={{
                marginBottom: "20px",
                fontSize: "20px",
              }}
            >
              Upload an image
            </p>
            <Form.Item style={{ marginTop: "20px" }}>
              <p>Title</p>
              <Input
                required={true}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Item>

            <Form.Item>
              <input
                type="file"
                name="image"
                id="imagepicker"
                accept="image/*"
                multiple={false}
                onChange={(e) => {
                  imagePicker(e);
                }}
                required={true}
              />
            </Form.Item>

            <Form.Item>
              <Button
                className="mt-1"
                type="primary"
                htmlType="submit"
                // onClick={handelSubmit}
                disabled={isSubmitted}
              >
                {isSubmitted ? "Uploading..." : "Submit"}
              </Button>
            </Form.Item>
          </Form>
        </Content>
      </Layout>
      <ImgList />
      {/*list component */}
    </>
  );
};

export default App;
