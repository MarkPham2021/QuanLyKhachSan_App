function getConfirmation_Delete() {
    var retVal = confirm("Bạn chắc chắn muốn xóa?");
    if (retVal == true) {
        document.getElementById("btn_Xoa").setAttribute("type", "Submit");
    }
    else if (retVal == false) {
        alert("Bạn đã hủy yêu cầu xóa!");
    }
}
function npreVNForm(num, s) {
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
