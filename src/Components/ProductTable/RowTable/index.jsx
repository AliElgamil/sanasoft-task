import React, { Fragment, useContext, useState } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import useSWR from "swr";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { FormContext } from "../../../App";

const fetcher = (...args) => fetch(...args).then((res) => res.json());

function priceRow(qty, unit) {
  return qty * unit;
}

function vatRow(price, vat) {
  return (price * vat) / 100;
}

function createRow(desc, qty, unit, vat) {
  const price = priceRow(qty, unit);
  const productVat = vatRow(price, vat);
  const finalPrice = productVat + price;

  console.log();
  console.log(price);
  return {
    id: crypto.randomUUID(),
    desc,
    qty,
    unit,
    price,
    vat,
    productVat,
    finalPrice,
  };
}

export default function RowTable({
  row,
  ccyFormat,
  setProductBay,
  index,
  productsBL,
}) {
  const { data: products } = useSWR("/data/products.json", fetcher);
  const { errors, handleChange, handleBlur, touched, setFieldValue } =
    useContext(FormContext);
  const [update, setUpdate] = useState(false);

  const handleProduct = (val) => {
    const product = products.filter(
      (product) => val.target.value === product.productName
    )[0];
    if (update) {
      setProductBay((PrevState) =>
        PrevState.map((pro) => {
          if (pro.id === row.id) {
            return createRow(val.target.value, pro.qty, product.price, pro.vat);
          }
          return pro;
        })
      );
    } else {
      setProductBay((val) => {
        const prevState = val.filter((item) => item);
        return [
          ...prevState,
          createRow(product.productName, 1, product.price, 14),
        ];
      });
      setUpdate(true);
    }
    setFieldValue("product", val);
  };

  const handleQuntity = (val) => {
    console.log(row);

    setProductBay((prevState) => {
      return prevState.map((item) => {
        if (item.id === row.id) {
          return createRow(row.desc, +val.target.value, item.unit, item.vat);
        }
        return item;
      });
    });
  };

  return (
    <TableRow className={index === productsBL ? "last_row" : ""}>
      {
        <Fragment>
          <TableCell className="col-table">
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
                  heigh: "50px",
                }}
                onChange={handleProduct}
                onBlur={handleBlur}
                defaultValue={""}
              >
                {products?.map((product, index) => (
                  <MenuItem value={product.productName} key={index}>
                    {product.productName}
                  </MenuItem>
                ))}
              </Select>
              {errors.product && touched.product ? (
                <FormHelperText error>{errors.product}</FormHelperText>
              ) : null}
            </FormControl>
          </TableCell>
          <TableCell align="right">{row ? row.unit : ""}</TableCell>
          <TableCell className="col-table" align="right">
            {row ? (
              <TextField
                defaultValue={row.qty}
                onChange={handleQuntity}
                type="number"
              />
            ) : (
              ""
            )}
          </TableCell>
          <TableCell align="right">{row ? ccyFormat(row.price) : ""}</TableCell>
          <TableCell className="col-table" align="right">
            {row ? row.vat + "%" : ""}
          </TableCell>
          <TableCell align="right">
            {row ? ccyFormat(row.productVat) : ""}
          </TableCell>
          <TableCell align="right">
            {row ? ccyFormat(row.finalPrice) : ""}
          </TableCell>
        </Fragment>
      }
    </TableRow>
  );
}
