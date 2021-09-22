import * as React from "react";
import { AlertManager, useAlert } from "react-alert";
import { IntlShape, useIntl } from "react-intl";


import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';

import { useMutation } from "react-apollo";
import { socialRegisterMutation } from "./queries";

import { paths } from "@paths";
import { channelSlug } from "@temp/constants";
import { commonMessages } from "@temp/intl";

import { maybe } from "../../../core/utils";
import { Button, Form, TextField } from "../..";
import { RegisterAccount } from "./gqlTypes/RegisterAccount";
import { TypedAccountRegisterMutation ,TypedSocialRegisterMutation} from "./queries";



import "./scss/index.scss";


const showSuccessNotification = (
  data: RegisterAccount,
  hide: () => void,
  alert: AlertManager,
  intl: IntlShape
) => {
  const successful = maybe(() => !data.accountRegister.errors.length);

  if (successful) {
    hide();
    alert.show(
      {
        title: data.accountRegister.requiresConfirmation
          ? intl.formatMessage({
              defaultMessage:
                "Please check your e-mail for further instructions",
            })
          : intl.formatMessage({ defaultMessage: "New user has been created" }),
      },
      { type: "success", timeout: 5000 }
    );
  }
};






const responseFacebook = (response) => {
  console.log("Facebook res-----",response);
}







const RegisterForm: React.FC<{ hide: () => void }> = ({ hide }) => {
  const alert = useAlert();
  const intl = useIntl();

  const [socialRegister]=useMutation(socialRegisterMutation);

  const responseGoogle = async (res) => {
    // const res = await socialMediaAuth(provider)
    const redirectUrl = `${location.origin}${paths.accountConfirm}`;
    const email=res?.profileObj?.email;
    const googleId=res?.googleId;
    if(email && googleId){
  
    socialRegister({variables:{
          email,
          googleId,
          redirectUrl,
          channel: channelSlug,
        }
      })

  
    }
    showSuccessNotification(res, hide, alert, intl)

   
    console.log("response::::",res)
    console.log("email::",res?.profileObj?.email)
    console.log("googleId",res?.googleId)
  }




  return (
    <TypedAccountRegisterMutation
      onCompleted={data => showSuccessNotification(data, hide, alert, intl)}
    >
      {(registerCustomer, { loading, data }) => {
        return (
          <Form
            errors={maybe(() => data.accountRegister.errors, [])}
            onSubmit={(event, { email, password }) => {
              event.preventDefault();
              const redirectUrl = `${location.origin}${paths.accountConfirm}`;
              registerCustomer({
                variables: {
                  email,
                  password,
                  redirectUrl,
                  channel: channelSlug,
                },
              });
            }}
          >
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
            <div className="login__content__button">
              <Button
                testingContext="submitRegisterFormButton"
                type="submit"
                {...(loading && { disabled: true })}
              >
                {loading
                  ? intl.formatMessage(commonMessages.loading)
                  : intl.formatMessage({ defaultMessage: "Register" })}
              </Button>
            </div>


          {/* <TypedSocialRegisterMutation
            onCompleted={data => showSuccessNotification(data, hide, alert, intl)}
          > */}

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
              icon="fa-facebook" 
              // cssClass="my-facebook-button-class"
              textButton="Login"
            />

          {/* </TypedSocialRegisterMutation> */}

          </Form>
        );
      }}
    </TypedAccountRegisterMutation>
  );
};

export default RegisterForm;
