import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Container,
  FormControl,
  Typography,
} from "@mui/material";
import "./App.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Information from "./Components/Information";
import ProductTable from "./Components/ProductTable";
import { createContext, useContext, useState } from "react";

export const FormContext = createContext();

const SignupSchema = Yup.object().shape({
  userId: Yup.string().required("Should be chose customer"),
  date: Yup.date().max(new Date()).required("Required"),
  country: Yup.string().required("Should chose country"),
  city: Yup.string().required("Should be chose city"),
  address: Yup.string()
    .min(7, "Address too Short!")
    .max(50, "Address too Long!")
    .required("Should Enter a valid address"),
  products: Yup.array()
    .of(
      Yup.object({
        id: Yup.string(),
        desc: Yup.string().required("Should be chosen product"),
        qty: Yup.number().moreThan(
          0,
          "Should be chosen quantity greater than Zero"
        ),
        unit: Yup.number(),
        price: Yup.number(),
        vat: Yup.number().lessThan(15).required("Should be chosen vat"),
        productVat: Yup.number(),
        finalPrice: Yup.number(),
      })
    )
    .required("Should be chose Product"),
});

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

function App() {
  const [productsBay, setProductBay] = useState([product]);

  return (
    <Box className="app" paddingTop={"80px"}>
      <AppBar>
        <Container>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1 }}
            paddingTop={2}
            paddingBottom={2}
          >
            SanaSoft
          </Typography>
        </Container>
      </AppBar>

      <Container>
        <Formik
          initialValues={{
            userId: "",
            date: Date.now(),
            country: "",
            city: "",
            address: "",
            products: [],
            subtotal: 0,
            totalVat: 0,
            total: 0,
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log(values);
          }}
        >
          {({ errors, touched, handleBlur, handleChange, setFieldValue }) => (
            <FormContext.Provider
              value={{
                errors,
                handleBlur,
                handleChange,
                touched,
                setFieldValue,
              }}
            >
              <Form>
                {/* Information Component */}
                <Information />
                {/* Product Table Component */}
                <ProductTable
                  productsBay={productsBay}
                  setProductBay={setProductBay}
                />

                {/* Button Submit */}
                <ButtonGroup className="group_btn">
                  <Button
                    type="button"
                    variant="contained"
                    onClick={
                      (() => setProductBay([{ ...product }]),
                      setFieldValue("product", [{ ...product }]))
                    }
                  >
                    Reset Products
                  </Button>
                  <Button type="submit" variant="contained">
                    Submit
                  </Button>
                </ButtonGroup>
              </Form>
            </FormContext.Provider>
          )}
        </Formik>
      </Container>
    </Box>
  );
}

export default App;
