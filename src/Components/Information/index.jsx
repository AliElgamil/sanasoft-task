import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import React, { useState } from "react";
import useSWR from "swr";
// import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export default function Information({
  errors,
  handleBlur,
  handleChange,
  touched,
  setFieldValue,
}) {
  const { data: users } = useSWR("/data/users.json", fetcher);
  const { data: countries } = useSWR("/data/countries.json", fetcher);
  const [cities, setCities] = useState([]);

  const dateChanged = (val) => setFieldValue("date", new Date(val));

  const countryChange = (val) => {
    const cities = countries.filter(
      (c) => c.countryName === val.target.value
    )[0].cities;
    setCities(cities);
    setFieldValue("country", val);
  };

  return (
    <div className="info-input">
      {/* User id Input */}
      <FormControl
        sx={{
          margin: "15px 0",
        }}
      >
        <InputLabel id="userId">User Id</InputLabel>
        <Select
          name="userId"
          labelId="userId"
          label="User Id"
          sx={{
            width: "150px",
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          defaultValue={""}
        >
          {users?.map((user) => (
            <MenuItem value={user.name} key={user.id}>
              {user.name}
            </MenuItem>
          ))}
        </Select>
        {errors.userId && touched.userId ? (
          <FormHelperText error>
            {/* <ErrorOutlineOutlinedIcon /> */}
            {errors.userId}
          </FormHelperText>
        ) : null}
      </FormControl>

      {/* Date Input */}
      <FormControl fullWidth>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={["DatePicker"]}>
            <DatePicker
              label="Chose the date"
              dateAdapter={AdapterDayjs}
              onChange={dateChanged}
              onBlur={dateChanged}
              name="date"
            />
          </DemoContainer>
        </LocalizationProvider>
        {errors.date && touched.date ? (
          <FormHelperText error>
            date field must be at earlier than or equal the date of the day
          </FormHelperText>
        ) : null}
      </FormControl>

      {/* Country Input */}
      <FormControl
        sx={{
          margin: "15px 0",
        }}
      >
        <InputLabel id="country">Country</InputLabel>
        <Select
          name="country"
          labelId="country"
          label="Country"
          sx={{
            width: "200px",
          }}
          onChange={countryChange}
          onBlur={handleBlur}
          defaultValue={""}
        >
          {countries?.map((country, index) => (
            <MenuItem value={country.countryName} key={index}>
              {country.countryName}
            </MenuItem>
          ))}
        </Select>
        {errors.country && touched.country ? (
          <FormHelperText error>{errors.country}</FormHelperText>
        ) : null}
      </FormControl>

      {/* City Input */}
      <FormControl
        sx={{
          margin: "15px 0",
        }}
      >
        <InputLabel id="city">City</InputLabel>
        <Select
          name="city"
          labelId="city"
          label="City"
          sx={{
            width: "150px",
          }}
          onChange={handleChange}
          onBlur={handleBlur}
          defaultValue={""}
        >
          {cities.length ? (
            cities?.map((city, index) => (
              <MenuItem value={city.cityName} key={index}>
                {city.cityName}
              </MenuItem>
            ))
          ) : (
            <MenuItem value={""}>No cities yet!</MenuItem>
          )}
        </Select>
        {errors.city && touched.city ? (
          <FormHelperText error>{errors.city}</FormHelperText>
        ) : null}
      </FormControl>

      {/* Address Input */}
      <FormControl
        sx={{
          margin: "15px 0",
        }}
        fullWidth
      >
        <TextField
          id="outlined-basic"
          label="Address"
          variant="outlined"
          onChange={handleChange}
          onBlur={handleBlur}
          name="address"
          sx={{
            maxWidth: "400px",
          }}
        />

        {errors.address && touched.address ? (
          <FormHelperText error>{errors.address}</FormHelperText>
        ) : null}
      </FormControl>
    </div>
  );
}
