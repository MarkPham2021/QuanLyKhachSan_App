var express = require('express');
var router = express.Router();
const Util = require('../Until/presentProcess');
const phieuthuephongController = require('../controllers/phieuthuephongController');
const phieutraphongController = require('../controllers/phieutraphongController');
const khcnController = require('../controllers/khcnController');

router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các phiếu thuê phòng
    //phương thức request: get
    //lấy ra các record từ database
    //trả về danh sách các phiếu thuê phòng trong page phieuthuephongIndex
    let d = await phieutraphongController.getData("");
    let n = d.length;
    for (let i = 0; i < n; i++) {
        d[i].NgayThue = Util.dinhdangNgayISO(d[i].NgayThue);
        d[i].NgayTra = Util.dinhdangNgayISO(d[i].NgayTra);
        d[i].DonGiaThanhToan = Util.numberFormat.format(d[i].DonGiaThanhToan);
        d[i].ThanhTien = Util.numberFormat.format(d[i].ThanhTien);
    }
    res.render("phieutraphongIndex", { danhsach: d });

});

router.get('/create/:phieuthueid', async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: get
    //Lấy thông tin loại phòng để thiết kế select loại phòng trên form thêm mới
    //Mở form nhập thông tin
    let phieuthueid= req.params.phieuthueid;
    let response = await phieuthuephongController.getData(`detail/${phieuthueid}`);
    let _khachhangs = await khcnController.getData("");    
    let thongtinphieuthuephong = await phieutraphongController.getData(`create/${phieuthueid}`);
    let results = thongtinphieuthuephong;
    let d = response.ctphieuthuephongs;
    results[0].DonGiaCoSo = results[0].LoaiPhongGia
    results[0].LoaiPhongGia = Util.numberFormat.format(results[0].LoaiPhongGia);
    results[0].NgayThue = Util.dinhdangNgayDate(results[0].NgayThue);
    results[0].NgayTraDuKien = Util.dinhdangNgayDate(results[0].NgayTraDuKien);
    if (results[0].isActive) results[0].isActive = "Có";
    else results[0].isActive = "Không";
    if (results[0].hasForeigner){
        results[0].hasForeigner = "Có";
        results[0].HeSoGia = results[0].HeSoGiaKhachNuocNgoai;
    } 
    else{
        results[0].hasForeigner = "Không";
        results[0].HeSoGia = results[0].HeSoGiaKhachTrongNuoc;
    }    
    if(Array.isArray(d)){
        res.render("phieutraphongAdd", { phieuthue: results[0], khachs: d, khachhang: _khachhangs });
    }else
    {
        res.render("phieutraphongAdd", { phieuthue: results[0], khachs: [d], khachhang: _khachhangs });
    }
    
});
router.post('/create', async function (req, res, next) {
    //chức năng nhận lập phiếu tra phong;
    //phương thức request: post;
    //tiếp nhận dữ liệu gửi trong body request;
    //gửi request về DAOWS để tạo phiếu trả phòng
    let val = req.body;
    let response = await phieutraphongController.pushData("create", val)  ;
    let thaotac = { "ten": "Tạo mới Hóa đơn thanh toán" };
    let ketqua = response;
    res.render("phieutraphongResult", { thaotac, ketqua });

});

router.get('/detail/:id', async function (req, res, next) {
    //chức năng trả về chi tiết 1 phiếu thuê phòng
    //phương thức request: get
    //tiếp nhận id của record trong url
    //lấy thông tin phiếu thuê phòng từ table PhieuThuePhong left join Phong left join LoaiPhong; chi tiết phiếu thuê phòng từ CTPhieuThuePhong left join KhachHangCaNhan;
    //Xử lý dữ liệu và trả về trang phieuthuephongDetail.
    let id = req.params.id;
    let response = await phieutraphongController.getData(`detail/${id}`);    
    let results = response._phieuthuephongs;
    let d = response._ctptps;
    let phieutras = response._phieutraphongs;
    results[0].DonGiaCoSo = results[0].LoaiPhongGia;
    results[0].LoaiPhongGia = Util.numberFormat.format(results[0].LoaiPhongGia);
    results[0].NgayThue = Util.dinhdangNgayDate(results[0].NgayThue);
    results[0].NgayTraDuKien = Util.dinhdangNgayDate(results[0].NgayTraDuKien);
    phieutras[0].NgayTra = Util.dinhdangNgayDate(phieutras[0].NgayTra);
    phieutras[0].DonGiaThanhToan = Util.numberFormat.format(phieutras[0].DonGiaThanhToan);
    phieutras[0].ThanhTien = Util.numberFormat.format(phieutras[0].ThanhTien);
    if (results[0].isActive) results[0].isActive = "Có";
    else results[0].isActive = "Không";
    if (results[0].hasForeigner) {
        results[0].hasForeigner = "Có";
        results[0].HeSoGia = results[0].HeSoGiaKhachNuocNgoai;
    }
    else {
        results[0].hasForeigner = "Không";
        results[0].HeSoGia = results[0].HeSoGiaKhachTrongNuoc;
    }
    console.log({ phieuthue: results[0], khachs: d, phieutra: phieutras[0] });
    res.render("phieutraphongDetail", { phieuthue: results[0], khachs: d, phieutra: phieutras[0] });
    
});
router.get('/hoadon/:id', async function (req, res, next) {
    //chức năng trả về chi tiết 1 phiếu thuê phòng
    //phương thức request: get
    //tiếp nhận id của record trong url
    //lấy thông tin phiếu thuê phòng từ table PhieuThuePhong left join Phong left join LoaiPhong; chi tiết phiếu thuê phòng từ CTPhieuThuePhong left join KhachHangCaNhan;
    //Xử lý dữ liệu và trả về trang phieuthuephongDetail.
    let id = req.params.id;
    let response = await phieutraphongController.getData(`detail/${id}`);    
    let phieutras = response._phieutraphongs;
    
    phieutras[0].NgayTra = Util.dinhdangNgayDate(phieutras[0].NgayTra);
    phieutras[0].DonGiaThanhToan = Util.numberFormat.format(phieutras[0].DonGiaThanhToan);
    phieutras[0].ThanhTien = Util.numberFormat.format(phieutras[0].ThanhTien);
    res.render("inHoaDon", { phieutra: phieutras[0] });

});
router.get('/delete/:id', async function (req, res, next) {
    //chức năng mở form để xóa phieutraphong  
    //phương thức request: get
    
    let id = req.params.id;
    let response = await phieutraphongController.getData(`detail/${id}`);
    let results = response._phieuthuephongs;
    let d = response._ctptps;
    let phieutras = response._phieutraphongs;
    results[0].DonGiaCoSo = results[0].LoaiPhongGia;
    results[0].LoaiPhongGia = Util.numberFormat.format(results[0].LoaiPhongGia);
    results[0].NgayThue = Util.dinhdangNgayDate(results[0].NgayThue);
    results[0].NgayTraDuKien = Util.dinhdangNgayDate(results[0].NgayTraDuKien);
    phieutras[0].NgayTra = Util.dinhdangNgayDate(phieutras[0].NgayTra);
    phieutras[0].DonGiaThanhToan = Util.numberFormat.format(phieutras[0].DonGiaThanhToan);
    phieutras[0].ThanhTien = Util.numberFormat.format(phieutras[0].ThanhTien);
    if (results[0].isActive) results[0].isActive = "Có";
    else results[0].isActive = "Không";
    if (results[0].hasForeigner) {
        results[0].hasForeigner = "Có";
        results[0].HeSoGia = results[0].HeSoGiaKhachNuocNgoai;
    }
    else {
        results[0].hasForeigner = "Không";
        results[0].HeSoGia = results[0].HeSoGiaKhachTrongNuoc;
    }

    res.render("phieutraphongDelete", { phieuthue: results[0], khachs: d, phieutra: phieutras[0] });
});
router.post('/delete/:id', async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa  các record CTPhieuThuePhong => xóa record PhieuThue Phong; release phong;
    //trả về thông báo json đã xóa
    let id = req.params.id;
    let val = req.body;
    let response = await phieutraphongController.pushData(`delete/${id}`, val);

    let thaotac = { "ten": "Xóa Hóa đơn thanh toán" };
    let ketqua = response;
    res.render("phieutraphongResult", { thaotac, ketqua });

});
module.exports = router;