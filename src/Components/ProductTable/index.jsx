import { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import RowTable from "./RowTable";

function ccyFormat(num) {
  return `${num.toFixed(2)}`;
}
function subtotal(items) {
  return items.map(({ price }) => price).reduce((sum, i) => sum + i, 0);
}
const invoiceSubtotal = subtotal([]);
const invoiceTaxes = 14 * invoiceSubtotal;
const invoiceTotal = invoiceTaxes + invoiceSubtotal;

export default function ProductTable() {
  const [productsBay, setProductBay] = useState([null]);

  const addRow = () => setProductBay((val) => [...val, null]);
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
              <span onClick={addRow}>add</span>
            </TableCell>
          </TableRow>

          <TableRow>
            <TableCell rowSpan={3} colSpan={4} />
            <TableCell colSpan={2}>Subtotal</TableCell>
            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Tax</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
}
