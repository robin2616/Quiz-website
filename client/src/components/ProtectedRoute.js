import { message } from "antd";
import React, { useEffect, useState } from "react";
import { getUserInfo } from "../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetUser } from "../redux/usersSlice";
import { useNavigate } from "react-router-dom";
import { HideLoading, ShowLoading } from "../redux/loaderSlice";
import { use } from "react";

function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.users);
  const [menu, setMenu] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const userMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Reports",
      paths: ["/user/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/user/reports"),
    },
    {
      title: "Profile",
      paths: ["/user/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/profile"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const adminMenu = [
    {
      title: "Home",
      paths: ["/", "/user/write-exam"],
      icon: <i className="ri-home-line"></i>,
      onClick: () => navigate("/"),
    },
    {
      title: "Exams",
      paths: ["/admin/exams", "/admin/exams/add"],
      icon: <i className="ri-file-list-line"></i>,
      onClick: () => navigate("/admin/exams"),
    },
    {
      title: "Reports",
      paths: ["/admin/reports"],
      icon: <i className="ri-bar-chart-line"></i>,
      onClick: () => navigate("/admin/reports"),
    },
    {
      title: "Profile",
      paths: ["/user/profile"],
      icon: <i className="ri-user-line"></i>,
      onClick: () => navigate("/admin/profile"),
    },
    {
      title: "Logout",
      paths: ["/logout"],
      icon: <i className="ri-logout-box-line"></i>,
      onClick: () => {
        localStorage.removeItem("token");
        navigate("/login");
      },
    },
  ];

  const getUserData = async () => {
    try {
      dispatch(ShowLoading());
      const response = await getUserInfo();
      dispatch(HideLoading());

      if (response.success) {
        dispatch(SetUser(response.data));
        setMenu(response.data.isAdmin ? adminMenu : userMenu);
      } else {
        message.error(response.message);
      }
    } catch (error) {
      dispatch(HideLoading());
      message.error(error.message);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUserData();
    } else {
      navigate("/login");
    }
  }, []);

  const activeRoute = window.location.pathname;

  const getIsActiveOrNot = (paths) => {
    if (!Array.isArray(paths)) return false;

    if (paths.includes(activeRoute)) return true;

    if (
      activeRoute.includes("/admin/exams/edit") &&
      paths.includes("/admin/exams")
    ) {
      return true;
    }

    if (
      activeRoute.includes("/user/write-exam") &&
      paths.includes("/user/write-exam")
    ) {
      return true;
    }

    return false;
  };

  return (
    <div className="layout">
      <div className="flex gap-1 w-full h-full">
        <div className="body">
          <div className="header flex justify-between">
            {!collapsed ? (
              <i className="ri-close-line" onClick={() => setCollapsed(true)} />
            ) : (
              <i className="ri-menu-line" onClick={() => setCollapsed(false)} />
            )}

            <h1 className="text-2xl text-white">QUIZ Application</h1>

            <div className="menu flex flex-row">
              {menu.map((item, index) => (
                <div
                  key={index}
                  className={`menu-item ${
                    getIsActiveOrNot(item.paths) ? "active-menu-item" : ""
                  } flex text-md text-gray-300 items-center hover:scale-110 transition-all duration-300`}
                  onClick={item.onClick}
                >
                  {item.icon}
                  {!collapsed && <span>{item.title}</span>}
                </div>
              ))}
            </div>

            {/* <div className="flex gap-1 items-center">
              <h1 className="text-md text-white">{user?.name}</h1>
              <span>Role: {user?.isAdmin ? "Admin" : "User"}</span>
            </div> */}
            <div>
              <div className=" flex flex-col flex-center">
                <span className="text-xl">{user.name}</span>
                <span className="text-gray-100">{user?.isAdmin ? "Admin" : "User"}</span>
              </div>
            </div>
          </div>

          <div className="content">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default ProtectedRoute;
