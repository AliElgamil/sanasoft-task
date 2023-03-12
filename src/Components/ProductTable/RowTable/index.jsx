import React, { Fragment, useContext, useEffect, useReducer } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import useSWR from "swr";
import {
  Button,
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

const reducer = (state, action) => {
  switch (action.type) {
    case "incremented_quantity":
      return {
        quantity: state.quantity + 1,
        vat: state.vat,
      };
    case "decremented_quantity":
      const quantity = state.quantity - 1;
      return {
        quantity: quantity ? quantity : 1,
        vat: state.vat,
      };
    case "new_value":
      return {
        quantity: +action.newQuantity,
        vat: state.vat,
      };
    case "incremented_vat":
      const vatIncr = state.vat + 1;
      return {
        vat: vatIncr <= 14 ? vatIncr : 14,
        quantity: state.quantity,
      };
    case "decremented_vat":
      const vatDecr = state.vat - 1;
      return {
        vat: vatDecr >= 0 ? vatDecr : 0,
        quantity: state.quantity,
      };
  }
};

export default function RowTable({
  row,
  ccyFormat,
  setProductBay,
  index,
  productsBL,
}) {
  const { data: products } = useSWR("/data/products.json", fetcher);
  const { setFieldValue, handleBlur, errors, touched } =
    useContext(FormContext);
  const [state, dispatch] = useReducer(reducer, { quantity: 1, vat: 14 });

  const handleProduct = (val) => {
    const product = products.filter(
      (product) => val.target.value === product.productName
    )[0];
    setProductBay((PrevState) => {
      const nextState = PrevState.map((pro, ind) => {
        if (ind === index) {
          return createRow(
            val.target.value,
            state.quantity,
            product.price,
            state.vat
          );
        }
        return pro;
      });

      setFieldValue("products", nextState);
      return nextState;
    });
  };

  useEffect(() => {
    const described = setTimeout(() => {
      setProductBay((prevState) => {
        const newState = prevState.map((item, ind) => {
          if (item && ind === index) {
            return createRow(row.desc, state.quantity, item.unit, state.vat);
          }
          return item;
        });

        setFieldValue("products", newState);
        return newState;
      });
    }, 100);

    return () => clearTimeout(described);
  }, [state.quantity, state.vat]);

  const handleQuantity = (val) => {
    const value = val.target.value;
    dispatch({ type: "new_value", newQuantity: value });
  };

  return (
    <Fragment>
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
                  name="product"
                  labelId="country"
                  label="Country"
                  sx={{
                    width: "200px",
                    heigh: "50px",
                  }}
                  onChange={handleProduct}
                  value={row.desc}
                >
                  {products?.map((product, index) => (
                    <MenuItem value={product.productName} key={index}>
                      {product.productName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </TableCell>
            <TableCell align="right">{row ? row.unit : ""}</TableCell>
            <TableCell className="col-table" align="right">
              <div className="flex">
                <Button
                  type="button"
                  onClick={() => dispatch({ type: "decremented_quantity" })}
                >
                  -
                </Button>
                <TextField
                  value={state.quantity}
                  onChange={handleQuantity}
                  onBlur={handleBlur}
                />
                <Button
                  type="button"
                  onClick={() => dispatch({ type: "incremented_quantity" })}
                >
                  +
                </Button>
              </div>
            </TableCell>
            <TableCell align="right">
              {row ? ccyFormat(row.price) : ""}
            </TableCell>
            <TableCell className="col-table" align="right">
              <div className="flex">
                <Button
                  type="button"
                  onClick={() => dispatch({ type: "decremented_vat" })}
                >
                  -
                </Button>
                <span>{state.vat}%</span>
                <Button
                  type="button"
                  onClick={() => dispatch({ type: "incremented_vat" })}
                >
                  +
                </Button>
              </div>
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

      {/* {errors.products ? (
        errors.products.length > index + 1 && touched.products ? (
          <TableRow>
            <TableCell colSpan={7} className="border-none">
              <FormHelperText error className="table_text-error">
                {errors.products[index][keys[0]]}
              </FormHelperText>
            </TableCell>
          </TableRow>
        ) : null
      ) : null} */}
    </Fragment>
  );
}
