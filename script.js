const normal =
"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

const custom =
"Q8AqVN9xKeD3L2sPmRu7TcWy1FgHjUkXbYo0lGiIhBnOpC4dES6vJZf5rMtaz+/";

/* ---------------- LOGIN ---------------- */
async function login(){

    const password = document.getElementById("pass").value;

    const res = await fetch(API_URL + "/login", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ password })
    });

    const data = await res.json();

    if(!data.success){
        document.getElementById("status").innerText = "ACCESS DENIED ❌";
        return;
    }

    SESSION_TOKEN = data.token;
    document.getElementById("status").innerText = "ACCESS GRANTED ✔";
}

/* ---------------- VERIFY ---------------- */
async function verify(){

    if(!SESSION_TOKEN) return false;

    const res = await fetch(API_URL + "/verify", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({ token: SESSION_TOKEN })
    });

    const data = await res.json();
    return data.success;
}

/* ---------------- CIPHER FUNCTIONS ---------------- */

function reverse(str){
    return str.split("").reverse().join("");
}

function atbash(str){
    let out="";
    for(let c of str){
        if(c>='A'&&c<='Z'){
            out+=String.fromCharCode(90-(c.charCodeAt(0)-65));
        } else if(c>='a'&&c<='z'){
            out+=String.fromCharCode(122-(c.charCodeAt(0)-97));
        } else {
            out+=c;
        }
    }
    return out;
}

function caesar(str,shift){
    let out="";
    for(let c of str){
        if(c>='A'&&c<='Z'){
            let x=(c.charCodeAt(0)-65+shift+26)%26;
            out+=String.fromCharCode(x+65);
        } else if(c>='a'&&c<='z'){
            let x=(c.charCodeAt(0)-97+shift+26)%26;
            out+=String.fromCharCode(x+97);
        } else {
            out+=c;
        }
    }
    return out;
}

function swapPairs(str){
    let arr=str.split("");
    for(let i=0;i<arr.length-1;i+=2){
        [arr[i],arr[i+1]]=[arr[i+1],arr[i]];
    }
    return arr.join("");
}

function replaceAlphabet(str,from,to){
    let out="";
    for(let c of str){
        let i=from.indexOf(c);
        out += (i === -1 ? c : to[i]);
    }
    return out;
}

/* ---------------- ENCODE ---------------- */
async function encode(){

    if(!await verify()){
        document.getElementById("output").value = "NOT AUTHORIZED ❌";
        return;
    }

    let text = document.getElementById("input").value;

    text = reverse(text);
    text = atbash(text);
    text = caesar(text,7);
    text = swapPairs(text);
    text = btoa(unescape(encodeURIComponent(text)));
    text = replaceAlphabet(text, normal, custom);
    text = reverse(text);

    document.getElementById("output").value = text;
}

/* ---------------- DECODE ---------------- */
async function decode(){

    if(!await verify()){
        document.getElementById("output").value = "NOT AUTHORIZED ❌";
        return;
    }

    try{

        let text = document.getElementById("input").value;

        text = reverse(text);
        text = replaceAlphabet(text, custom, normal);
        text = decodeURIComponent(escape(atob(text)));
        text = swapPairs(text);
        text = caesar(text,-7);
        text = atbash(text);
        text = reverse(text);

        document.getElementById("output").value = text;

    } catch(e){
        document.getElementById("output").value = "Invalid encoded text.";
    }
}
