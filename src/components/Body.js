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

    useEffect(() => {
        fetchAll();
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
                            src={selected.imgUrl}
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
