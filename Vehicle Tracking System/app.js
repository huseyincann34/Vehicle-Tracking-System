var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var { response } = require('express');
const path = require("path");
const redis = require("redis")
const mysql=require("mysql");
const client = redis.createClient({
   host: '127.0.0.1',
   redis
});
var veri;
var veri2;
let m;
var username;
var password;
var araç1;
var araç2;
var data=[];
const moment=require("moment");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const encoder=bodyParser.urlencoded();
app.use(express.static('public'));

//mysql bağlanma
const connection=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"1234",
    database:"nodejs"
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("Mysqle bağlanıldı!");
      });

//Login ekranı sorgu işlemleri
app.post("/",encoder,function(req,res){
     username=req.body.username;
     password=req.body.password;
    connection.query("select * from loginuser where uder_name = ? and user_pass = ?",[username,password],function(error,results,fields){
        if(results.length>0){
           m=moment().format('YYYY-MM-DD hh:mm:ss a');
          console.log(`GİRİŞ TARİHİ=>${m.toString()}`);
        
      if(username=="hamit"){     
          connection.query("insert into login1 (uder_name,tarih) values (?,?)",[username,m]);
      }
      else{
         connection.query("insert into login2 (uder_name,tarih) values (?,?)",[username,m]);
      }         
      res.redirect("/index2");
        }else{
         res.redirect("/"); 
        }
        res.end();
    })
    connection.query("select carid2,carid1 from loginuser where uder_name = ? and user_pass= ?",[username,password],function(error,results,fields
        ){
               if(results.length>0){
                  araç1=results[0].carid1;
                  araç2=results[0].carid2;              
              
               }
        })
})

app.get('/index2', function (req, res) {
    res.sendFile(__dirname +"/public/index2.html");
 })
 
 // ---------------------------------------------------------------------------------------------------
app.post('/PostEt1', urlencodedParser, async function (req, res) {
 
   response = {
      bdaytime: req.body.bdaytime,
   };
   veri = response
   let tarih = tarihDonustur(veri)
   let datagetir = await verigetir(tarih);
   res.send(datagetir)
})

function tarihDonustur(veri) {

   var donusturulenJsonObject = veri.bdaytime;
   var tarih = donusturulenJsonObject.toString().replace('T', ' ');
   return tarih;
}

function verigetir(tarih) {
   let TarihDetay = tarih.split(" ")
   let date = TarihDetay[0]
   let SaatDetay = TarihDetay[1].split(":")
   let saat = SaatDetay[0]
   let dakika = SaatDetay[1]

   for (let i = 0; i < 30; i++) {
      if (dakika - i > 0) {
       
         client.get(`user_${araç1}_${date} ${saat}:${dakika - i}`, (error, message) => {
            if (error) {
               console.error(error);
            }
            var messageInfo = JSON.parse(message)
            if (messageInfo) {
               console.log(messageInfo)
               data.push(messageInfo)
            }
         })
      }
      else {
         dakika = 60;
         hout = saat - 1
      }


   
   }
   return data;

}


// ------------------------------------------------------
app.post('/PostEt2', urlencodedParser, async function (req, res) {

    response = {
       bdaytime: req.body.bdaytime,
    };
    veri2 = response
    let tarih2 = tarihDonustur(veri2)
    let datagetir2 = await verigetir2(tarih2);
    res.send(datagetir2)
 
 })

 function verigetir2(tarih2) {
    let TarihDetay = tarih2.split(" ")
    let date = TarihDetay[0]
    let SaatDetay = TarihDetay[1].split(":")
    let saat = SaatDetay[0]
    let dakika = SaatDetay[1]
 
    for (let i = 0; i < 30; i++) {
       if (dakika - i > 0) {
     
          client.get(`user_${araç2}_${date} ${saat}:${dakika - i}`, (error, message) => {
             if (error) {
                console.error(error);
             }
             var messageInfo = JSON.parse(message)
             if (messageInfo) {
                console.log(messageInfo)
                data.push(messageInfo)
             }
          })
       }
       else {
          dakika = 60;
          hout = saat - 1
       }
 
 
   
    }
    return data;
 
 }

// ---------------------------------------------------------------------------------------------------

 app.post('/PostEt3', urlencodedParser, async function (req, res) {
 
   connection.query("select carid2,carid1 from loginuser where uder_name = ? and user_pass= ?",[username,password],function(error,results,fields
      ){
             if(results.length>0){
                araç1=results[0].carid1;
                araç2=results[0].carid2;  
               var sayi="Araç idi: "+araç1.toString()+" Araç idi: "+araç2.toString();
                res.send(sayi) 
             }
      })
})

// ---------------------------------------------------------------------------------------------------
app.post('/PostEt4', urlencodedParser, async function (req, res) {
   if(username=='hamit'){
      connection.query("SELECT COUNT (id) FROM login1  ",function(error,results){
         var sayi2=results[0]['COUNT (id)'];
         var sayi3=sayi2.toString();

       connection.query("select * from login1 where id = ?",[sayi2-1],function(error,results){
      
             var tarih4=results[0].tarih;
             res.send(tarih4)
          
       });

       })
   }
   else{
      connection.query("SELECT COUNT (id) FROM login2  ",function(error,results){
         var sayi2=results[0]['COUNT (id)'];
         var sayi3=sayi2.toString();

       connection.query("select * from login2 where id = ?",[sayi2-1],function(error,results){
      
             var tarih4=results[0].tarih;
             res.send(tarih4)
          
       });

       })
   }
 

})
// ---------------------------------------------------------------------------------------------------

var server = app.listen(9010, function () {
    var host = server.address().address
    var port = server.address().port
 
    console.log("Dinleniyor. http://%s:%s", host, port)
 
 })

