var express = require('express');
var router = express.Router();
const Util = require('../Until/presentProcess');
const baocaoController = require('../controllers/baocaoController');
router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các phiếu thuê phòng
    //phương thức request: get
    //lấy ra các record từ database
    //trả về danh sách các phiếu thuê phòng trong page phieuthuephongIndex
    let d = await phieuthuephongController.getData("");
    let n = d.length;
    for (let i = 0; i < n; i++) {
        d[i].NgayThue = Util.dinhdangNgayISO(d[i].NgayThue);
        d[i].NgayTraDuKien = Util.dinhdangNgayISO(d[i].NgayTraDuKien);
        if (d[i].isActive) {
            d[i].isActive = "Yes";
        }
        else {
            d[i].isActive = "No";
        }
        if (d[i].hasForeigner) {
            d[i].hasForeigner = "Yes";
        }
        else {
            d[i].hasForeigner = "No";
        }
    }
    res.render("phieuthuephongIndex", { danhsach: d });

});

router.get('/create', async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: get
    //Lấy thông tin loại phòng để thiết kế select loại phòng trên form thêm mới
    //Mở form nhập thông tin
    let data = await phieuthuephongController.getData("create");
    let _chinhsach = data.chinhsachs[0];
    let _phongs = data.phongs;
    let _khcns = data.khcns;
    let _l = _phongs.length;
    for (let i = 0; i < _l; i++) {
        _phongs[i].LoaiPhongGia = Util.numberFormat.format(_phongs[i].LoaiPhongGia);
    }
    res.render("phieuthuephongAdd", { chinhsach: _chinhsach, phong: _phongs, khachhang: _khcns });
});
router.post('/create', async function (req, res, next) {
    //chức năng nhận thông tin lập phiếu thuê phòng từ 'phieuthuephongAdd' để lập phiếu thuê 'phieuthuephongSave';
    //phương thức request: post;
    //tiếp nhận dữ liệu gửi trong body request;
    //thực hiện Lấy thông tin khách hàng;
    //trả về trang xác nhận lập phiếu:'phieuthuephongSave'  với thông tin khách hàng đầy đủ.   
    let khcns = await khcnController.getData("");
    let sokhach = parseInt(req.body.tongsoKhach);
    let ids = [];
    for (let i = 0; i < sokhach; i++) {
        if (Array.isArray(req.body.CaNhanID)) {
            ids[i] = req.body.CaNhanID[i];
        }
        else {
            ids[i] = req.body.CaNhanID;
        }
    }
    var khachs = [];
    for (let i = 0; i < sokhach; i++) {
        if (ids[i] != "" && ids[i] != null) {
            let id = parseInt(ids[i]);
            let temp = khcns.find((_khcn, index, array) => _khcn.CaNhanID == id);
            if (temp != undefined) {
                khachs[i] = khcns.find((_khcn, index, array) => _khcn.CaNhanID == id)
            }
            else {
                res.json({ 'Lỗi': "Không tìm thấy khách hàng", 'CaNhanID': id });
                break;
            }
        }
    }
    res.render("phieuthuephongSave", {
        ChinhSachID: req.body.ChinhSachID, STT: req.body.STT, phong: req.body.Phong, ngaythue: req.body.NgayThue,
        ngaytradukien: req.body.NgayTraDuKien, tongsokhach: sokhach, tongsokhachmax: req.body.tongsoKhachMax, khachs: khachs
    });
});
router.post('/save', async function (req, res, next) {
    //chức năng nhận thông tin phieuthuephongSave để đẩy request về DAOWS thêm mới dữ liệu vào database gồm: Thêm mới PhieuThuePhong và CTPhieuThuePhong
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request    
    //trả kết quả xử lý ra dạng json.
    let val = req.body;
    let response = await phieuthuephongController.pushData("save", val);
    let thaotac = { "ten": "Tạo mới phiếu thuê phòng" };
    let ketqua = response;
    res.render("phieuthuephongResult", { thaotac, ketqua });
});
router.get('/detail/:id', async function (req, res, next) {
    //chức năng trả về chi tiết 1 phiếu thuê phòng
    //phương thức request: get
    //tiếp nhận id của record trong url
    //lấy thông tin phiếu thuê phòng từ table PhieuThuePhong left join Phong left join LoaiPhong; chi tiết phiếu thuê phòng từ CTPhieuThuePhong left join KhachHangCaNhan;
    //Xử lý dữ liệu và trả về trang phieuthuephongDetail.
    let id = req.params.id;
    let response = await phieuthuephongController.getData(`detail/${id}`);
    let results = response.phieuthuephongs;
    let d = response.ctphieuthuephongs;
    results[0].LoaiPhongGia = Util.numberFormat.format(results[0].LoaiPhongGia);
    results[0].NgayThue = Util.dinhdangNgayDate(results[0].NgayThue);
    results[0].NgayTraDuKien = Util.dinhdangNgayDate(results[0].NgayTraDuKien);
    if (results[0].isActive) results[0].isActive = "Yes";
    else results[0].isActive = "No";
    if (results[0].hasForeigner) results[0].hasForeigner = "Yes";
    else results[0].hasForeigner = "No";
    res.render("phieuthuephongDetail", { phieuthue: results[0], khachs: d });
});
router.get('/delete/:id', async function (req, res, next) {
    //chức năng mở form để xóa phieuthuephong và chi tiết phiếu thuê phòng kèm theo 
    //phương thức request: get
    //tiếp nhận id của record trong url
    //Đọc dữ liệu của phiếu thuê phòng và chi tiết các phiếu thuê phòng kèm theo từ CSDL (tương tự detail/:id)
    //Xử lý dữ liệu và trả về trang phieuthuephongDelete.
    let id = req.params.id;
    let response = await phieuthuephongController.getData(`detail/${id}`);
    let results = response.phieuthuephongs;
    let d = response.ctphieuthuephongs;
    results[0].LoaiPhongGia = Util.numberFormat.format(results[0].LoaiPhongGia);
    results[0].NgayThue = Util.dinhdangNgayDate(results[0].NgayThue);
    results[0].NgayTraDuKien = Util.dinhdangNgayDate(results[0].NgayTraDuKien);
    if (results[0].isActive) results[0].isActive = "Yes";
    else results[0].isActive = "No";
    if (results[0].hasForeigner) results[0].hasForeigner = "Yes";
    else results[0].hasForeigner = "No";
    res.render("phieuthuephongDelete", { phieuthue: results[0], khachs: d });
});
router.post('/delete/:id', async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url
    //thực hiện xóa  các record CTPhieuThuePhong => xóa record PhieuThue Phong; release phong;
    //trả về thông báo json đã xóa
    let id = req.params.id;
    let val = req.body;
    let response = await phieuthuephongController.pushData(`delete/${id}`, val);

    let thaotac = { "ten": "Xóa phiếu thuê phòng" };
    let ketqua = response;
    res.render("phieuthuephongResult", { thaotac, ketqua });

});

router.get('/dsphong', async (req, res, next) => {
    //mo trang danh sach phong
    //goi request ve DAOWS de lay du lieu danh sach phong
    //render trang danh sach phong
    let data = await phieuthuephongController.getData("dsphong");
    let d = data.phongcokhachs;
    let l = d.length;
    for (let i = 0; i < l; i++) {
        let ttp = "Phòng bận";
        if (d[i].TinhTrang) ttp = "Phòng trống";
        d[i].TinhTrang = ttp;
        if (d[i].NgayThue != null) d[i].NgayThue = Util.dinhdangNgayISO(d[i].NgayThue);
        if (d[i].NgayTraDuKien != null) d[i].NgayTraDuKien = Util.dinhdangNgayISO(d[i].NgayTraDuKien);
        d[i].LoaiPhongGia = Util.numberFormat.format(d[i].LoaiPhongGia);
    }
    let _phongtrongs = data.phongtrongs;
    let n = _phongtrongs.length;
    for (let i = 0; i < n; i++) {
        let ttp = "Phòng bận";
        if (_phongtrongs[i].TinhTrang) {
            ttp = "Phòng trống";
        }
        _phongtrongs[i].TinhTrang = ttp;
        _phongtrongs[i].LoaiPhongGia = Util.numberFormat.format(_phongtrongs[i].LoaiPhongGia);
    }
    res.render("phieuthuephongDSPhong", { phongcokhach: d, phongtrong: _phongtrongs });

})
router.post('/dsphong', async (req, res) => {

    let val = req.body;
    let data = await phieuthuephongController.pushData("dsphong", val);
    let d = data.phongcokhachs;
    let l = d.length;
    for (let i = 0; i < l; i++) {
        let ttp = "Phòng bận";
        if (d[i].TinhTrang) ttp = "Phòng trống";
        d[i].TinhTrang = ttp;
        if (d[i].NgayThue != null) d[i].NgayThue = Util.dinhdangNgayISO(d[i].NgayThue);
        if (d[i].NgayTraDuKien != null) d[i].NgayTraDuKien = Util.dinhdangNgayISO(d[i].NgayTraDuKien);
        d[i].LoaiPhongGia = Util.numberFormat.format(d[i].LoaiPhongGia);
    }
    let _phongtrongs = data.phongtrongs;
    let n = _phongtrongs.length;
    for (let i = 0; i < n; i++) {
        let ttp = "Phòng bận";
        if (_phongtrongs[i].TinhTrang) {
            ttp = "Phòng trống";
        }
        _phongtrongs[i].TinhTrang = ttp;
        _phongtrongs[i].LoaiPhongGia = Util.numberFormat.format(_phongtrongs[i].LoaiPhongGia);
    }
    res.render("phieuthuephongDSPhong", { phongcokhach: d, phongtrong: _phongtrongs });
});
router.get('/search', async (req, res, next) => {
    //mo trang tim kiem phieu thue phong
    //goi request len DAOWS de lay ve thong tin danh sach phong
    //render trang tim kiem phieu thue phong

    let result = await phieuthuephongController.getData("search");
    let danhsach = [];
    let _l = result.length;
    for (let i = 0; i < _l; i++) {
        result[i].LoaiPhongGia = Util.numberFormat.format(result[i].LoaiPhongGia);
    }
    res.render("phieuthuephongSearch", { phong: result, danhsach: danhsach });

})
router.post('/search', async (req, res) => {
    let val = req.body;
    let data = await phieuthuephongController.pushData("search", val);
    let result = data.phongs;
    let d = data.phieuthuephongs;
    let _l = result.length;
    for (let i = 0; i < _l; i++) {
        result[i].LoaiPhongGia = Util.numberFormat.format(result[i].LoaiPhongGia);
    }
    let n = d.length;
    for (let i = 0; i < n; i++) {
        d[i].NgayThue = Util.dinhdangNgayISO(d[i].NgayThue);
        d[i].NgayTraDuKien = Util.dinhdangNgayISO(d[i].NgayTraDuKien);
        if (d[i].isActive) {
            d[i].isActive = "Yes";
        }
        else {
            d[i].isActive = "No";
        }
        if (d[i].hasForeigner) {
            d[i].hasForeigner = "Yes";
        }
        else {
            d[i].hasForeigner = "No";
        }
    }
    danhsach = d;
    res.render("phieuthuephongSearch", { phong: result, danhsach: danhsach });
})
module.exports = router;