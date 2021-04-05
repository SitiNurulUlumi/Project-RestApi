const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3001;
app.use(express.urlencoded({extended : false}));

const koneksiDB = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "pertemuan1"
});

koneksiDB.connect((err)=>{
    if(err){
        console.log("database tidak terkoneksi");
    }else{
        console.log("database terkoneksi");
    }
});

app.get("/api/foods", (req, res)=>{
    let sql ="select * from foods";
    koneksiDB.query(sql, (err, result)=>{
        if(err){
            res.send({
                msg: "gagal mendapat data",
                status : 500,
                err,
            })
        }else{
            res.send({
                mdg: "data didapatkan",
                status: 200,
                data: result,
            })
        }
    })
});

app.post("/api/foods", (req, res)=>{
    let{body}=req;
    let sql = "insert into foods set ?";
    koneksiDB.query(sql, body,(err,results)=>{
        if(err){
            res.send({
                msg: "gagal menambah data",
                status : 500,
                err,
            })
        }else{
            let newBody = {
                id: results.insertId,
                ...body,
            };
            res.send({
                msg: "data berhasil ditambah",
                status: 200,
                data: newBody,
            });
        }
    })
});

app.get("/api/foods/:id", (req,res)=>{
    let{id} = req.params;
    let sql = `select * from foods where id = ${id}`;
    koneksiDB.query(sql, (err, results)=>{
        if(err){
            res.send({
                msg: "pengambilan data error",
                status: 500,
                err,
            })
        }else{
            res.send({
                msg: "pengambilan data berhasil",
                status: 200,
                data: results,
            })
        }
    })
});


app.put("/api/foods/:id",(req, res)=>{
    let {id} = req.params;
    let {body}=req;
    let sql = `update foods SET ? where id = ${id}`;
    koneksiDB.query(sql, body,(err,results)=>{
        if(err){
            res.send({
                msg: "data gagal diupdate",
                status : 500,
                err,
            })
        }else{
            res.send({
                msg: "data berhasil diupdate",
                status: 200,
                data: results,
            });
        }
    })
})

app.delete("/api/foods/:id", (req, res) =>{
let{id} = req.params;
let sql = `delete from foods where id = ${id}`;
koneksiDB.query(sql, (err,results)=>{
    if(err){
        res.send({
            msg: "gagal menghapus data",
            status : 500,
            err,
        })
    }else{
        res.send({
            msg: "data berhasil dihapus",
            status: 200,
            data: results,
        });
    }
})
})
app.listen(port, () =>{
    console.log("server jalan pada port : "+ port);
});