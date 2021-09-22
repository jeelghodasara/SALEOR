import { useAuth } from "@saleor/sdk";
import * as React from "react";
import { useIntl } from "react-intl";

import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { useMutation} from "react-apollo";

import { demoMode } from "@temp/constants";
import { commonMessages } from "@temp/intl";


import { SocialCreateToken,SocialTokenVerifyMutation } from "./queries";


import { Button, Form, TextField } from "..";

import "./scss/index.scss";

interface ILoginForm {
  hide?: () => void;
}

const LoginForm: React.FC<ILoginForm> = ({ hide }) => {
  const { signIn } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState(null);
  const [socialcreatetoken]=useMutation(SocialCreateToken);
  const [socialtokenverifymutation]=useMutation(SocialTokenVerifyMutation);

  const handleOnSubmit = async (evt, { email, password }) => {
    evt.preventDefault();
    setLoading(true);
    const { data, dataError } = await signIn(email, password);
    console.log("MAINDATA::",data)
    setLoading(false);
    if (dataError?.error) {
      setErrors(dataError.error);
    } else if (data && hide) {
      setErrors(null);
      hide();
    }
  };


  const responseGoogle= async (res)=>{
    // const res = await socialMediaAuth(provider)

    const email=res?.profileObj?.email;
    const googleId=res?.googleId;

    setLoading(true);

    const data=await socialcreatetoken({variables:{
        email,
        googleId
    }
    })
    const token=data?.data?.socialCreateToken?.token;
    console.log("data::::",data?.data?.socialCreateToken?.token);
    const user=await socialtokenverifymutation({variables:{
      token
    }})

    setLoading(false);

    if(user?.data?.tokenVerify?.payload?.type=="access"){
      hide();
    }

    console.log("USER::",user?.data?.tokenVerify?.payload?.type);


    console.log("response::::",res)
    console.log("email::",res?.profileObj?.email)
    console.log("googleId",res?.googleId)
  }

  const responseFacebook = (response) => {
    console.log("Facebook res-----",response);
  }



  const formData = demoMode
    ? {
        email: "admin@example.com",
        password: "admin",
      }
    : {};

  const intl = useIntl();

  return (
    <div className="login-form">
      <Form data={formData} errors={errors || []} onSubmit={handleOnSubmit}>
        <TextField
          name="email"
          autoComplete="email"
          label={intl.formatMessage(commonMessages.eMail)}
          type="email"
          required
        />
        <TextField
          name="password"
          autoComplete="password"
          label={intl.formatMessage(commonMessages.password)}
          type="password"
          required
        />
        <div className="login-form__button">
          <Button
            testingContext="submit"
            type="submit"
            {...(loading && { disabled: true })}
          >
            {loading
              ? intl.formatMessage(commonMessages.loading)
              : intl.formatMessage({ defaultMessage: "Sign in" })}
          </Button>
        </div>

  
        <GoogleLogin
          clientId={"557803803294-6o1i6bl7g2srv47ki6llq58ukajvvca8.apps.googleusercontent.com"}
          buttonText="Login"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={'single_host_origin'}
        />

        <FacebookLogin
          appId="1088597931155576"
          // autoLoad={true}
          fields="name,email,picture"
          // onClick={componentClicked}
          callback={responseFacebook}
          // cssClass="my-facebook-button-class"
          textButton="Login"
          icon="fa-facebook" 
        />


      </Form>
    </div>
  );
};

export default LoginForm;
