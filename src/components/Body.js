import React, { useEffect, useState } from "react";
import {
  Paper,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import db from "../firebase.config";

const Body = () => {
  const [allPlants, setAllPlants] = useState([]);

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
            status,
            file,
            contributorUID,
          } = item.data();

          const plant = {
            id: item.id,
            medicinalUse,
            localName,
            contributor,
            status,
            file,
            contributorUID,
          };

          setAllPlants((oldList) => [...oldList, plant]);

          console.log(allPlants);
        });
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
            <TableCell>Local Name</TableCell>
            <TableCell>Medicinal Use</TableCell>
            <TableCell>Contributor</TableCell>
            <TableCell>Approved</TableCell>
          </TableHead>
          <TableBody>
            {allPlants.map((plant) => {
              return (
                <TableRow key={plant.id}>
                  <TableCell>{plant.id}</TableCell>
                  <TableCell>{plant.localName}</TableCell>
                  <TableCell>{plant.medicinalUse}</TableCell>
                  <TableCell>{plant.contributor}</TableCell>
                  <TableCell>
                    <Switch name="checkedB" color="primary" />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default Body;
