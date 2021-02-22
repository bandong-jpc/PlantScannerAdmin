import React, { useEffect, useState } from "react";
import {
  Snackbar,
  Button,
  Dialog,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import firebaseApp from "../firebase.config";

const Body = () => {
  const db = firebaseApp.firestore();
  const storage = firebaseApp.storage();
  const [allPlants, setAllPlants] = useState([]);
  const [imgMap, setImgMap] = useState(new Map());
  const [open, setOpen] = useState(false);
  const [snack, setSnack] = useState(false);
  const [selected, setSelected] = useState({
    id: "",
    medicinalUse: "",
    localName: "",
    contributor: "",
    approved: "",
    file: "",
    contributorUID: "",
  });

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleSnackToggle = () => {
    setOpen(!snack);
  };

  const openInNewTab = (url) => {
    const newWindow = window.open(url, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  const fetchAll = async () => {
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
            contributor,
            approved,
            file,
            contributorUID,
            benefits,
          } = item.data();

          const plant = {
            id: item.id,
            medicinalUse,
            localName,
            contributor,
            approved,
            file,
            contributorUID,
            benefits,
          };
          setAllPlants((oldList) => [...oldList, plant]);
        });
      });
  };

  const update = () => {
    const plantRef = db.collection("plants").doc(selected.id);
    plantRef.update({ approved: true }).then(() => {
      fetchAll();
      handleSnackToggle();
      handleToggle();
    });
  };

  const getUrls = () => {
    const storageRef = storage.ref();

    allPlants.forEach((plant) => {
      storageRef
        .child("images/" + plant.file)
        .getDownloadURL()
        .then((url) => updateMap(plant.file, url));
    });
  };

  const updateMap = (k, v) => {
    setImgMap(new Map(imgMap.set(k, v)));
  };

  useEffect(() => {
    fetchAll();
    getUrls();
  }, []);

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
            <TableCell>Contributor</TableCell>
            <TableCell>Approved</TableCell>
          </TableHead>
          <TableBody>
            {allPlants.map((plant) => {
              return (
                <TableRow key={plant.id}>
                  <TableCell>{plant.id}</TableCell>
                  <TableCell
                    onClick={() => {
                      openInNewTab(imgMap.get(plant.file));
                    }}
                  >
                    <img
                      style={{ maxWidth: "50px", maxHeight: "50px" }}
                      src={imgMap.get(plant.file)}
                      alt={plant.id}
                    />
                  </TableCell>
                  <TableCell>{plant.localName}</TableCell>
                  <TableCell>{plant.medicinalUse}</TableCell>
                  <TableCell>{plant.benefits}</TableCell>
                  <TableCell>{plant.contributor}</TableCell>
                  <TableCell>
                    {plant.approved ? (
                      "Approved"
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          setSelected(plant);

                          handleToggle();
                        }}
                      >
                        Approve
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Snackbar
        open={snack}
        autoHideDuration={6000}
        onClose={handleSnackToggle}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleSnackToggle}
          severity="success"
        >
          Contribution approved!
        </MuiAlert>
      </Snackbar>
      <Dialog open={open} onClose={handleToggle}>
        <DialogTitle>
          Approve the contribution by <b>{selected.contributor}</b>?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Scientific Name: {selected.id} <br />
            Local Name: {selected.localName} <br />
            Medicinal Use: {selected.medicinalUse}
            <br />
            Benefits: {selected.benefits}
            <br />
            Image: <br />
            <img
              src={imgMap.get(selected.file)}
              style={{ maxWidth: "500px", maxHeight: "500px" }}
            />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleToggle}>Cancel</Button>
          <Button onClick={update} color="primary" autoFocus>
            Approve
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Body;
