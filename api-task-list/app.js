const express = require("express");
const bodyParser = require("body-parser");
const koneksi = require("./config/database");
const app = express();
const PORT = process.env.PORT || 8000;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extented: false }));

app.post("/api/task", (req, res) => {
    const data = { ...req.body };
    const querySql = "INSERT INTO task SET ?";

    // jalankan query
    koneksi.query(querySql, data, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: "Gagal insert data!", error: err });
        }

        // jika request berhasil
        res.status(201).json({ success: true, message: "Berhasil insert data!" });
    });
});

// read data
app.get('/api/task', (req, res) => {
    // buat query sql
    const querySql = 'SELECT * FROM task';

    // jalankan query
    koneksi.query(querySql, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika request berhasil
        res.status(200).json({ success: true, data: rows });
    });
});

// update data
app.put('/api/task/:id', (req, res) => {
    // buat variabel penampung data dan query sql
    const data = { ...req.body };
    const querySearch = 'SELECT * FROM task WHERE id = ?';
    const queryUpdate = 'UPDATE task SET ? WHERE id = ?';

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: 'Ada kesalahan', error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query update
            koneksi.query(queryUpdate, [data, req.params.id], (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: 'Ada kesalahan', error: err });
                }

                // jika update berhasil
                res.status(200).json({ success: true, message: 'Berhasil update data!' });
            });
        } else {
            return res.status(404).json({ message: 'Data tidak ditemukan!', success: false });
        }
    });
});

// delete data
app.delete("/api/task/:id", (req, res) => {
    // buat query sql untuk mencari data dan hapus
    const querySearch = "SELECT * FROM task WHERE id = ?";
    const queryDelete = "DELETE FROM task WHERE id = ?";

    // jalankan query untuk melakukan pencarian data
    koneksi.query(querySearch, req.params.id, (err, rows, field) => {
        // error handling
        if (err) {
            return res.status(500).json({ message: "Ada kesalahan", error: err });
        }

        // jika id yang dimasukkan sesuai dengan data yang ada di db
        if (rows.length) {
            // jalankan query delete
            koneksi.query(queryDelete, req.params.id, (err, rows, field) => {
                // error handling
                if (err) {
                    return res.status(500).json({ message: "Ada kesalahan", error: err });
                }

                // jika delete berhasil
                res.status(200).json({ success: true, message: "Berhasil hapus data!" });
            });
        } else {
            return res.status(404).json({ message: "Data tidak ditemukan!", success: false });
        }
    });
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`));