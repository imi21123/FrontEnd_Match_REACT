import {IMAGES} from "../../constants/images";
import React, {useEffect} from "react";
//import {BrowserRouter as Router, Outlet, Route, Routes} from 'react-router-dom';
import axios from "axios";
import * as process from "process";

const baseUrl = 'https://www.match-api-server.com';


const HomeScreen = ()=> { //여기로 리다이렉트
    const REST_API_KEY= '8dfa7db4e6e6e29a50acefe5f2016a73'; //REST API KEY
    const REDIRECT_URI = 'https://localhost:3000/auth/kakao'; //Redirect URI  https://www.match-api-server.com/auth/kakao    https://localhost:3000/auth/kakao
    const SECRET_KEY = 'cs8OKkZActEzwEMMXs74KY7J9h2V3qKb';

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get("code");
        //const url = window.location.href;
        //const params = new URLSearchParams(url.split("?")[1]);
        //const code = params.get("code");

        if (code) {
            console.log('인가코드 : '+code);
            getKakaoTokenHandler(code);
        }

    }, []);

    //3) 카카오 서버에 access token 발급 요청
    const getKakaoTokenHandler = async (code: string) => {
        try {
            //grant_type은 authorization_code , client_id는 rest api 앱 키 ,  redirect_uri은 인가코드가 리다이렉트된 URI , code는 인가코드
            const data = {
                grant_type: "authorization_code",
                client_id: REST_API_KEY,
                redirect_uri: REDIRECT_URI,
                code: code,
                client_secret: SECRET_KEY,
            };

            const params = new URLSearchParams(data).toString();
            console.log('카카오 서버에 전달할 params : '+params); //여기 까지 정상

            // 토큰 발급 REST API
            const response = await axios.post(
                `https://kauth.kakao.com/oauth/token`,
                params, // URL 쿼리 파라미터로 넘길 데이터
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    },
                }
            );

            // 서버에 access token 전달
            console.log('서버에 전달할 access token : '+response.data.access_token);
            sendKakaoTokenToServer(response.data.access_token);

        } catch (e) {
            console.error(e);
        }
    };

    const sendKakaoTokenToServer = async (token: string) =>{
        console.log('access token : '+token);
        //console.log(' post 요청 url '+baseUrl + '/auth/kakao');
        const data = {
            accessToken: token,
        };
        const body = new URLSearchParams(data);
        //const body = new URLSearchParams(data).toString();

        axios.post(
            `https://www.match-api-server.com/auth/kakao`,
            body,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )
            .then(function (response) {
                console.log("post 성공", response);
                // response
            })
            .catch(function (error) {
                // 오류발생시 실행
                console.log("post 실패", error);
            })
            .then(function () {
                // 항상 실행
                //console.log("데이터 요청 완료");
            });

    };


    return(
        <>
            <div>
                홈 스크린
            </div>
        </>
    )
}

export default HomeScreen
