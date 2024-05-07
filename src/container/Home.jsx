import {
  AppBar,
  Drawer,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
  Avatar,
  Tooltip,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DatasetIcon from "@mui/icons-material/Dataset";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import UpdateIcon from "@mui/icons-material/Update";
import DeleteIcon from "@mui/icons-material/Delete";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState, useEffect } from "react";

import ConfirmationDialog from "../components/ConfirmDialog";

// firebase and Google OAuth
import firebase, { firestore } from "../firebase/firebaseConfig";
import {
  collection,
  query,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  Timestamp,
  addDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../utils/fetchUser";
import LogoutIcon from "@mui/icons-material/Logout";
import { googleLogout } from "@react-oauth/google";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});

function Home() {
  //  user state after login
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const userInfo = fetchUser();

  useEffect(() => {
    //  user is not logged redirect to login page
    if (!userInfo) {
      navigate("/login");
    }
    // console.log("userinfo", userInfo);
  }, []);

  const [data, setData] = useState([]);
  const getVisions = () => {
    const q = query(collection(firestore, getCollectionName()));
    const unsub = onSnapshot(q, (querySnapshot) => {
      let todosArray = [];
      querySnapshot.forEach((doc) => {
        todosArray.push({ ...doc.data(), id: doc.id });
      });
    //   console.log("read operation : ", todosArray);
      setData(todosArray);
    });
    return () => unsub();
  };
  useEffect(() => {
    getVisions();
  }, []);

  const [drawerState, setDrawerState] = useState(false);
  const handleDrawerOpen = () => {
    setDrawerState(true);
  };
  const handleDrawerClose = () => {
    setDrawerState(false);
    resetFormState();
  };
  // a state to store actionId
  const [actionId, setActionId] = useState(-1);

  //  a method to update actionId
  const handleActionId = (id) => {
    setActionId(id);
  };
  //  set of actions
  const actions = {
    add: 1,
    update: 2,
  };
  // separate methods for each action
  const isAdd = () => {
    return actionId === actions.add;
  };
  const isUpdate = () => {
    return actionId == actions.update;
  };

  const [formState, setFormState] = useState({
    name: "",
    website: "",
    logo: "",
    vision_description: "",
  });
  const handleFormState = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };
  //  store form state to perform update operation
  const saveUpdateState = (value) => {
    setFormState(value);
  };

  const resetFormState = () => {
    setFormState({ name: "", website: "", logo: "", vision_description: "" });
  };
  const getCollectionName = () => `collection_${userInfo?.email}`;

  //  Create Operation
  const handleCreate = async (collectionName, data) => {
    await addDoc(collection(firestore, collectionName), data);
  };
  //  Edit Operation
  const handleEdit = async (collectionName, id, data) => {
    await updateDoc(doc(firestore, collectionName, id), data);
  };
  //  Delete Operation
  const handleDelete = async (collectionName, id) => {
    await deleteDoc(doc(firestore, collectionName, id));
  };

  const onSubmit = () => {
    // console.log("form state: ", formState);

    const collectionName = getCollectionName();
    if (isAdd()) {
      //  add operation
      //  console.log("add operation : ");
      handleCreate(collectionName, formState);
    }
    if (isUpdate()) {
      //   console.log("update operation : ");
      const id = formState.id;
      delete formState.id;
      handleEdit(collectionName, id, formState);
    }
    handleDrawerClose();
  };

  const handleDrawer = (id) => {
    handleActionId(id);
    handleDrawerOpen();
  };
  const logout = () => {
    localStorage.clear();
    googleLogout();
    navigate("/login");
  };

  // states for confirmation dialog box
  const [confirmDialog, setConfirmDialog] = useState(false);

  // for dialog to create entry
  const handleConfirmOpen = () => {
    setConfirmDialog(true);
  };
  //  to close dialog
  const handleConfirmClose = () => {
    setConfirmDialog(false);
    // extra work
    resetId();
  };
  //    used to delete
  const [id, setId] = useState(null);
  const handleId = (id) => {
    setId(id);
  };
  const resetId = () => {
    setId(null);
  };
  return (
    <div>
      <Stack spacing="2">
        <ThemeProvider theme={darkTheme}>
          <AppBar
            position="static"
            enableColorOnDark
            sx={{ backgroundColor: "#232823", zIndex: 11 }}
          >
            <Toolbar>
              <IconButton
                onClick={() => {
                  handleDrawer(actions.add);
                }}
                edge="start"
                color="inherit"
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ flexGrow: 1 }}
              >
                Vision
              </Typography>

              <Tooltip title="Logout">
                <IconButton
                  onClick={logout}
                  size="large"
                  sx={{
                    backgroundColor: "white",
                    ":hover": {
                      backgroundColor: "white",
                    },
                  }}
                >
                  <LogoutIcon style={{ color: "red" }} />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </AppBar>
          <Drawer anchor="right" open={drawerState} onClose={handleDrawerClose}>
            <Paper sx={{ m: 2, p: 3, borderRadius: "10px", width: "400px" }}>
              {["Name", "Website", "Logo", "Vision Description"].map(
                (value, index) => {
                  if (index < 3) {
                    return (
                      <TextField
                        key={index}
                        margin="dense"
                        name={value.toLowerCase()}
                        label={value}
                        type="text"
                        fullWidth
                        variant="standard"
                        autoComplete="off"
                        value={formState[value.toLowerCase()]}
                        onChange={handleFormState}
                      />
                    );
                  } else {
                    var newName = value.toLowerCase();
                    newName =
                      newName.split(" ")[0] + "_" + newName.split(" ")[1];
                    return (
                      <TextField
                        key={index}
                        margin="dense"
                        name={newName}
                        label={value}
                        type="text"
                        multiline={true}
                        maxRows={4}
                        fullWidth
                        variant="standard"
                        autoComplete="off"
                        value={formState[newName]}
                        onChange={handleFormState}
                        sx={{
                          ".MuiInputBase-inputMultiline": {
                            overflow: "hidden",
                          },
                        }}
                      />
                    );
                  }
                }
              )}
              <Stack
                direction="row"
                justifyContent="flex-start"
                spacing={2}
                my={2}
              >
                <Button
                  variant="contained"
                  color="warning"
                  sx={{ color: "white" }}
                  onClick={handleDrawerClose}
                >
                  CANCEL
                </Button>
                <Button
                  variant="contained"
                  sx={{ color: "white" }}
                  onClick={onSubmit}
                >
                  {isAdd() && "ADD"}
                  {isUpdate() && "UPDATE"}
                </Button>
              </Stack>
            </Paper>
          </Drawer>
        </ThemeProvider>
      </Stack>
      {data.length === 0 && (
        <Stack
          direction="column"
          spacing={2}
          sx={{
            zIndex: 10,
            position: "absolute",
            top: "0",
            bottom: "0",
            left: "0",
            right: "0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <DatasetIcon
            sx={{
              width: "200px",
              height: "200px",
              color: "white",
              backgroundColor: "rgba(0,0,0,0.7)",
              borderRadius: "50px",
            }}
          />
          <Typography variant="h4" sx={{ color: "white" }}>
            No Data
          </Typography>
        </Stack>
      )}

      <Grid container spacing={2} columnGap={2} rowGap={1} m={2} width="auto">
        {data.map((value, index) => {
          return (
            <Grid
              item
              xs={5.5}
              component={Paper}
              sx={{
                m: 1,
                p: 3,
                borderRadius: "15px",
              }}
              key={index}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar src={value?.logo} />

                <Typography
                  sx={{ fontWeight: "bold", fontSize: "30px", flexGrow: 1 }}
                  noWrap
                >
                  {value?.name}
                </Typography>
                <Tooltip
                  title="UPDATE"
                  onClick={() => {
                    saveUpdateState(value);
                    handleDrawer(actions.update);
                  }}
                >
                  <IconButton>
                    <UpdateIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="OPEN">
                  <IconButton
                    LinkComponent={"a"}
                    href={value?.website}
                    target="_blank"
                  >
                    <OpenInNewIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="DELETE">
                  <IconButton
                    onClick={() => {
                      handleId(value.id);
                      handleConfirmOpen();
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                {/* <Button
                  variant="contained"
                  endIcon={<OpenInNewIcon />}
                  LinkComponent={"a"}
                  href={value?.website}
                  target="_blank"
                >
                  Open
                </Button> */}
              </Stack>

              <Stack
                direction="column"
                spacing={2}
                alignItems="center"
                m={1.5}
                mb={2}
              >
                <Typography variant="h5" component="div">
                  {value?.vision_description}
                </Typography>
              </Stack>
            </Grid>
          );
        })}
      </Grid>
      {confirmDialog && (
        <ConfirmationDialog
          open={confirmDialog}
          handleClose={handleConfirmClose}
          handleDelete={() => {
            handleDelete(getCollectionName(),id);
          }}
        />
      )}
    </div>
  );
}

export default Home;
