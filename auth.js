//CODE JS CỦA TRANG ĐĂNG NHẬP VÀ ĐĂNG KÍ
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-analytics.js";
import {getAuth,signInWithPopup,createUserWithEmailAndPassword,signInWithEmailAndPassword,GoogleAuthProvider} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js"

const auth = getAuth();
const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: "select_account" });
let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let userName = document.getElementById("userName");
let userEmail = document.getElementById("userEmail");
let userPassword = document.getElementById("userPassword");
let submit1 = document.getElementById("submit1");
let submit2 = document.getElementById("submit2"); 
let ggSignUp = document.getElementById("ggSignUp")
let ggLogin  = document.getElementById("ggLogin")

submit1.addEventListener("submit",(e)=>{
    e.preventDefault()
    createUserWithEmailAndPassword(auth,userEmail.value, userPassword.value )
    .then((userCredential)=>
    {
         const user = userCredential.user;
         alert("Succes")
         window.location.href = "index.html"
    })
    .catch((error)=>
    {   
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
        
    })
})

submit2.addEventListener("submit",(e)=>{
    e.preventDefault()
    signInWithEmailAndPassword(auth,loginEmail.value,loginPassword.value)
    .then((userCredential)=>{
        const user = userCredential.user
        alert("Succes")
        window.location.href = "index.html"
    })
    .catch((error)=>
    {
        const errorCode = error.code
        const errorMessage = error.message;
        alert(errorMessage)
       
    })
})

ggSignUp.addEventListener("click",(e)=>
{
    e.preventDefault()
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        alert("Succes")
        window.location.href = "index.html"

    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage)
    });

})

ggLogin.addEventListener("click",(e)=>
{
    e.preventDefault()
    signInWithPopup(auth, provider)
    .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        alert("Succes")
        window.location.href = "index.html"

    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.customData.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(errorMessage)
    });     
})

