import {
  AppBar,
  Box,
  Button,
  Container,
  FormControl,
  Typography,
} from "@mui/material";
import "./App.css";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Information from "./Components/Information";
import ProductTable from "./Components/ProductTable";
import { createContext, useContext } from "react";

// console.log(new Date());
export const FormContext = createContext();

const SignupSchema = Yup.object().shape({
  userId: Yup.string().required("Should be chose customer"),
  date: Yup.date().max(new Date()).required("Required"),
  country: Yup.string().required("Should chose country"),
  city: Yup.string().required("Should be chose city"),
  address: Yup.string()
    .min(10, "Address too Short!")
    .max(50, "Address too Long!")
    .required("Should Enter a valid address"),
  product: Yup.string().required("Should be chose Product"),
  quantity: Yup.number().moreThan(0, "The quantity must be greater than zero."),
  vat: Yup.number()
    .moreThan(0, "The vat must be grater than or equal to zero.")
    .lessThan(15, "The vat must be less than or equal to 14"),
});

function App() {
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
            product: "",
            quantity: 1,
            vat: 0,
          }}
          validationSchema={SignupSchema}
          onSubmit={(values) => {
            // same shape as initial values
            console.log("submit");
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
                <Information
                  errors={errors}
                  handleBlur={handleBlur}
                  handleChange={handleChange}
                  touched={touched}
                  setFieldValue={setFieldValue}
                />
                {/* Product Table Component */}
                <ProductTable />

                {/* Button Submit */}
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    margin: "15px auto",
                    display: "block",
                  }}
                >
                  Submit
                </Button>
              </Form>
            </FormContext.Provider>
          )}
        </Formik>
      </Container>
    </Box>
  );
}

export default App;
