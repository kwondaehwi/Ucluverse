import axios from 'axios';
import React, { ReactElement } from 'react';
import { useEffect } from 'react';
import googleImg from '../../Assets/구글로그인.png';
import singInImg from '../../Assets/로그인.png';
import { ToastContainer, toast } from 'react-toastify';
import {
  LoginButtonContainer,
  LoginContentContainer,
  LoginDetailSpan,
  LoginMainContainer,
} from './style';

declare global {
  interface Window {
    gapi: any;
  }
}

const LoginMain = () => {
  const status = 'notLogin';
  const notify = () =>
    toast('아주메일로 로그인 해주세요', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  const gapi = window.gapi;
  const init = () => {
    gapi.load('auth2', () => {
      gapi.auth2.init({
        client_id:
          '280889310353-qgqus8gdj4ir1t5c4qfghevolbj3d0th.apps.googleusercontent.com',
      });
      const options = new gapi.auth2.SigninOptionsBuilder();
      options.setPrompt('select_account');
      options.setScope('email profile');
      gapi.auth2
        .getAuthInstance()
        .attachClickHandler(
          'GgCustomLogin',
          options,
          onSignIn,
          onSignInFailure,
        );
    });
  };
  const onSignIn = async (googleUser: any) => {
    const profile = googleUser.getBasicProfile();
    const email = profile.getEmail();
    const isAjouMail = email.includes('@ajou.ac.kr');
    if (isAjouMail) {
      axios
        .get(
          `http://ucluverse-lb-285634398.ap-northeast-2.elb.amazonaws.com/auth/login?email=${email}`,
        )
        .then((res) => {
          console.log(res.data);
          if (res.data.status === 1) {
            window.location.href = `/login/info?email=${email}`;
          } else {
            window.location.href = '/';
          }
        });
    } else {
      notify();
    }
  };
  const onSignInFailure = (t: any) => {
    console.log(t);
  };
  useEffect(() => {
    init();
  }, []);
  return (
    <LoginMainContainer>
      <LoginContentContainer>
        <img src={singInImg} style={{ marginBottom: '40px' }}></img>
        <LoginDetailSpan>유클러버스 회원가입은</LoginDetailSpan>
        <LoginDetailSpan>구글 아이디 연동을 통해 진행됩니다.</LoginDetailSpan>
        <LoginDetailSpan>아주메일로 로그인을 진행해주세요</LoginDetailSpan>
        <LoginButtonContainer>
          <button id="GgCustomLogin">
            <img src={googleImg} width="304px" height="45px" />
          </button>
        </LoginButtonContainer>
      </LoginContentContainer>
    </LoginMainContainer>
  );
};
export default LoginMain;
