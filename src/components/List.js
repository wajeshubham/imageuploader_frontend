import React, { useEffect, useState } from "react";
import { List, Layout, Spin, Button, Popconfirm } from "antd";
import axios from "axios";
import { server } from "../utils/server";

const { Content } = Layout;

const ImgList = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const deleteImg = async (id) => {
    let newData = data.filter((d) => d.id !== id); // we are removing image which has to be deleted from data list
    setData(newData);
    try {
      await axios({
        url: `${server}/api/image/${id}/delete/`,
        method: "DELETE",
      }).then((res) => {});
    } catch (error) {
      console.log(error);
    }
  };

  const fetchImages = async () => {
    try {
      await axios({
        url: `${server}/api/images/`,
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      }).then((res) => {
        setData(res.data);
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => fetchImages(), []);

  return (
    <Layout className="layout" style={{ backgroundColor: "white" }}>
      <Content className="list-cont">
        {loading ? (
          <div className="spin">
            <Spin />
          </div>
        ) : (
          <>
            <p
              style={{
                marginBottom: "20px",
                fontSize: "20px",
                display: `${data.length === 0 ? "none" : ""}`,
              }}
            >
              Uploaded images
            </p>
            <List
              className="list-c"
              style={{ width: "800px" }}
              itemLayout="horizontal"
              dataSource={data}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={<a href="https://ant.design">{item.title}</a>}
                    description={
                      <a href={`${item.img}`} target="_blank" rel="noreferrer">
                        View image
                      </a>
                    }
                  />

                  <Popconfirm
                    title="Are you sure you want to delete this image?"
                    onConfirm={() => deleteImg(item.id)}
                    onCancel={() => console.log("cancelled")}
                    okType="danger"
                    okText="Delete"
                    cancelText="Cancel"
                  >
                    <Button danger>Delete</Button>
                  </Popconfirm>
                </List.Item>
              )}
            />
          </>
        )}
      </Content>
    </Layout>
  );
};

export default ImgList;
