$(document).ready(function () {
            
    $("#btnDel").click(function () {        
        //$("#khach").remove();
        
        $("[href='khachs']:last").remove();
        let khachsCollection = $("[href='khachs']");
        let num = khachsCollection.length;        
        console.log(khachsCollection[num-1]);
        if(num>=0){
            $("#tongsoKhach").val(num);
        }        
    });
    
    $("#btnAdd").click(function () {
        //lấy số khách có thể lưu trú tối đa 1 phòng
        let nmax = $("#tongsoKhachMax").val();
        //lấy thứ tự của khách đã đăng ký bằng cách đếm số button trên trang html
        //const myCollection = document.getElementsByTagName("input");         
        let khachsCollection = $("[href='khachs']");
        let khachslabelCollection = $("[href='khachslabel']");
        let alreadyhavekhachslabel = khachslabelCollection.length;
        let num = khachsCollection.length;        
        //Kiểm tra xem số khách đăng ký không được vượt số khách tối đa có thể lưu trú
        if (!alreadyhavekhachslabel){
            $("#secCuoi").before(`<div class="row" href="khachslabel">
                        <div class="input-group-text col-lg-1 col-sm-12 mb-1 mx-0 ">                            
                            <label style="font-weight: bolder;" >STT</label>
                        </div>
                        <div class="input-group-text col-lg-3 col-sm-12 mb-1 " style="text-align: center;">
                            <label style="font-weight: bolder;" >Tên Khách Hàng</label>                            
                        </div>
                        <div class="input-group-text col-lg-2 col-sm-12 mb-1 " style="text-align: center;">
                            <label style="font-weight: bolder;">Loại Khách Hàng</label>
                        </div>
                        <div class="input-group-text col-lg-2 col-sm-12 mb-1" style="text-align: center;">
                            <label style="font-weight: bolder;">GTCN số</label>
                        </div>
                        <div class="input-group-text col-lg-4 col-sm-12 mb-1" style="text-align: center;">
                            <label style="font-weight: bolder;">Địa chỉ</label>
                        </div>
                    </div>`);
        }
        let _khach = $("#khachhang").val();
        let thongtinKhach =[];
        console.log(_khach);
        if(_khach!=undefined&&_khach.toString().trim()!=''){
            thongtinKhach = _khach.split('|');
            if (num < nmax) {
            $("#secCuoi").before(`<div class="row" id="khach" href="khachs">
            <div class="input-group-text col-lg-1 col-sm-12 mb-1 px-0 mx-0">
                <input type="number" class="form-control px-1 mx-0" name="STT" id="STT" style="text-align: right; font-size: 86%;" readonly>
            </div>
            <div class="input-group-text col-lg-3 col-sm-12 mb-1 px-0 mx-0">
                <input type="hidden" class="form-control px-1 mx-0" name="CaNhanID" id="CaNhanID" >
                <input type="text" class="form-control px-1 mx-0" name="CaNhanTen" id="CaNhanTen" readonly style="text-align: left; font-size: 86%;">
            </div>
            <div class="input-group-text col-lg-2 col-sm-12 mb-1 px-0 mx-0">
                <input type="text" class="form-control px-1 mx-0" name="LoaiKhach" id="LoaiKhach" readonly style="text-align: left; font-size: 86%;">
            </div>            
            <div class="input-group-text col-lg-2 col-sm-12 mb-1 px-0 mx-0"style="padding-left: 0px; padding-right: 0px;">
                <input type="hidden" class="form-control " name="TenGTCN" id="TenGTCN" readonly style="text-align: left; font-size: 86%;">
                <input type="text" class="form-control px-1 mx-0" name="GTCNSo" id="GTCNSo" readonly style="text-align: left; font-size: 86%;">
            </div>
            <div class="input-group-text col-lg-4 col-sm-12 mb-1 px-0 mx-0"style="padding-left: 0px; padding-right: 0px;">
                <input type="text" class="form-control px-1 mx-0" name="DiaChi" id="DiaChi" readonly style="text-align: left; font-size: 86%;">
            </div>            
            </div>`);

            $("#STT").val(num + 1);
            $("#tongsoKhach").val(num + 1);
            $("#STT").attr({ "id": ['STT' + num + 1] });
            $("#CaNhanID").val(thongtinKhach[0]);
            $("#CaNhanID").attr({ "id": ['CaNhanID' + num + 1] });
            console.log('khachid: ', thongtinKhach[0])
            $("#CaNhanTen").val(thongtinKhach[1]);
            $("#CaNhanTen").attr({ "id": ['CaNhanTen' + num + 1] });
            $("#LoaiKhach").val(thongtinKhach[2]);
            $("#LoaiKhach").attr({ "id": ['LoaiKhach' + num + 1] });
            $("#GTCNSo").val(thongtinKhach[4]);
            $("#GTCNSo").attr({ "id": ['GTCNSo' + num + 1] });
            $("#DiaChi").val(thongtinKhach[5]);
            $("#DiaChi").attr({ "id": ['DiaChi' + num + 1] });
            $("#khachhang").val('');
            }else alert("Số khách đăng ký không được vượt số khách tối đa là: " + nmax + " người/phòng.");
        }else{
            alert("Vui lòng chọn khách hàng trước khi chọn thêm!");
        }
        
            /* Câu lệnh thêm dòng có thông tin loại gtcn và số gtcn: chưa làm được tính năng này
            $("#secCuoi").before('<div class="row" id="khach"><div class="input-group-text col-lg-1 mb-3"><input type="number" class="form-control" name="STT" id="STT"></div>
            <div class="input-group-text col-lg-3 mb-3"><input type="number" class="form-control" name="CaNhanID" id="CaNhanID" placeholder="ID"></div><div class="input-group-text col-lg-2 mb-3"><input type="text" class="form-control" name="HuongDan" id="HuongDan" value="Hoặc" readonly ></div><div class="input-group-text col-lg-3 mb-3"><select type="text" class="form-control" name="LoaiGTCNID" id="LoaiGTCNID" readonly ><option value="">Chọn ...</option><option value="1">CMND</option><option value="2">CCCD</option><option value="3">Hộ chiếu</option></select></div><div class="input-group-text col-lg-3 mb-3"><input type="text" class="form-control" name="GTCNSo" id="GTCNSo" placeholder="GTCN số" readonly></div> 
            </div>`);                    
            */
            
    });                
});
function getConfirmation_Delete() {
    var retVal = confirm("Bạn chắc chắn muốn xóa?");
    if (retVal == true) {
        document.getElementById("btn_Xoa").setAttribute("type", "Submit");
    }
    else if (retVal == false) {
        alert("Bạn đã hủy yêu cầu xóa!");
    }
}
function rowaddRemove() {        
    $(this).parent("div").remove();
    const myCollection = document.getElementsByTagName("input"); 
    let num = parseInt(myCollection.length/2) -3;
    $("#tongsoKhach").val(num);
}
function quay_lai_trang_truoc(){
    history.back();
}
function tinhtienPhong(){
    let basePrice = document.getElementById("DonGiaCoSo").value;
    let dongiathanhtoan = basePrice;
    let tylephuthu = document.getElementById("TyLePhuThu").value;
    let hesogia = document.getElementById("HeSoGia").value;
    let ngaythue = document.getElementById("NgayThue").value;
    let ngaytra = document.getElementById("NgayTra").value;
    let dngaythue = new Date(ngaythue)  ;
    let dngaytra = new Date(ngaytra);
    let songaythue = (dngaytra - dngaythue)/1000/3600/24;
    let sokhachluutru = document.getElementById("tongsoKhach").value;
    if(sokhachluutru>2){
        dongiathanhtoan = basePrice * hesogia / 100 + basePrice * tylephuthu / 100;
    }else{
        dongiathanhtoan = basePrice * hesogia / 100;
    }    
    let thanhtien = dongiathanhtoan * songaythue;
    document.getElementById("SoNgayThue").value = songaythue;
    document.getElementById("DonGiaThanhToan").value = dongiathanhtoan;
    document.getElementById("ThanhTien").value = thanhtien;
}
      
