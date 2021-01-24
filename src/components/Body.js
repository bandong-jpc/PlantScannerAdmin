import React, { useEffect, useState } from "react";
import db from "../firebase.config";

const Body = () => {
  const [allPlants, setAllPlants] = useState([]);

  const fetchAll = async () => {
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
      {allPlants &&
        allPlants.map((plant) => {
          return (
            <>
              <h4>{plant.id}</h4>
              <p>{plant.localName}</p>
            </>
          );
        })}
    </div>
  );
};

export default Body;
