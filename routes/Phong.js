var express = require('express');
var router = express.Router();

const phongController = require('./../controllers/phongController');
const loaiphongController = require('./../controllers/loaiphongController');
const Util = require('./../Until/presentProcess');

router.get('/', async function (req, res, next) {
    //chức năng trả về danh sách các record
    //phương thức request: get
    //dung phuong thuc getData cua phongController de request ket qua tu DAOWS
    //render trang phongIndex
    let phongs = await phongController.getData("");
    if(phongs.length>0){        
        for (let i = 0; i < phongs.length; i++) {
            phongs[i].LoaiPhongGia = Util.numberFormat.format(phongs[i].LoaiPhongGia);
        }
        res.render("phongIndex", { danhsach: phongs });
    }else
    res.json(phongs);
    
});
router.get('/create',async function (req, res, next) {
    //chức năng mở page thêm mới để nhập thông tin
    //phương thức request: get
    //Lấy thông tin loại phòng để thiết kế select loại phòng trên form thêm mới
    //Mở form nhập thông tin
    let loaiphongs= await loaiphongController.getData("");    
    res.render("phongAdd", { loaiphong: loaiphongs });
});
router.post('/create',async function (req, res, next) {
    //chức năng thêm mới record vào table
    //phương thức request: post
    //tiếp nhận dữ liệu gửi trong body request
    //thực hiện chèn record mới vào table 
    //trả về thông báo qua trang phongResult 
    let val = req.body;
    let responseObject =await phongController.pushData("create",val);
    let thaotac = responseObject.thaotac;
    let ketqua = responseObject.ketqua;
    res.render("phongResult", { thaotac, ketqua });
});
router.get('/detail/:id',async function (req, res, next) {
    //chức năng trả về chi tiết 1 record
    //phương thức request: get
    //tiếp nhận id của reord trong url
    //lấy ra record theo id từ table
    //trả về chi tiết record trong page phongDetail
    let id = req.params.id;
    let responseObject = await phongController.getData(`detail/${id}`);
    if(responseObject.status==200){
        res.render("phongDetail", { phong: responseObject.phongs[0] });
    }
    else
        res.json(responseObject);
});
router.get('/update/:id',async function (req, res, next) {
    //chức năng mở page update để cập nhật thông tin phòng, 
    //phương thức request: get,
    //tiếp nhận id từ url,
    //đẩy request đến DAOWS, 
    //trả về page phongUpdate.
    let id = req.params.id;
    let loaiphongs = await loaiphongController.getData("");
    let responseObject = await phongController.getData(`detail/${id}`);
    if (responseObject.status == 200) {
        res.render("phongUpdate", { loaiphong: loaiphongs, phong: responseObject.phongs[0] });
    }
    else
        res.json(responseObject);
});
router.post('/update/:id',async function (req, res, next) {
    //chức năng nhận thông tin để cập nhật thông tin record trong table 
    //phương thức request: post
    //gửi dữ liệu trong body request đến DAOWS
    //trả về thông báo kết quả cập nhật trong page phongResult.
    let id = req.params.id;
    let val = req.body;
    let responseObject = await phongController.pushData(`update/${id}`,val);
    let thaotac = responseObject.thaotac;
    let ketqua = responseObject.ketqua;
    res.render("phongResult", { thaotac, ketqua });
});
router.get('/delete/:id',async function (req, res, next) {
    //chức năng mở page phongDelete để người dùng xem thông tin phòng cần xóa 
    //phương thức request: get
    //tiếp nhận id từ url.
    let id = req.params.id;
    let loaiphongs = await loaiphongController.getData("");
    let responseObject = await phongController.getData(`detail/${id}`);
    if (responseObject.status == 200) {
        res.render("phongDelete", { phong: responseObject.phongs[0] });
    }
    else
        res.json(responseObject);
});
router.post('/delete/:id',async function (req, res) {
    //chức năng xóa 1 record trong table
    //phương thức request: post
    //tiếp nhận id trong url, đẩy request đến DAOWS    
    //trả về kết quả xóa trong page phongResult
    let id = req.params.id;
    let val = req.body;
    let responseObject = await phongController.pushData(`delete/${id}`, val);
    console.log(responseObject);
    let thaotac = responseObject.thaotac;
    let ketqua = responseObject.ketqua;
    res.render("phongResult", { thaotac, ketqua });
});

module.exports = router;