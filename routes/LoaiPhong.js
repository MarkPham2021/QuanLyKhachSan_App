var express = require('express');
var router = express.Router();

//var db = require('./../models/database'); //nhúng module kết nối db
const LoaiPhong = require('./../controllers/loaiphongController');
const Util = require('./../Until/presentProcess');

/* Cách viết 1: load trang web index phải refresh lại mới có dữ liệu.
router.get('/', function (req, res, next) {
   //chức năng trả về danh sách các record
   //phương thức request: get
   //lấy ra các record trong table
   //trả về danh sách các products dạng json
   let data = loaiphong.list();
   for(let i = 0; i<data.length; i++){
      data[i].LoaiPhongGia = Util.numberFormat.format(data[i].LoaiPhongGia);
   }
   res.render("loaiphongIndex", { danhsach: data });
});
*/
router.get('/', async function (req, res, next) {
   //chức năng trả về danh sách các record
   //phương thức request: get
   //lấy ra các record trong table
   //trả về danh sách các products dạng json
   let result = await LoaiPhong.getData("");   
   res.render("loaiphongIndex", { danhsach: result });
    
});

router.get('/create', async function (req, res, next) {
   //chức năng thêm mới record vào table
   //phương thức request: get
   //Mở form nhập thông tin 
   res.render("loaiphongAdd");
});
router.post('/create', async function (req, res, next) {
   //chức năng thêm mới record vào table
   //phương thức request: post
   
   let val = req.body;
   let responseObject = await LoaiPhong.pushData("create",val);   
   if (responseObject.ketqua.status==404) {
      let thaotac = responseObject.thaotac;
      let ketqua = responseObject.ketqua;
      res.render("loaiphongResult", { thaotac, ketqua });
   }
   else if (responseObject.ketqua.status == 200) {
      let thaotac = responseObject.thaotac;
      let ketqua = responseObject.ketqua;
      res.render("loaiphongResult", { thaotac, ketqua });
   }  

});

router.get('/detail/:id', async function (req, res, next) {
   //chức năng trả về chi tiết 1 record
   //phương thức request: get
   //tiếp nhận id của reord trong url   
   let id = req.params.id;
   let responseObject = await LoaiPhong.getData(`detail/${id}`);
   if (responseObject.status == 404) {
      
      res.render("loaiphongResult", { thaotac:{"ten":"Xem chi tiết loại phòng"}, ketqua:{"status":404} });
   }
   else if (responseObject.status == 200) {
      responseObject.loaiphongs[0].LoaiPhongGia = Util.numberFormat.format(responseObject.loaiphongs[0].LoaiPhongGia);
      res.render("loaiphongDetail", { loaiphong: responseObject.loaiphongs[0] });
   }  

});

router.get('/update/:id', async function (req, res, next) {
   //Mở màn hình thông tin chi tiết loại phòng 
   //Cho phép người dùng thay đổi thông tin
   
   let id = req.params.id;
   let responseObject = await LoaiPhong.getData(`detail/${id}`);
   console.log(responseObject);
   if (responseObject.status == 404) {

      res.render("loaiphongResult", { thaotac: { "ten": "Thay đổi thông tin loại phòng" }, ketqua: { "status": 404 } });
   }
   else if (responseObject.status == 200) {

      res.render("loaiphongUpdate", { loaiphong: responseObject.loaiphongs[0] });
   }
});
router.post('/update/:id',async function (req, res, next) {
   //tiếp nhận dữ liệu trong body request
   //gửi request đến DAOWS 
   //tiếp nhận kết quả xử lý từ DAOWS
   //render trang kết quả xử lý
   let id = req.params.id;
   let val = req.body;
   let responseObject = await LoaiPhong.pushData(`update/${id}`, val);
   if (responseObject.ketqua.status == 404) {
      let thaotac = responseObject.thaotac;
      let ketqua = responseObject.ketqua;
      res.render("loaiphongResult", { thaotac, ketqua });
   }
   else if (responseObject.ketqua.status == 200) {
      let thaotac = responseObject.thaotac;
      let ketqua = responseObject.ketqua;
      res.render("loaiphongResult", { thaotac, ketqua });
   }
});

router.get('/delete/:id', async function (req, res, next) {
   //Mở màn hình thông tin chi tiết loại phòng
   //Không cho phép người dùng thay đổi thông tin
   //Người dùng có thể chọn nút xóa để xóa thông tin hoặc bấm nút quay về danh mục loại phòng.

   let id = req.params.id;
   let responseObject = await LoaiPhong.getData(`detail/${id}`);
   console.log(responseObject);
   if (responseObject.status == 404) {

      res.render("loaiphongResult", { thaotac: { "ten": "Xóa loại phòng" }, ketqua: { "status": 404 } });
   }
   else if (responseObject.status == 200) {
      responseObject.loaiphongs[0].LoaiPhongGia = Util.numberFormat.format(responseObject.loaiphongs[0].LoaiPhongGia);
      res.render("loaiphongDelete", { loaiphong: responseObject.loaiphongs[0] });
   }   
});
router.post('/delete/:id',async function (req, res) {
   //gửi request đến DAOWS
   //tiếp nhận kết quả xử lý từ DAOWS
   //render trang kết quả xử lý
   let id = req.params.id;
   let val =req.body;
   let responseObject = await LoaiPhong.pushData(`delete/${id}`, val);
   if (responseObject.ketqua.status == 404) {
      let thaotac = responseObject.thaotac;
      let ketqua = responseObject.ketqua;
      res.render("loaiphongResult", { thaotac, ketqua });
   }
   else if (responseObject.ketqua.status == 200) {
      let thaotac = responseObject.thaotac;
      let ketqua = responseObject.ketqua;
      res.render("loaiphongResult", { thaotac, ketqua });
   }
});

module.exports = router;