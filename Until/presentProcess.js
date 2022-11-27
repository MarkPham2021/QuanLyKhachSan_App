function getConfirmation_Delete() {
    var retVal = confirm("Bạn chắc chắn muốn xóa?");
    if (retVal == true) {
        document.getElementById("btn_Xoa").setAttribute("type", "Submit");
    }
    else if (retVal == false) {
        alert("Bạn đã hủy yêu cầu xóa!");
    }
}
var npreVNForm = function npreVNForm(num, s) {
    let inum = 0;
    if (s == 0) {
        inum = num.toFixed(0);
        let chuoinguyen = inum.toString();
        let _len = chuoinguyen.length;
        let n = Math.ceil(_len / 3);
        let snd = parseInt(_len / 3);
        let kq = "";
        if (n > snd) {
            let st = _len - snd * 3;
            kq += chuoinguyen.substr(0, st);
            for (let i = 0; i < snd; i++) {
                kq += "." + chuoinguyen.substr(st, 3);
                st += 3;
            }
        }
        else {
            let st = 3;
            kq += chuoinguyen.substr(0, st);
            for (let i = 1; i < snd; i++) {
                kq += "." + chuoinguyen.substr(st, 3);
                st += 3;
            }
        }
        return kq;
    }
    else {
        inum = parseInt(num);
        let fnum = (num - inum).toFixed(s);
        let chuoile = (fnum * Math.pow(10, s)).toString();
        let chuoinguyen = inum.toString();
        let _len = chuoinguyen.length;
        let n = Math.ceil(_len / 3);
        let snd = parseInt(_len / 3);
        let kq = "";
        if (n > snd) {
            let st = _len - snd * 3;
            kq += chuoinguyen.substr(0, st);
            for (let i = 0; i < snd; i++) {
                kq += "." + chuoinguyen.substr(st, 3);
                st += 3;
            }
        }
        else {
            let st = 3;
            kq += chuoinguyen.substr(0, st);
            for (let i = 1; i < snd; i++) {
                kq += "." + chuoinguyen.substr(st, 3);
                st += 3;
            }
        }
        return kq + "," + chuoile;
    }    
}
const numberFormat = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
});
const dinhdangNgayDate = function dinhdangNgayDate(dstr){
    let d = new Date(dstr);
    let dd, mm;
    if(d.getDate().toString().length<2) dd = '0' + d.getDate().toString();
    else dd = d.getDate().toString();
    if((d.getMonth() +1).toString().length < 2) mm= '0'+(d.getMonth() +1).toString();
    else mm = (d.getMonth() +1).toString();
    return d.getFullYear() +"-"+  mm + "-"+ dd ;
}
const dinhdangNgayISO = function dinhdangNgayISO(dstr){
    let d = new Date(dstr);
    let dd, mm;
    if(d.getDate().toString().length<2) dd = '0' + d.getDate().toString();
    else dd = d.getDate().toString();
    if((d.getMonth() +1).toString().length < 2) mm= '0'+(d.getMonth() +1).toString();
    else mm = (d.getMonth() +1).toString();
    return mm +"/"+  dd + "/"+  d.getFullYear();
}
exports.npreVNForm = npreVNForm;
exports.numberFormat = numberFormat;
exports.dinhdangNgayDate = dinhdangNgayDate;
exports.dinhdangNgayISO = dinhdangNgayISO;
