var express = require('express');
var router = express.Router();
const Util = require('../Until/presentProcess');
const baocaoController = require('../controllers/baocaoController');
router.get('/', async function (req, res, next) {
    //chức năng render trang tao bao cao
    
    res.render("baocaoIndex");

});

router.post('/create', async function (req, res, next) {
    //chức năng nhận thông tin báo cáo cần tạo từ req.body;
    //phương thức request: post;
    //gởi request đến DAOWS
    //render dữ liệu nhận được lên trang báo cáo cần tạo   
    let thang =new Date(req.body.Ngaybatdau).getMonth() +1;
    let nam =new Date(req.body.Ngayketthuc).getFullYear();
    let kybaocao = { Ngaybatdau: req.body.Ngaybatdau, Ngayketthuc: req.body.Ngayketthuc, Thang: thang, Nam: nam }    
    let val = req.body;
    let loaibaocao = req.body.LoaiBaoCao;
    if(loaibaocao==1){
        let doanhthu = await baocaoController.taoBaoCaoDoanhThu(val);
        //res.json(doanhthu1);
        let tongdoanhthu = 0, tongsoloaiphong = doanhthu.length;
        for(let i =0; i<doanhthu.length; i++){
            tongdoanhthu+=doanhthu[i].LoaiPhongDoanhThu;                         
            doanhthu[i].TH_LoaiPhongDoanhThu = Util.numberFormat.format(doanhthu[i].LoaiPhongDoanhThu);
        }
        for (let i = 0; i < doanhthu.length; i++) {
            doanhthu[i].TyLeDoanhThu= (doanhthu[i].LoaiPhongDoanhThu/tongdoanhthu*100).toFixed(2);            
        }
        tongdoanhthu = Util.numberFormat.format(tongdoanhthu);
        let sotong = {TongDoanhThu: tongdoanhthu, TongLoaiPhong:tongsoloaiphong};
        res.render('baocaoDoanhThu',{baocao: kybaocao, data: doanhthu, sotong:sotong });
    }else if(loaibaocao==2){
        let ngaythue = await baocaoController.taoBaoCaoMatDoSuDung(val);
        //res.json(ngaythue);
        let tongngaythue = 0, tongsophong = ngaythue.length;
        for (let i = 0; i < ngaythue.length; i++) {
            tongngaythue += ngaythue[i].SoNgayThue;
            ngaythue[i].TH_SoNgayThue = (ngaythue[i].SoNgayThue);
        }
        for (let i = 0; i < ngaythue.length; i++) {
            ngaythue[i].TyLe = (ngaythue[i].SoNgayThue / tongngaythue * 100).toFixed(2);
        }
        tongngaythue = (tongngaythue);
        let sotong = { TongSoPhong: tongsophong, TongNgayThue: tongngaythue };
        res.render('baocaoMatDoSuDungPhong', { baocao: kybaocao, data: ngaythue, sotong: sotong });
    }    
});

module.exports = router;