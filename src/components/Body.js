import React, { useEffect, useState } from "react";
import {
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import MuiAlert from "@material-ui/lab/Alert";
import firebaseApp from "../firebase.config";
import { Edit, Delete } from "@material-ui/icons/";

const Body = (trigger) => {
    const db = firebaseApp.firestore();
    const storage = firebaseApp.storage();
    const [allPlants, setAllPlants] = useState([]);
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
        imgUrl: "",
    });
    const [deleteOpen, setDeleteOpen] = useState(false);

    const handleDelete = () => {
        setDeleteOpen(!deleteOpen);
    };

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

    const update = () => {
        const plantRef = db.collection("plants").doc(selected.id);
        plantRef.update({ approved: true }).then(() => {
            fetchAll();
            handleSnackToggle();
            handleToggle();
        });
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
                        <TableCell>Contributor</TableCell>
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
                                    <TableCell>{plant.contributor}</TableCell>
                                    <TableCell>
                                        {plant.approved
                                            ? "Approved"
                                            : "Not Approved"}
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            style={{
                                                backgroundColor: "#93a368",
                                            }}
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
                <DialogTitle>{selected.id}</DialogTitle>
                <DialogContent>
                    {/* <DialogContentText>
                        Scientific Name: {selected.id} <br />
                        Local Name: {selected.localName} <br />
                        Medicinal Use: {selected.medicinalUse}
                        <br />
                        Benefits: {selected.benefits}
                        <br />
                        Image: <br />
                        <img
                            src={selected.imgUrl}
                            style={{ maxWidth: "500px", maxHeight: "500px" }}
                        />
                    </DialogContentText> */}
                    {/* <TextField id="localNameTF" />
                    <img
                        src={selected.imgUrl}
                        style={{ maxWidth: "500px", maxHeight: "500px" }}
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleToggle}>Cancel</Button>
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
                    <Button onClick={handleDelete} color="primary" autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default Body;
