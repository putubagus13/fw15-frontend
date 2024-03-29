import { BsCheckCircleFill } from "react-icons/bs";
import {Link, useNavigate} from "react-router-dom";
import {SiArtixlinux} from "react-icons/si";
import React from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import http from "../helper/http";
import {MdError} from "react-icons/md";
import propTypes from "prop-types";
import LeftsideAuth from "../components/LeftsideAuth";
import FooterAuth from "../components/FooterAuth";

const validationSchema = Yup.object({
  email: Yup.string().email("Email is invalid").required("Email is invalid")
});

const FormRegister = (
  {values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting, 
    errorMessage, 
    successMessage})=>{
  return(
    <form id="form" onSubmit={handleSubmit}>
      {errorMessage && (<div className="flex flex-row justify-center alert alert-error shadow-lg text-white text-lg mb-3"><MdError size={30}/>{errorMessage}</div>)}
      {successMessage && (<div className="flex flex-row justify-center alert alert-info shadow-lg text-white text-lg mb-3"><BsCheckCircleFill size={30}/>{successMessage}</div>)}
      <div className="form-control flex flex-col">
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          className= {`input input-bordered ${errors.email && touched.email && "input-error"} text-secondary h-14 w-full border-2 rounded-2xl px-5`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values.email}
        />
        {errors.email && touched.email && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.email}</span>
          </label>)
        }
      </div>
      <button disabled={isSubmitting} className="my-2 h-14 w-full btn btn-primary rounded-2xl shadow-lg" type="submit" >Send</button>
    </form>
  );
};
FormRegister.propTypes = {
  values: propTypes.objectOf(propTypes.string),
  errors: propTypes.objectOf(propTypes.string), 
  touched: propTypes.objectOf(propTypes.bool), 
  handleChange: propTypes.func,
  handleBlur: propTypes.func,
  handleSubmit: propTypes.func,  
  isSubmitting: propTypes.bool,
  errorMessage: propTypes.string, 
  successMessage: propTypes.string
};

function ForgotPassword(){
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const requestForgotPass = async(values, {setSubmitting, setErrors})=>{
    setErrorMessage("");
    setSuccessMessage("");
    try {
      const body = new URLSearchParams(values).toString();
      const {data} = await http().post("/auth/forgotRequest", body);
      console.log(data);
      setSuccessMessage(data.message);
      setSubmitting(false);
      navigate("/ResetPassword");

    } catch (error) {
      const message = error?.response?.data?.message;
      if(message){
        if(error?.response?.data?.results){
          setErrors({
            email: error.response.data.results.filter(item => item.param === "email")[0].message,
          });
        }else{
          setErrorMessage(message);
        }
      }
    }
  };
  React.useEffect(()=>{
    console.log(errorMessage);
  },[errorMessage]);
    

  return(
    <div>
      <main className="flex h-[1024px]">
        <LeftsideAuth />
        <div className="px-[30px] w-full md:flex-initial md:pt-[214px] md:w-[516px] md:px-[100px]">
          <Link to="/">
            <div className="flex items-center pb-[57px]">
              <SiArtixlinux size={50} className="text-primary filter blur-[2.8px] pr-1"/>
              <div className="text-primary text-[24px] font-bold" >TIX</div><div className="text-accent text-[24px] font-bold" >Event</div>
            </div></Link>
          <h1 className="text-[24px] font-bold text-secondary" >Forgot Password</h1>
          <p className="flex pb-6 pt-3 text-secondary">You’ll get mail soon on your email</p>
          <Formik
            initialValues={{ email: "" }}
            validationSchema = {validationSchema}
            onSubmit={requestForgotPass}
          >
            {(props) => (
              <FormRegister {...props} errorMessage={errorMessage} successMessage={successMessage}/>
            )}
          </Formik>
        </div>
      </main>
      <FooterAuth />
    </div>
  );
}

export default ForgotPassword;