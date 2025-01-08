import LogoutButton from "../logout/LogoutButton.jsx";
import { useState, useEffect } from "react";
import { Skeleton } from "@mui/material";
import DialogUserSettings from "../dialog/DialogUserSettings.jsx";

export default function LogoutBox(props) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <>
      <div className="logout-box">
        {isLoading ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: "120px", height: "30px", margin: "15px" }}
          ></Skeleton>
        ) : (
          <DialogUserSettings fetchUserInfo={props.fetchUserInfo}></DialogUserSettings>
        )}
        {isLoading ? (
          <Skeleton
            variant="rounded"
            animation="wave"
            sx={{ width: "120px", height: "30px", margin: "15px" }}
          ></Skeleton>
        ) : (
          <LogoutButton></LogoutButton>
        )}
      </div>
    </>
  );
}
