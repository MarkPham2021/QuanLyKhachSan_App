var express = require('express');
var router = express.Router();
const khcnController = require('../controllers/khcnController');
const quoctichController = require('../controllers/quoctichController');
const Util = require('../Until/presentProcess');

router.get('/',async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //lấy ra các record trong table
    //trả về danh sách các products dạng json
    let khcns = await khcnController.getData("");
    let n = khcns.length;    
    for (let i = 0; i < n; i++) {
        khcns[i].NgaySinh = Util.dinhdangNgayISO(khcns[i].NgaySinh);
        if (khcns[i].GioiTinh == 0) {
            khcns[i].GioiTinh = "Nữ";
        }
        else if (khcns[i].GioiTinh == 1) {
            khcns[i].GioiTinh = "Nam";
        }
        else if (khcns[i].GioiTinh == 2) {
            khcns[i].GioiTinh = "Khác";
        }
    }
    res.render("khcnIndex", { danhsach: khcns });
});

router.get('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: get
    //Gởi request lên DAOWS để Lấy thông tin danh sách quốc tịch -> thiết kế select quốc tịch trên form thêm mới
    //render trang khcnAdd
    let quoctichs =await quoctichController.getData("");
    res.render("khcnAdd", { quoctich: quoctichs });
    
});

router.post('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //gởi request lên DAOWS 
    //trả về thông báo kết quả.
    
    let val = req.body;    
    let result = await khcnController.pushData("create", val);    
    let thaotac = { "ten": "thêm mới khách hàng" };
    let ketqua = result;    
    res.render("khcnResult", { thaotac, ketqua });    
});

router.get('/search',async function (req, res, next) {
    //chức năng tìm kiếm
    //phương thức request: get
    //Lấy thông tin quốc tịch để thiết kế select quốc tịch trên form thêm mới
    //Mở form nhập thông tin
    let quoctichs = await quoctichController.getData("");
    res.render("khcnSearch", { quoctich: quoctichs });
});
router.post('/search',async function (req, res, next) {
    //chức năng trả về danh sách các record thỏa điều kiện tìm kiếm
    //phương thức request: post
    //lấy ra các record trong các table liên quan    
    let val = req.body;
    let d = await khcnController.pushData("search", val);
    let n = d.length;
    for (let i = 0; i < n; i++) {
        d[i].NgaySinh = Util.dinhdangNgayISO(d[i].NgaySinh);
        if (d[i].GioiTinh == 0) {
            d[i].GioiTinh = "Nữ";
        }
        else if (d[i].GioiTinh == 1) {
            d[i].GioiTinh = "Nam";
        }
        else if (d[i].GioiTinh == 2) {
            d[i].GioiTinh = "Khác";
        }
    }
    res.render("khcnSearchResults", { danhsach: d });
});
router.get('/detail/:id',async function (req, res, next) {
    //chức năng xem thông tin chi tiết một khách hàng, không cho phép sửa
    //phương thức request: get
    //gởi request đến DAOWS
    //render trang khcnDetail để hiển thị thông tin khách hàng    
    let id = req.params.id;
    let results = await khcnController.getData(`detail/${id}`);
    results[0].NgaySinh = Util.dinhdangNgayISO(results[0].NgaySinh);
    res.render("khcnDetail", { khcn: results[0] });    
});

router.get('/update/:id', async function (req, res, next) {
    //chức năng mở trang thông tin chi tiết một khách hàng, cho phép sửa
    //phương thức request: get
    //gởi request đến DAOWS
    //render trang khcnUpdate để hiển thị thông tin khách hàng và cho phép người dùng thay đổi thông tin 
    let id = req.params.id;
    let quoctichs = await quoctichController.getData("");
    let results = await khcnController.getData(`detail/${id}`);
    results[0].NgaySinh = Util.dinhdangNgayISO(results[0].NgaySinh);
    res.render("khcnUpdate", { quoctich: quoctichs, khcn: results[0] });
});
router.post('/update/:id',async function (req, res, next) {
    //chức năng cập nhật thông tin chi tiết một khách hàng 
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //gởi request lên DAOWS 
    //trả về thông báo kết quả cập nhật thông tin
    let id = req.params.id;
    let val = req.body;
    //chuyển ngày sinh dạng object javascript về dạng chuỗi yyyy-mm-dd của mysql
    val.NgaySinh = new Date(val.NgaySinh);
    val.NgaySinh = Util.dinhdangNgayDate(val.NgaySinh);
    
    let result = await khcnController.pushData(`update/${id}`, val);
    let thaotac = { "ten": "Thay đổi thông tin khách hàng" };
    let ketqua = result;
    res.render("khcnResult", { thaotac, ketqua });
});

router.get('/delete/:id',async function (req, res, next) {
    //chức năng cập nhật record trong table 
    //phương thức request: put
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện cập nhật record vào table 
    //trả về thông báo json đã cập nhật
    let id = req.params.id;
    let results = await khcnController.getData(`detail/${id}`);
    results[0].NgaySinh = Util.dinhdangNgayISO(results[0].NgaySinh);
    res.render("khcnDelete", { khcn: results[0] });
});
router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa record
    //trả về thông báo json đã xóa
    let id = req.params.id;
    let val =req.body;
    let result = await khcnController.pushData(`delete/${id}`, val);
    let thaotac = { "ten": "Xóa thông tin khách hàng" };
    let ketqua = result;
    res.render("khcnResult", { thaotac, ketqua });    
});

module.exports = router;