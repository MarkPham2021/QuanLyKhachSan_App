'use strict'
//import fetch from "node-fetch";
const ROOTURL = "http://localhost:8100/baocao/";

let BaoCao = {

    taoBaoCaoDoanhThu: async function (val) {
        let request ='create';
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
    },
    taoBaoCaoMatDoSuDung: async function (val) {
        let request = 'create';
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
module.exports = BaoCao;

