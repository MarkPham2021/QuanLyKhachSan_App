var express = require('express');
var router = express.Router();
const chinhsachController = require('../controllers/chinhsachController');
const Util = require('../Until/presentProcess');

router.get('/',async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //lấy ra các record trong table
    //trả về danh sách các products dạng json
    let result = await chinhsachController.getData("");
    let l = result.length;
    for (let i = 0; i < l; i++) {
        result[i].TyLePhuThu = result[i].TyLePhuThu + '%';
        result[i].HeSoGiaKhachTrongNuoc = result[i].HeSoGiaKhachTrongNuoc + '%';
        result[i].HeSoGiaKhachNuocNgoai = result[i].HeSoGiaKhachNuocNgoai + '%';
        result[i].NgayHieuLuc = Util.dinhdangNgayISO(result[i].NgayHieuLuc);
        if (result[i].NgayHetHieuLuc != undefined) {
            result[i].NgayHetHieuLuc = Util.dinhdangNgayISO(result[i].NgayHetHieuLuc);
        } else {
            result[i].NgayHetHieuLuc = "31/12/2099";
        }
        if (result[i].HieuLuc) { result[i].HieuLuc = "Đang áp dụng"; }
        else { result[i].HieuLuc = "Hết hiệu lực"; }
    }
    res.render("chinhsachIndex", { danhsach: result });
    
});
router.get('/create', function (req, res, next) {
    //chức năng mở page thêm mới để nhập thông tin
    //phương thức request: get    
    //Mở form nhập thông tin
    res.render("chinhsachAdd");
});

router.post('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //gởi request lên DAOWS để tạo dữ liệu
    //trả về thông báo qua trang chinhsachResult 
    
    let val = req.body;
    let response = await chinhsachController.pushData("create", val);
    let thaotac = { "ten": "lập Chính sách mới" };
    let ketqua = response;
    res.render("chinhsachResult", { thaotac, ketqua });
    
});

router.get('/detail/:id',async function (req, res, next) {
    //chức năng trả về chi tiết 1 record
    //phương thức request: get
    //Lay du lieu tu DAOWS
    let id = req.params.id;
    let result = await chinhsachController.getData(`detail/${id}`);
    result[0].TyLePhuThu = result[0].TyLePhuThu + '%';
    result[0].HeSoGiaKhachTrongNuoc = result[0].HeSoGiaKhachTrongNuoc + '%';
    result[0].HeSoGiaKhachNuocNgoai = result[0].HeSoGiaKhachNuocNgoai + '%';
    result[0].NgayHieuLuc = Util.dinhdangNgayDate(result[0].NgayHieuLuc);
    result[0].NgayHetHieuLuc = Util.dinhdangNgayDate(result[0].NgayHetHieuLuc);
    if (result[0].HieuLuc) { result[0].TH_HieuLuc = "Đang áp dụng"; }
    else { result[0].TH_HieuLuc = "Hết hiệu lực"; }
    res.render("chinhsachDetail", { chinhsach: result[0] });

    
});

router.get('/update/:id',async function (req, res, next) {
    //chức năng mở page update để cập nhật thông tin chính sách, 
    //phương thức request: get,
    //tiếp nhận id từ url,
    //đọc dữ liệu hiện tại từ database của chính sách cần update
    //trả về page chinhsachUpdate.
    let id = req.params.id;
    let result = await chinhsachController.getData(`detail/${id}`);    
    result[0].NgayHieuLuc = Util.dinhdangNgayDate(result[0].NgayHieuLuc);
    result[0].NgayHetHieuLuc = Util.dinhdangNgayDate(result[0].NgayHetHieuLuc);
    if (result[0].HieuLuc) { result[0].TH_HieuLuc = "Đang áp dụng"; }
    else { result[0].TH_HieuLuc = "Hết hiệu lực"; }
    res.render("chinhsachUpdate", { chinhsach: result[0] });
});

router.post('/update/:id',async function (req, res, next) {
    //chức năng nhận thông tin để cập nhật thông tin chính sách trong table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request, gởi request cập nhật đến DAOWS
    //hiển thị kết quả từ DAOWS
    let id = req.params.id;    
    let val = req.body;
    let response = await chinhsachController.pushData(`update/${id}`, val);
    let thaotac = { "ten": "cập nhật nội dung Chính sách" };
    let ketqua = response;
    res.render("chinhsachResult", { thaotac, ketqua });        
});

router.get('/delete/:id',async function (req, res, next) {
    //chức năng mở page chinhsachDelete để người dùng xem thông tin phòng cần xóa
    //phương thức request: get
    //tiếp nhận id từ url.
    //gởi request đến DAOWS và hiển thị page chinhsachDelete.
    let id = req.params.id;
    let result = await chinhsachController.getData(`detail/${id}`);
    result[0].TyLePhuThu = result[0].TyLePhuThu + '%';
    result[0].HeSoGiaKhachTrongNuoc = result[0].HeSoGiaKhachTrongNuoc + '%';
    result[0].HeSoGiaKhachNuocNgoai = result[0].HeSoGiaKhachNuocNgoai + '%';
    result[0].NgayHieuLuc = Util.dinhdangNgayDate(result[0].NgayHieuLuc);
    result[0].NgayHetHieuLuc = Util.dinhdangNgayDate(result[0].NgayHetHieuLuc);
    if (result[0].HieuLuc) { result[0].HieuLuc = "Đang áp dụng"; }
    else { result[0].HieuLuc = "Hết hiệu lực"; }
    res.render("chinhsachDelete", { chinhsach: result[0] });
});
router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //gởi request xóa đến DAOWS
    //trả về kết quả xóa trong page phongResult
    let id = req.params.id;
    let val = req.body;
    let response = await chinhsachController.pushData(`delete/${id}`, val);
    let thaotac = { "ten": "xóa Chính sách" };
    let ketqua = response;
    res.render("chinhsachResult", { thaotac, ketqua });
});

module.exports = router;
