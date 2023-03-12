import { useContext, useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RowTable from "./RowTable";
import { FormContext } from "../../App";
import { FormHelperText } from "@mui/material";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}

const product = {
  id: crypto.randomUUID(),
  desc: "",
  qty: 1,
  unit: 0,
  price: 0,
  vat: 14,
  productVat: 0,
  finalPrice: 0,
};

export default function ProductTable({ productsBay, setProductBay }) {
  const { setFieldValue, errors } = useContext(FormContext);
  const [productError, setProductError] = useState([]);

  const addRow = () =>
    setProductBay((val) => {
      const nextState = [...val, { ...product }];
      setFieldValue("products", nextState);
      return nextState;
    });
  const subtotal = productsBay.reduce((a, pro) => pro.finalPrice + a, 0);
  const totalVat = productsBay.reduce((a, pro) => pro.productVat + a, 0);
  const total = subtotal + totalVat;

  useEffect(() => {
    setFieldValue("subtotal", subtotal);
    setFieldValue("totalVat", totalVat);
    setFieldValue("total", total);
  }, [productsBay]);

  useEffect(() => {
    // console.log(errors.products.length);
    if (errors.products) setProductError(errors.products.filter((pro) => pro));
    else setProductError([]);
  }, [errors.products]);

  console.log(errors);
  console.log(productError);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="spanning table">
        <TableHead>
          <TableRow>
            <TableCell>Products</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell align="right">Qty.</TableCell>
            <TableCell align="right">Total Amount</TableCell>
            <TableCell align="right">Vat Product</TableCell>
            <TableCell align="right">Vat</TableCell>
            <TableCell align="right">Final Price</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {productsBay.map((row, index) => (
            <RowTable
              row={row}
              key={index}
              ccyFormat={ccyFormat}
              setProductBay={setProductBay}
              index={index}
              productsBL={productsBay.length - 1}
            />
          ))}

          <TableRow>
            <TableCell rowSpan={1} colSpan={7} className="text-right">
              <hr />
              <span onClick={addRow}>Add new product</span>
            </TableCell>
          </TableRow>

          {productError.length ? (
            <TableRow>
              <TableCell colSpan={7} className="border-none">
                <FormHelperText error className="table_text-error">
                  {Object.values(productError[0])[0]}
                </FormHelperText>
              </TableCell>
            </TableRow>
          ) : null}

          <TableRow>
            <TableCell rowSpan={3} colSpan={4} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">${subtotal}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Tax</TableCell>
            <TableCell align="right">${totalVat}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">${total}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
