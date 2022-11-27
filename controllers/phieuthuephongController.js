'use strict'
//import fetch from "node-fetch";
const ROOTURL = "http://localhost:8100/thuephong/";
var data = [];

let PhieuThuePhong = {

    getData: async function (request) {
        let url = ROOTURL + request;
        const response = await fetch(url);
        data = await response.json();
        return data;
    },
    pushData: async function (request, val) {

        let url = ROOTURL + request;
        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'charset': 'UTF-8'
            },
            body: JSON.stringify(val)
        });
        let result = await response.json();

        return result;
    }
}
module.exports = PhieuThuePhong;

