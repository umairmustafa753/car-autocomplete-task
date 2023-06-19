import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Autocomplete,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

const AutocompleteComponent = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [response, setResponse] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [year, setYear] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isFilterApply, setFilterApply] = useState(false);
  const [priceError, setPriceError] = useState("");

  const handleInputChange = (event) => {
    const value = event.target.value;
    fetchSuggestions(value);
  };

  const handleSelectOption = (event, car) => {
    const filterCars = response.filter((item) => {
      return item.CarName === car.CarName;
    });
    setFilteredCars(filterCars);
    setSuggestions(filterCars);
    setResponse([]);
  };

  const handleFilter = () => {
    if (Number(maxPrice) < Number(minPrice)) {
      setPriceError("Max price cannot be less than min price");
      return;
    }
    const filteredAndPriced = suggestions.filter((car) => {
      if (year > 0) {
        return (
          Number(car.price) >= Number(minPrice) &&
          Number(car.price) <= Number(maxPrice) &&
          Number(car.year) === Number(year)
        );
      } else {
        return (
          Number(car.price) >= Number(minPrice) &&
          Number(car.price) <= Number(maxPrice)
        );
      }
    });
    setFilteredCars(filteredAndPriced);
    setFilterApply(true);
    setPriceError("");
  };

  const fetchSuggestions = async (value) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/cars?carName=${value}`,
        {
          headers: {
            "X-Api-Key": "h3BNQofhLGmO0fgHvcXEPQ==1xWsTuePQoG9csrg",
          },
        }
      );
      const uniqueData = [
        ...new Map(response.data.map((item) => [item.CarName, item])).values(),
      ];
      setSuggestions(uniqueData);
      setResponse(response.data);
      setMaxPrice(0);
      setMinPrice(0);
      setLoading(false);
    } catch (error) {
      setSuggestions([]);
      setLoading(false);
    }
  };

  const clearFilter = () => {
    setMaxPrice(0);
    setMinPrice(0);
    setYear(0);
    setFilteredCars(suggestions);
    setFilterApply(false);
  };

  return (
    <div>
      <Autocomplete
        loading={loading}
        options={suggestions}
        getOptionLabel={(car) => `${car.CarName}`}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Car Model"
            onChange={handleInputChange}
          />
        )}
        onChange={handleSelectOption}
        style={{ marginBottom: "1rem", marginTop: "1rem" }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <TextField
          label="Min Price"
          value={minPrice}
          type="number"
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ flexGrow: 1, minWidth: 0 }}
        />
        <TextField
          label="Max Price"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ flexGrow: 1, minWidth: 0 }}
        />
        <TextField
          label="Year"
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          style={{ flexGrow: 1, minWidth: 0 }}
        />
        <Button
          variant="contained"
          onClick={handleFilter}
          disabled={!minPrice && !maxPrice}
          style={{ flexGrow: 1, minWidth: 0 }}
        >
          Filter
        </Button>
        {isFilterApply ? (
          <Button
            variant="outlined"
            color="error"
            onClick={clearFilter}
            style={{ flexGrow: 1, minWidth: 0 }}
          >
            Clear Filter
          </Button>
        ) : null}
      </div>
      {priceError && (
        <Typography variant="body2" color="error">
          {priceError}
        </Typography>
      )}
      {filteredCars.length === 0 ? (
        <Typography
          variant="body1"
          sx={{ marginTop: "1rem", textAlign: "center" }}
        >
          No data found.
        </Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Year</TableCell>
              <TableCell>Price</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCars.map((car, index) => (
              <TableRow key={index}>
                <TableCell>{car.CarName}</TableCell>
                <TableCell>{car.year}</TableCell>
                <TableCell>{car.price}$</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
};

export default AutocompleteComponent;
