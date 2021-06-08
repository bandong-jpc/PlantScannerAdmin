import React, { useState } from "react";
import {
  Snackbar,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Tooltip,
} from "@material-ui/core";
import { makeStyles, styled } from "@material-ui/core/styles";
import { Add } from "@material-ui/icons";
import firebaseApp from "../firebase.config";
import MuiAlert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

const StyledTF = styled(TextField)({
  margin: "20px 0px",
});

const CustomAppBar = ({ setTrigger }) => {
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();

  const defaultVal = {
    benefits: "",
    medicinalUse: "",
    localName: "",
    properUsage: "",
    contributor: "Admin",
    approved: false,
    file: "",
    contributorUID: "NYRETRAfbRMt1s8T0ZtWknVh70E3",
  };
  const [newPlant, setNewPlant] = useState(defaultVal);

  const [plantId, setPlantId] = useState("");

  const [file, setFile] = useState("");

  const [snack, setSnack] = useState({
    severity: "success",
    content: "Plant Added!",
    open: false,
  });

  const [formValid, setFormValid] = useState({
    sciName: false,
    medicinalUse: false,
    localName: false,
    benefits: false,
    file: false,
    properUsage: false,
  });

  const handleClose = () => {
    setSnack({ ...snack, open: false });
  };

  const onChangeFile = (e) => {
    setFile(e.target.files[0]);

    setFormValid({ ...formValid, [e.target.name]: false });

    let newFileName =
      "PS_" +
      newPlant.contributorUID +
      "_" +
      Date.now() +
      "." +
      e.target.files[0].name.split(".").pop();

    setNewPlant({ ...newPlant, file: newFileName });
  };

  const onTFChange = (e) => {
    setNewPlant({ ...newPlant, [e.target.name]: e.target.value });
    setFormValid({ ...formValid, [e.target.name]: false });
  };

  const onIdChange = (e) => {
    setPlantId(e.target.value);
  };

  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const save = () => {
    const storageRef = storage.ref();
    if (
      plantId === "" ||
      file === "" ||
      newPlant.localName === "" ||
      newPlant.medicinalUse === "" ||
      newPlant.benefits === "" ||
      newPlant.medicinalUse === "" ||
      newPlant.properUsage === ""
    ) {
      if (plantId === "") setFormValid({ ...formValid, sciName: true });
      if (file === "") setFormValid({ ...formValid, file: true });
      if (newPlant.localName === "")
        setFormValid({ ...formValid, localName: true });
      if (newPlant.medicinalUse === "")
        setFormValid({ ...formValid, medicinalUse: true });
      if (newPlant.benefits === "")
        setFormValid({ ...formValid, benefits: true });
      if (newPlant.properUsage === "")
        setFormValid({ ...formValid, properUsage: true });
    } else {
      db.collection("plants")
        .doc(plantId)
        .set(newPlant)
        .then(() => {
          var uploadTask = storageRef
            .child("images/" + newPlant.file)
            .put(file);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setSnack({
                open: true,
                severity: "info",
                content: "Uploading: " + progress + "%",
              });
            },
            (error) => {
              setSnack({
                open: true,
                severity: "error",
                content: "Error" + error,
              });
            },
            () => {
              // Handle successful uploads on complete
              // For instance, get the download URL: https://firebasestorage.googleapis.com/...
              setSnack({
                open: true,
                severity: "success",
                content: "Plant Added!",
              });
              setTrigger();
              setNewPlant(defaultVal);
              setPlantId("");
            }
          );
        })
        .catch((error) => {
          setSnack({
            open: true,
            severity: "error",
            content: "Error: " + error,
          });
        });
      setFile("");
      handleToggle();
    }
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            style={{ color: "#fcfbfc" }}
            variant="h5"
            className={classes.title}
          >
            PlantScanner
          </Typography>
          <Button
            onClick={handleToggle}
            startIcon={<Add />}
            style={{ backgroundColor: "#fcfbfc" }}
            color="primary"
            variant="outlined"
          >
            Add Plant
          </Button>
        </Toolbar>
      </AppBar>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={handleClose}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleClose}
          severity={snack.severity}
        >
          {snack.content}
        </MuiAlert>
      </Snackbar>

      <Dialog maxWidth="sm" fullWidth open={open} onClose={handleToggle}>
        <DialogTitle>Add Plant</DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <StyledTF
              error={formValid.sciName}
              id="sciName"
              name="sciName"
              value={plantId}
              onChange={onIdChange}
              label="Scientific Name"
              variant="outlined"
              fullWidth
              helperText="Required"
            />
            <StyledTF
              error={formValid.localName}
              id="localName"
              name="localName"
              value={newPlant.localName}
              onChange={onTFChange}
              label="Local Name"
              variant="outlined"
              fullWidth
              multiline
              rowsMax={8}
              rows={3}
              helperText="Required"
            />
            <StyledTF
              error={formValid.medicinalUse}
              id="medicinalUse"
              name="medicinalUse"
              value={newPlant.medicinalUse}
              onChange={onTFChange}
              label="Medicinal Use"
              variant="outlined"
              fullWidth
              multiline
              rowsMax={8}
              rows={3}
              helperText="Required"
            />
            <StyledTF
              error={formValid.properUsage}
              id="properUsage"
              name="properUsage"
              value={newPlant.properUsage}
              onChange={onTFChange}
              label="Proper Usage"
              variant="outlined"
              fullWidth
              multiline
              rowsMax={8}
              rows={3}
              helperText="Required"
            />
            <StyledTF
              error={formValid.benefits}
              id="benefits"
              name="benefits"
              value={newPlant.benefits}
              onChange={onTFChange}
              label="Benefits"
              variant="outlined"
              fullWidth
              multiline
              rowsMax={8}
              rows={3}
              helperText="Required"
            />
            <Tooltip open={formValid.file} title="Select an image">
              <div style={{ margin: "20px  0px" }}>
                <input
                  type="file"
                  className="custom-file-input"
                  id="customFile"
                  onChange={onChangeFile}
                  accept="image/*"
                />
              </div>
            </Tooltip>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggle}>Cancel</Button>
          <Button
            onClick={() => {
              save();
            }}
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomAppBar;
