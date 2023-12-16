const express = require('express')
const db = require('./config/connection')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
const xlsx = require('xlsx');
const port = 3000

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");


//bab materi

//get bab materi
app.get('/babmateri', (req, res) => {
    const sql = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    db.query(sql, (error, result) => {
        res.send({babmateri:result})
    })
})

//get tampilan bab materi
app.get('/tampilanbabmateri', (req, res) => {
    const sql = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    db.query(sql, (error, result) => {
        res.render('babmateri', {babmateri:result})
    })
})

//post/insert bab materi
app.post('/babmateri', (req, res) => {
    const { nama_babmateri } = req.body
    const sql = `INSERT INTO babmateri (id_babmateri, nama_babmateri) VALUES (NULL, '${nama_babmateri}')`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Bab Materi berhasil ditambahkan'})
    })
})
//delete bab materi
app.delete('/babmateri/:id_babmateri', (req, res) => {
    const id_babmateri = req.params.id_babmateri
    const sql = `DELETE FROM babmateri WHERE id_babmateri = ${id_babmateri}`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Bab Materi berhasil dihapus'})
    })
})

//update bab materi 
app.put('/babmateri/:id_babmateri', (req, res) => {
    const id_babmateri = req.params.id_babmateri
    const { nama_babmateri } = req.body;
    
    const sql = `UPDATE babmateri SET nama_babmateri= '${nama_babmateri}' WHERE id_babmateri = ${id_babmateri}`
    
    db.query(sql, (error, result) => {
        if (error) {
            res.status(500).send({ error: 'Gagal mengubah data' });
        } else {
            res.send({ msg: 'Bab Materi berhasil diubah' })
        }
    });
});

//soal

//get soal
app.get('/soal', (req, res) => {
    const sql1 = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    const sql2 = `SELECT exam_questions.id_exam_questions, babmateri.nama_babmateri, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d, exam_questions.pilihan_benar, exam_questions.tingkat_kesulitan FROM exam_questions INNER JOIN babmateri ON exam_questions.id_babmateri=babmateri.id_babmateri`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
        //    res.render('soal', {babmateri:result1, exam_questions:result2})
           res.send({babmateri:result1, exam_questions:result2})
        })
    })
})

//get tampilan soal
app.get('/tampilansoal', (req, res) => {
    const sql = `SELECT exam_questions.pertanyaan, exam_questions.id_exam_questions, babmateri.nama_babmateri, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d, exam_questions.pilihan_benar, exam_questions.tingkat_kesulitan FROM exam_questions INNER JOIN babmateri ON exam_questions.id_babmateri=babmateri.id_babmateri`
    db.query(sql, (error, result) => {
        res.render('soal', {exam_questions:result})
    })
})

//post soal
app.post('/soal', (req, res) => {
    const { pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_babmateri, tingkat_kesulitan } = req.body
    const sql = `INSERT INTO exam_questions (id_exam_questions, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_babmateri, tingkat_kesulitan) VALUES (NULL, '${pertanyaan}', '${pilihan_a}', '${pilihan_b}', '${pilihan_c}', '${pilihan_d}', ${pilihan_benar}, ${id_babmateri}, ${tingkat_kesulitan})`
    db.query(sql, (error, result) => {
        res.send({msg :'Soal tersimpan'})
    })
})

//delete soal
app.delete('/soal/:id_exam_questions', (req, res) => {
    const id_exam_questions = req.params.id_exam_questions
    const sql = `DELETE FROM exam_questions WHERE id_exam_questions = ${id_exam_questions}`
    db.query(sql, (error, result) => {
        res.send({msg :'Soal berhasil dihapus'})
    })
})

//detail soal
app.get('/soal/:id_exam_questions', (req, res) => {
    const id_exam_questions = req.params.id_exam_questions
    const sql = `SELECT * FROM exam_questions WHERE id_exam_questions = ${id_exam_questions}`
    db.query(sql, (error, result) => {
        res.send({exam_questions:result})
    })
})

//tampilan setelah update soal
app.put('/tampilansoal/:id_exam_questions', (req, res) => {
    const id_exam_question = req.params.id_exam_question;
    const { id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = req.body;
    
    const sql = `UPDATE exam_question SET id_babmateri=?, pertanyaan=?, pilihan_a=?, pilihan_b=?, pilihan_c=?, pilihan_d=?, pilihan_benar=?, tingkat_kesulitan=? WHERE id_exam_questions = ?`;
    
    db.query(sql, [id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan, id_exam_question], (error, result) => {
        if (error) {
            res.status(500).send({ error: 'Gagal mengedit data' })
        } else {
            res.redirect('/tampilansoal', { msg: 'Soal berhasil diubah' })
        }
    })
})

//tampilan detail soal
app.get('/tampilansoal/:id_exam_questions', (req, res) => {
    const id_exam_questions = req.params.id_exam_questions
    const sql1 = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    const sql2 = `SELECT * FROM exam_questions WHERE id_exam_questions = ${id_exam_questions}`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            res.render('editsoal', {babmateri:result1, exam_questions:result2[0]})
        })
    })
})

// Update Soal berdasarkan id_exam_questions
app.put('/soal/:id_exam_question', (req, res) => {
    const id_exam_question = req.params.id_exam_question;
    const { id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = req.body;
    
    const sql = `UPDATE exam_question SET id_babmateri=?, pertanyaan=?, pilihan_a=?, pilihan_b=?, pilihan_c=?, pilihan_d=?, pilihan_benar=?, tingkat_kesulitan=? WHERE id_exam_questions = ?`;
    
    db.query(sql, [id_babmateri, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan, id_exam_question], (error, result) => {
        if (error) {
            res.status(500).send({ error: 'Gagal mengedit data' })
        } else {
            res.send({ msg: 'Soal berhasil diubah' })
        }
    })
})

//upload soal
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/upload-bank-soal', upload.single('bankSoalFile'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        const bankSoalSheet = workbook.Sheets[workbook.SheetNames[0]];
        // const bankJawabanSheet = workbook.Sheets[workbook.SheetNames[1]];

        const exam_questions = xlsx.utils.sheet_to_json(bankSoalSheet);
        // const dataJawaban = xlsx.utils.sheet_to_json(bankJawabanSheet);

        for (const row of exam_questions) {
            const { id_babmateri, tingkat_kesulitan, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar } = row;

            // Check for undefined values and set them to null
            const id_babmateriValue = id_babmateri || null;
            const tingkatKesulitanValue = tingkat_kesulitan || null;
            const pertanyaanValue = pertanyaan || null;
            const pilihan_aValue = pilihan_a || null;
            const pilihan_bValue = pilihan_b || null;
            const pilihan_cValue = pilihan_c || null;
            const pilihan_dValue = pilihan_d || null;
            const pilihan_benarValue = pilihan_benar || null;
            
            const sql = `INSERT INTO exam_questions (id_babmateri, tingkat_kesulitan, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [id_babmateriValue, tingkatKesulitanValue, pertanyaanValue, pilihan_aValue, pilihan_bValue, pilihan_cValue, pilihan_dValue, pilihan_benarValue];

            await db.query(sql, values);
        }

        res.send('Bank soal berhasil diunggah!');

        // db.end(); // No need to end the connection here if you plan to reuse it.
    } catch (error) {
        console.error('Error uploading and importing data:', error);
        res.status(500).send('An error occurred while uploading and importing data.');
    }
});

//get tampilan upload soal
app.get('/tampilanuploadsoal', (req, res) => {
    res.render('uploadsoal')
        // res.send({paketsoal:result})
})

//get tambah soal
app.get('/tambahsoal', (req, res) => {
    const sql = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    db.query(sql, (error, result) => {
        res.render('tambahsoal', { babmateri:result })
    })
})

// paket soal
//get paket soal 
app.get('/paketsoal', (req, res) => {
    const sql = `SELECT id_paket_soal, judul, kode_paket, jumlah_soal FROM paket_soal`
    db.query(sql, (error, result) => {
        res.send({paketsoal:result})
    })
})

//get tampilan paket soal 
app.get('/tampilanpaketsoal', (req, res) => {
    const sql = `SELECT id_paket_soal, judul, kode_paket, jumlah_soal FROM paket_soal`
    db.query(sql, (error, result) => {
        res.render('paketsoal', {paket_soal:result})
        // res.send({paketsoal:result})
    })
})

//get tampilan detail paket soal
app.get('/tampilanpaketsoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlSoalUjian = `SELECT exam_questions.pertanyaan, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d FROM preview_exam_questions INNER JOIN exam_questions ON preview_exam_questions.id_exam_questions=exam_questions.id_exam_questions WHERE preview_exam_questions.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlSoalUjian, (error, result2) => {
                res.render('detailpaketsoal', {paket_soal:result1[0], exam_questions:result2})
            })
        }
    })
})

// get tampilan setujui detail paket soal
app.get('/tampilansetujuipaketsoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlSoalUjian = `SELECT exam_questions.tingkat_kesulitan, exam_questions.pertanyaan, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d FROM preview_exam_questions INNER JOIN exam_questions ON preview_exam_questions.id_exam_questions=exam_questions.id_exam_questions WHERE preview_exam_questions.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlSoalUjian, (error, result2) => {
                res.render('setujuidetailpaketsoal', {paket_soal:result1[0], exam_questions:result2})
            })
        }
    })
})

//post/insert paket soal
app.post('/paketsoal', (req, res) => {
    const { judul, kode_paket, jumlah_soal } = req.body
    const sql = `INSERT INTO paket_soal (id_paket_soal, judul, kode_paket, jumlah_soal) VALUES (NULL, '${judul}', '${kode_paket}', '${jumlah_soal}')`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Paket Soal berhasil dibuat'})
    })
})

//detail paket soal
app.get('/paketsoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlSoalUjian = `SELECT exam_questions.pertanyaan, exam_questions.pilihan_a, exam_questions.pilihan_b, exam_questions.pilihan_c, exam_questions.pilihan_d FROM preview_exam_questions INNER JOIN exam_questions ON preview_exam_questions.id_exam_questions=exam_questions.id_exam_questions WHERE preview_exam_questions.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlSoalUjian, (error, result2) => {
                res.send({paket_soal:result1[0], preview_exam_questions:result2})
            })
        }
    })
})

//delete paket soal
app.delete('/paketsoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sql = `DELETE FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Paket Soal berhasil dihapus'})
    })
})

//update paket soal
app.put('/paketsoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const { judul, kode_paket, jumlah_soal } = req.body;
    
    const sql = `UPDATE paket_soal SET judul = '${judul}', kode_paket = '${kode_paket}', jumlah_soal = '${jumlah_soal}' WHERE id_paket_soal = ${id_paket_soal}`
    
    db.query(sql, (error, result) => {
        if (error) {
            res.status(500).send({ error: 'Gagal mengubah data' });
        } else {
            res.send({ msg: 'Paket Soal berhasil diubah' })
        }
    });
});


//konfigurasi 
//get konfigurasi
app.get('/konfigurasi', (req, res) => {
    const id_examdetail = req.params.id_examdetail
    const sql = `SELECT paket_soal.judul, paket_soal.kode_paket, paket_soal.jumlah_soal, exam_detail.id_examdetail, babmateri.nama_babmateri, exam_detail.persentase_babmateri, exam_detail.persentase_mudah, exam_detail.persentase_sedang, exam_detail.persentase_sulit FROM exam_detail INNER JOIN paket_soal INNER JOIN babmateri ON exam_detail.id_paket_soal = paket_soal.id_paket_soal AND exam_detail.id_babmateri=babmateri.id_babmateri`
    // `SELECT * FROM exam_detail`
    db.query(sql, (error, result) => {
        res.send({exam_detail:result})
    })
})

//get detail konfigurasi
app.get('/konfigurasi/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlTopikUjian = `SELECT exam_detail.id_examdetail, babmateri.nama_babmateri, exam_detail.persentase_babmateri, exam_detail.persentase_mudah, exam_detail.persentase_sedang, exam_detail.persentase_sulit FROM exam_detail INNER JOIN babmateri ON exam_detail.id_babmateri=babmateri.id_babmateri WHERE exam_detail.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlTopikUjian, (error, result2) => {
                res.send({paket_soal:result1[0], exam_detail:result2})
            })
        }
    })
})
//insert konfigurasi
app.post('/konfigurasi', (req, res) => {
    const { id_paket_soal, id_babmateri, persentase_babmateri, persentase_mudah, persentase_sedang, persentase_sulit } = req.body
    const sql1 = `INSERT INTO exam_detail (id_examdetail, id_paket_soal, id_babmateri, persentase_babmateri, persentase_mudah, persentase_sedang, persentase_sulit) VALUES (NULL, '${id_paket_soal}', '${id_babmateri}', '${persentase_babmateri}', '${persentase_mudah}', '${persentase_sedang}', '${persentase_sulit}')`
    const sql2 = `SELECT id_examdetail FROM exam_detail ORDER BY id_exam DESC LIMIT 1`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            res.send({ msg: 'Konfigurasi berhasil dibuat' })
        })
    })
})

//get tampilan konfigurasi
app.get('/tampilankonfigurasi', (req, res) => {
    const id_examdetail = req.params.id_examdetail
    const sql = `SELECT paket_soal.judul, paket_soal.kode_paket, paket_soal.jumlah_soal, exam_detail.id_examdetail, babmateri.nama_babmateri, exam_detail.persentase_babmateri, exam_detail.persentase_mudah, exam_detail.persentase_sedang, exam_detail.persentase_sulit FROM exam_detail INNER JOIN paket_soal INNER JOIN babmateri ON exam_detail.id_paket_soal = paket_soal.id_paket_soal AND exam_detail.id_babmateri=babmateri.id_babmateri`
    // `SELECT * FROM exam_detail`
    db.query(sql, (error, result) => {
        // res.send({exam_detail:result})
        res.render('konfigurasi', {paket_soal:result})
    })
})

//get tampilan detail konfigurasi
app.get('/tampilankonfigurasi/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlBabMateri = `SELECT id_babmateri, nama_babmateri FROM babmateri`
    const sqlTopikUjian = `SELECT exam_detail.id_examdetail, babmateri.nama_babmateri, exam_detail.persentase_babmateri, exam_detail.persentase_mudah, exam_detail.persentase_sedang, exam_detail.persentase_sulit FROM exam_detail INNER JOIN babmateri ON exam_detail.id_babmateri=babmateri.id_babmateri WHERE exam_detail.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlTopikUjian, (error, result2) => {
                db.query(sqlBabMateri, (error, result3) => {
                // res.render('editkonfigurasi', {exam:result1[0], babmateri:result2, exam_detail:result3})
                    res.render('editkonfigurasi', {paket_soal:result1[0], exam_detail:result2, babmateri:result3})
                })
            })
        }
    })
})

//delete konfigurasi
app.delete('/konfigurasi/:id_examdetail', (req, res) => {
    const id_examdetail = req.params.id_examdetail
    const sql = `DELETE FROM exam_detail WHERE id_examdetail = ${id_examdetail}`
    db.query(sql, (error, result) => {
        res.send({msg :'Konfigurasi berhasil dihapus'})
    })
})

//paket soal
app.post('/paketsoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal

    // Cek konfigurasi paket soal
    async function checkConfig(id_paket_soal) {
        try {
            const sqlCheckConfig = `SELECT ROUND(SUM(persentase_babmateri), 2) AS 'total' FROM exam_detail WHERE id_paket_soal = ?`
            const result = await new Promise((resolve, reject) => {
                db.query(sqlCheckConfig, [ id_paket_soal ], (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
            })
            return result[0].total
        } catch (error) {
            return res.status(500).json({ message: 'Ada kesalahan!' })
        }
    }
    
    // Hitung soal yang diperlukan
    async function getNumofSoal(id_paket_soal) {
        try {
            const sqlPaketsoal = `SELECT jumlah_soal FROM paket_soal WHERE id_paket_soal = ?`
            const jumlah_soal = await new Promise((resolve, reject) => {
                db.query(sqlPaketsoal, [ id_paket_soal ], (error, result) => {
                    if (error) reject(error)
                    else resolve(result[0].jumlah_soal)
                })
            })
            const sqlTopikujian = `SELECT id_babmateri, ROUND((persentase_mudah * persentase_babmateri * ${ jumlah_soal }), 0) AS 'soal_mudah', ROUND((persentase_sedang * persentase_babmateri * ${ jumlah_soal }), 0) AS 'soal_sedang', ROUND((persentase_sulit * persentase_babmateri * ${ jumlah_soal }), 0) AS 'soal_sulit' FROM exam_detail WHERE id_paket_soal = ?`
            const requiredSoal = await new Promise((resolve, reject) => {
                db.query(sqlTopikujian, [ id_paket_soal ], (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
            })
            return requiredSoal
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menghitung jumlah soal yang diperlukan!'})
        }
    }

    // Periksa ketersediaan soal
    async function checkSoal(requiredSoal) {
        try {
            const statuses = await Promise.all(requiredSoal.map(async (result) => {
                let idbabmateri = result.id_babmateri
                let soalRequired = [result.soal_mudah, result.soal_sedang, result.soal_sulit]
                for (let i = 0; i < 3; i++) {
                    let sqlCekSoal = `SELECT COUNT(id_babmateri) AS 'jumlah' FROM exam_questions WHERE id_babmateri = ${ idbabmateri } AND tingkat_kesulitan = ${ i+1 }`
                    let soaltersedia = await new Promise((resolve, reject) => {
                        db.query(sqlCekSoal, (error, result) => {
                            if (error) reject(error)
                            else resolve(result[0].jumlah)
                        })
                    })
                    if (soaltersedia < soalRequired[i]) { return 'tidak tesedia' }
                }
                return 'tersedia'
            }))
            return statuses.includes('tidak tesedia') ? 'tidak tesedia' : 'tersedia'
        } catch (error) {
            return res.status(500).json({ message: 'Gagal memeriksa ketersediaan soal!' })
        }
    }

    // Generate soal random
    async function getRandomSoal(requiredSoal) {
        try {
            const draft = await Promise.all(requiredSoal.map(async (result) => {
                let idbabmateri = result.id_babmateri
                let soalRequired = [result.soal_mudah, result.soal_sedang, result.soal_sulit]
                let soals = await Promise.all(soalRequired.map(async (required, j) => {
                    let sqlSoalUjian = `SELECT id_exam_questions FROM exam_questions WHERE id_babmateri = ${ idbabmateri } AND tingkat_kesulitan = ${ j+1 } ORDER BY RAND() LIMIT ${ required }`
                    let random = await new Promise((resolve, reject) => {
                        db.query(sqlSoalUjian, (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        })
                    })
                    return random
                }))
                return [].concat(...soals)
                // return [].concat(...exam_questionss)
            }))
            return [].concat(...draft)
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menghasilkan random soal' })
        }
    }

    // Jalankan fungsi
    async function runFunction(id) {
        try {
            const totalPersenTopik = await checkConfig(id)
            if (totalPersenTopik == 1.00) {
                const requiredSoal = await getNumofSoal(id)
                let status = await checkSoal(requiredSoal)
                if (status == 'tersedia') {
                    let draft = await getRandomSoal(requiredSoal)
                    
                    // Menyimpan draft paket soal
                    let json = JSON.stringify(draft)
                    const dataArray = JSON.parse(json)
                    const values = dataArray.map(function(item) {
                        return `(NULL, ${ id }, ` + item.id_exam_questions + ")"
                    }).join(", ")
                    const sqlInsert = "INSERT INTO preview_exam_questions (id_preview, id_paket_soal, id_exam_questions) VALUES " + values
                    const sqlSearch = `SELECT * FROM preview_exam_questions WHERE id_paket_soal = ?`
                    const sqlDelete = `DELETE FROM preview_exam_questions WHERE id_paket_soal = ?`
                    const sqlkode = `UPDATE paket_soal SET kode_paket = ROUND(RAND()*(999999-100000)+100000, 0) WHERE id_paket_soal = ?`
                    db.query(sqlSearch, [ id_paket_soal ], (error, result) => {
                        if (error) {
                            return res.status(500).json({ message: 'Ada kesalahan!' })
                        }
                        
                        if (result.length) {
                            db.query(sqlDelete, [ id_paket_soal ], (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Soal ujian tidak berhasil dihapus!' })
                                }
                                db.query(sqlInsert, (error, result) => {
                                    if (error) {
                                        return res.status(500).json({ message: 'Paket soal tidak berhasil dibuat!' })
                                    } else {
                                        db.query(sqlkode, [ id_paket_soal ], (error, result) => {
                                            if (error) {
                                                return res.status(500).json({ message: 'Ada kesalahan!' })
                                            } else {
                                                return res.status(200).json({ message: 'Paket soal berhasil dibuat!' })
                                            }
                                        })
                                    }
                                })
                            })
                        } else {
                            db.query(sqlInsert, (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Paket soal tidak berhasil dibuat!' })
                                } else {
                                    db.query(sqlkode, [ id_paket_soal ], (error, result) => {
                                        if (error) {
                                            return res.status(500).json({ message: 'Ada kesalahan!' })
                                        } else {
                                            return res.status(200).json({ message: 'Paket soal berhasil dibuat!' })
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    return res.status(500).json({ message: 'Soal yang tersedia tidak cukup!' })
                }
            } else {
                return res.status(500).json({ message: "Jumlah persentase babmateri harus tepat sama dengan 1 !" })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error' })
        }
    }

    runFunction(id_paket_soal)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })