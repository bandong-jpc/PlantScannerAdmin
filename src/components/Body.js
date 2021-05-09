import React, { useEffect, useState } from "react";
import {
  Switch,
  Snackbar,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  TextField,
  FormControlLabel,
} from "@material-ui/core";
import { styled, makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import firebaseApp from "../firebase.config";
import { Edit, Delete } from "@material-ui/icons/";

const StyledTF = styled(TextField)({
  margin: "20px 0px",
});

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

const Body = (trigger) => {
  const classes = useStyles();
  const defaultVal = {
    benefits: "",
    id: "",
    medicinalUse: "",
    localName: "",
    properUsage: "",
    /* contributor: "", */
    approved: false,
    file: "",
    /* contributorUID: "", */
    imgUrl: "",
  };
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();
  const [allPlants, setAllPlants] = useState([]);
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState({
    severity: "success",
    content: "Plant Added!",
    open: false,
  });
  const [selected, setSelected] = useState(defaultVal);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleDelete = () => {
    setDeleteOpen(!deleteOpen);
  };

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSnackToggle = () => {
    setSnack({ ...snack, open: false });
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const fetchAll = async () => {
    const storageRef = storage.ref();

    setAllPlants([]);
    await db
      .collection("plants")
      .get()
      .then((querySnapshot) => {
        const data = querySnapshot.docs.map((doc) => doc);
        data.forEach((item) => {
          const {
            medicinalUse,
            localName,
            /* contributor, */
            approved,
            file,
            /* contributorUID, */
            benefits,
            properUsage,
          } = item.data();

          const plant = {
            id: item.id,
            medicinalUse,
            localName,
            /* contributor, */
            approved,
            file,
            /* contributorUID, */
            benefits,
            properUsage,
          };

          storageRef
            .child("images/" + file)
            .getDownloadURL()
            .then((url) => {
              plant.imgUrl = url;
              setAllPlants((oldList) => [...oldList, plant]);
            });
        });
      });
  };

  const [formValid, setFormValid] = useState({
    medicinalUse: false,
    localName: false,
    benefits: false,
  });

  const onTFChange = (e) => {
    setSelected({ ...selected, [e.target.name]: e.target.value });
    setFormValid({ ...formValid, [e.target.name]: false });
  };

  const onSwitch = (e) => {
    setSelected({ ...selected, approved: e.target.checked });
  };

  const update = () => {
    const plantRef = db.collection("plants").doc(selected.id);

    if (
      selected.localName === "" ||
      selected.medicinalUse === "" ||
      selected.benefits === "" ||
      selected.properUsage === ""
    ) {
      if (selected.localName === "")
        setFormValid({ ...formValid, localName: true });
      if (selected.medicinalUse === "")
        setFormValid({ ...formValid, medicinalUse: true });
      if (selected.benefits === "")
        setFormValid({ ...formValid, benefits: true });
      if (selected.properUsage === "")
        setFormValid({ ...formValid, properUsage: true });
    } else {
      plantRef
        .update({
          approved: selected.approved,
          localName: selected.localName,
          medicinalUse: selected.medicinalUse,
          benefits: selected.benefits,
          properUsage: selected.properUsage,
        })
        .then(() => {
          setSnack({
            open: true,
            content: "Plant updated!",
            severity: "success",
          });
          fetchAll();
          handleSnackToggle();
          handleToggle();
        })
        .catch((error) => {
          setSnack({
            open: true,
            content: "Error" + error,
            severity: "error",
          });
        });
    }
  };

  const deletePlant = () => {
    db.collection("plants")
      .doc(selected.id)
      .delete()
      .then(() => {
        setSnack({
          open: true,
          content: "Plant deleted!",
          severity: "success",
        });
        fetchAll();
      })
      .catch((error) => {
        setSnack({
          open: true,
          content: "Error" + error,
          severity: "error",
        });
      });

    handleDelete();
  };

  /* useEffect(() => {
        fetchAll();
    }, []); */

  useEffect(() => {
    fetchAll();
  }, [trigger]);

  return (
    <div>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableCell>Scientific Name</TableCell>
            <TableCell>Image</TableCell>
            <TableCell>Local Name</TableCell>
            <TableCell>Medicinal Use</TableCell>
            <TableCell>Benefits</TableCell>
            <TableCell>Proper Usage</TableCell>
            <TableCell>Approved</TableCell>
            <TableCell>Actions</TableCell>
          </TableHead>
          <TableBody>
            {allPlants.map((plant) => {
              return (
                <TableRow key={plant.id}>
                  <TableCell>{plant.id}</TableCell>
                  <TableCell
                    onClick={() => {
                      openInNewTab(plant.imgUrl);
                    }}
                  >
                    <img
                      style={{
                        maxWidth: "50px",
                        maxHeight: "50px",
                      }}
                      src={plant.imgUrl}
                      alt={plant.id}
                    />
                  </TableCell>
                  <TableCell>{plant.localName}</TableCell>
                  <TableCell>{plant.medicinalUse}</TableCell>
                  <TableCell>{plant.benefits}</TableCell>
                  <TableCell>{plant.properUsage}</TableCell>

                  <TableCell>
                    {plant.approved ? "Approved" : "Not Approved"}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      style={{ marginBottom: "5px" }}
                      startIcon={<Edit />}
                      color="primary"
                      onClick={() => {
                        setSelected(plant);

                        handleToggle();
                      }}
                    >
                      Edit
                    </Button>

                    <Button
                      variant="outlined"
                      style={{
                        backgroundColor: "#ac0e28",
                      }}
                      size="small"
                      startIcon={<Delete />}
                      color="secondary"
                      onClick={() => {
                        setSelected(plant);

                        handleDelete();
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snack.open}
        autoHideDuration={6000}
        onClose={handleSnackToggle}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackToggle}
          severity={snack.severity}
        >
          {snack.content}
        </MuiAlert>
      </Snackbar>

      <Dialog open={open} onClose={handleToggle}>
        <DialogTitle>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {selected.id}
            <FormControlLabel
              control={
                <Switch
                  checked={selected.approved}
                  onChange={onSwitch}
                  name="approved"
                  color="primary"
                />
              }
              label={selected.approved ? "Approved" : "Not Approved"}
            />
          </div>
        </DialogTitle>
        <DialogContent>
          <form className={classes.root} noValidate autoComplete="off">
            <StyledTF
              error={formValid.localName}
              id="localName"
              name="localName"
              value={selected.localName}
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
              value={selected.medicinalUse}
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
              value={selected.properUsage}
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
              value={selected.benefits}
              onChange={onTFChange}
              label="Benefits"
              variant="outlined"
              fullWidth
              multiline
              rowsMax={8}
              rows={3}
              helperText="Required"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setFormValid({
                medicinalUse: false,
                localName: false,
                benefits: false,
              });
              handleToggle();
            }}
          >
            Cancel
          </Button>
          <Button onClick={update} color="primary" autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteOpen} onClose={handleDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove <b>{selected.id}</b>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDelete}>Cancel</Button>
          <Button onClick={deletePlant} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Body;
