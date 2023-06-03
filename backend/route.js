module.exports = (app, pool) => {
  
    let lastInsertedId = 0; // Menyimpan ID terakhir yang diinsert

    app.post('/register', async (req, res) => {
        const { id_role, nama, npm, username, password, id_kelompok, kode_aslab } = req.body;

        try {
            const client = await pool.connect();

            const getNextIdQuery = `
            SELECT id_akun FROM akun
            ORDER BY id_akun DESC
            LIMIT 1
            `;
            const getNextIdResult = await client.query(getNextIdQuery);

            if (getNextIdResult.rows.length > 0) {
            lastInsertedId = getNextIdResult.rows[0].id_akun; // Mengupdate lastInsertedId dengan ID terakhir yang ada di tabel
            }

            const newId = lastInsertedId + 1; // Menghitung ID baru

            const akunQuery = `
            INSERT INTO akun (id_akun, id_role, nama, npm, username, password)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
            `;
            const akunValues = [newId, id_role, nama, npm, username, password];

            const akunResult = await client.query(akunQuery, akunValues);
            const akunData = akunResult.rows[0];

            let roleSpecificData;
            if (id_role == 0) {
            // Insert into praktikan table
            const praktikanQuery = `
                INSERT INTO praktikan (id_akun, id_kelompok)
                VALUES ($1, $2)
                RETURNING *
            `;
            const praktikanValues = [akunData.id_akun, id_kelompok];

            const praktikanResult = await client.query(praktikanQuery, praktikanValues);
            roleSpecificData = praktikanResult.rows[0];
            } else if (id_role == 1) {
            // Insert into asisten table
            const asistenQuery = `
                INSERT INTO asisten (id_akun, kode_aslab)
                VALUES ($1, $2)
                RETURNING *
            `;
            const asistenValues = [akunData.id_akun, kode_aslab];

            const asistenResult = await client.query(asistenQuery, asistenValues);
            roleSpecificData = asistenResult.rows[0];
            }

            res.status(201).json({
            akun: akunData,
            roleSpecificData: roleSpecificData
            });

            lastInsertedId = newId; // Mengupdate lastInsertedId dengan ID yang baru saja diinsert

            client.release();
        } catch (error) {
            console.error('Kesalahan saat menyimpan akun:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        try {
            const client = await pool.connect();

            // Cari akun berdasarkan username
            const findAkunQuery = `
            SELECT * FROM akun WHERE username = $1
            `;
            const findAkunValues = [username];
            const findAkunResult = await client.query(findAkunQuery, findAkunValues);

            // Jika akun tidak ditemukan
            if (findAkunResult.rows.length === 0) {
            return res.status(404).json({ error: 'Akun tidak ditemukan' });
            }

            const akun = findAkunResult.rows[0];

            // Verifikasi password
            if (akun.password === password) {
            // Password benar, berikan token atau berikan respon sesuai kebutuhan aplikasi
            return res.status(200).json({ message: 'Login berhasil', id_akun: akun.id_akun });
            } else {
            // Password salah
            return res.status(401).json({ error: 'Kombinasi username dan password salah' });
            }

            client.release();
        } catch (error) {
            console.error('Kesalahan saat proses login:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });


    app.post('/kelompok', async (req, res) => {
        const { id_asisten, tahun1, tahun2, nama_kelompok, semester } = req.body;

        // Validasi tahun2 harus lebih besar dari tahun1
        if (tahun2 <= tahun1) {
            return res.status(400).json({ error: 'Tahun kedua harus lebih besar dari tahun pertama' });
        }

        try {
            const client = await pool.connect();

            // Gabungkan tahun1 dan tahun2 menjadi format <tahun1>/<tahun2>
            const tahunAjaran = `${tahun1}/${tahun2}`;

            // Insert data ke tabel kelompok
            const insertKelompokQuery = `
            INSERT INTO kelompok (id_kelompok, id_asisten, nama_kelompok, semester, tahun_ajaran)
            VALUES (nextval('id_kelompok_sequence'), $1, $2, $3, $4)
            RETURNING id_kelompok
            `;
            const insertKelompokValues = [id_asisten, nama_kelompok, semester, tahunAjaran];
            const insertKelompokResult = await client.query(insertKelompokQuery, insertKelompokValues);
            const kelompokId = insertKelompokResult.rows[0].id_kelompok;

            res.status(201).json({ message: 'Data kelompok berhasil ditambahkan', id_kelompok: kelompokId });
            client.release();
        } catch (error) {
            console.error('Kesalahan saat menambahkan data kelompok:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.post('/barang', async (req, res) => {
        const { harga, jumlah_tersedia } = req.body;

        try {
            const client = await pool.connect();

            // Insert data ke tabel barang
            const insertBarangQuery = `
            INSERT INTO barang (harga, jumlah_tersedia)
            VALUES ($1, $2)
            RETURNING id_barang
            `;
            const insertBarangValues = [harga, jumlah_tersedia];
            const insertBarangResult = await client.query(insertBarangQuery, insertBarangValues);
            const barangId = insertBarangResult.rows[0].id_barang;

            res.status(201).json({ message: 'Data barang berhasil ditambahkan', id_barang: barangId });
            client.release();
        } catch (error) {
            console.error('Kesalahan saat menambahkan data barang:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.put('/barang/:id_barang', async (req, res) => {
        const { id_barang, harga, jumlah_tersedia, nama_barang } = req.body;

        try {
            const client = await pool.connect();

            const updateBarangQuery = `
            UPDATE barang
            SET harga = $1, jumlah_tersedia = $2, nama_barang = $3
            WHERE id_barang = $4
            RETURNING *
            `;
            const updateBarangValues = [harga, jumlah_tersedia, nama_barang, id_barang];

            const updateBarangResult = await client.query(updateBarangQuery, updateBarangValues);
            const updatedBarang = updateBarangResult.rows[0];

            res.status(200).json(updatedBarang);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mengubah data barang:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.get('/barang', async (req, res) => {
        try {
            const client = await pool.connect();

            const getBarangQuery = `
            SELECT * FROM barang
            `;

            const getBarangResult = await client.query(getBarangQuery);
            const barang = getBarangResult.rows;

            res.status(200).json(barang);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mendapatkan data barang:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.get('/barang/:id_barang', async (req, res) => {
        const { id_barang } = req.params;

        try {
            const client = await pool.connect();

            const getBarangQuery = `
            SELECT * FROM barang WHERE id_barang = $1
            `;
            const getBarangValues = [id_barang];

            const getBarangResult = await client.query(getBarangQuery, getBarangValues);
            const barang = getBarangResult.rows[0];

            if (barang) {
            res.status(200).json(barang);
            } else {
            res.status(404).json({ error: 'Data barang tidak ditemukan' });
            }

            client.release();
        } catch (error) {
            console.error('Kesalahan saat mendapatkan data barang:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.post('/peminjaman', async (req, res) => {
        const { id_barang, jumlah_dipinjam, id_praktikan } = req.body;

        try {
            const client = await pool.connect();

            const insertPeminjamanQuery = `
            INSERT INTO peminjaman (id_barang, jumlah_dipinjam, id_praktikan)
            VALUES ($1, $2, $3)
            RETURNING *
            `;
            const insertPeminjamanValues = [id_barang, jumlah_dipinjam, id_praktikan];

            const insertPeminjamanResult = await client.query(insertPeminjamanQuery, insertPeminjamanValues);
            const peminjaman = insertPeminjamanResult.rows[0];

            res.status(201).json(peminjaman);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat memasukkan data peminjaman:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.get('/peminjaman', async (req, res) => {
        try {
            const client = await pool.connect();
            const query = 'SELECT * FROM peminjaman';
            const result = await client.query(query);
            const peminjaman = result.rows;
            res.status(200).json(peminjaman);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mengambil data peminjaman:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });


    app.get('/peminjaman/:id_praktikan', async (req, res) => {
        const { id_praktikan } = req.body;

        try {
            const client = await pool.connect();

            const query = `
            SELECT * FROM peminjaman WHERE id_praktikan = $1
            `;
            const values = [id_praktikan];

            const result = await client.query(query, values);
            const peminjaman = result.rows;

            res.status(200).json(peminjaman);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mengambil data peminjaman:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.post('/pengembalian', async (req, res) => {
        const { id_peminjaman, jumlah_dikembalikan, bukti_pembayaran, waktu_pengembalian } = req.body;

        try {
            const client = await pool.connect();

            // Ambil informasi peminjaman berdasarkan id_peminjaman
            const getPeminjamanQuery = `
            SELECT * FROM peminjaman WHERE id_peminjaman = $1
            `;
            const getPeminjamanValues = [id_peminjaman];
            const peminjamanResult = await client.query(getPeminjamanQuery, getPeminjamanValues);
            const peminjaman = peminjamanResult.rows[0];

            if (!peminjaman) {
            return res.status(404).json({ error: 'Data peminjaman tidak ditemukan' });
            }

            // Hitung jumlah hari terlambat
            const waktuPengembalian = waktu_pengembalian ? new Date(waktu_pengembalian) : new Date();
            const tenggatWaktu = new Date(peminjaman.tenggat_waktu);
            const selisihHari = Math.floor((waktuPengembalian - tenggatWaktu) / (1000 * 60 * 60 * 24));
            const denda = selisihHari > 0 ? selisihHari * 1000 : 0;

            // Ambil informasi barang berdasarkan id_barang pada peminjaman
            const getBarangQuery = `
            SELECT * FROM barang WHERE id_barang = $1
            `;
            const getBarangValues = [peminjaman.id_barang];
            const barangResult = await client.query(getBarangQuery, getBarangValues);
            const barang = barangResult.rows[0];

            if (!barang) {
            return res.status(404).json({ error: 'Data barang tidak ditemukan' });
            }

            // Hitung nilai ganti rugi
            const gantiRugi = (peminjaman.jumlah_dipinjam - jumlah_dikembalikan) * barang.harga;

            // Hitung total sanksi
            const totalSanksi = denda + gantiRugi;

            // Insert data ke tabel pengembalian
            const insertPengembalianQuery = `
            INSERT INTO pengembalian (id_peminjaman, jumlah_dikembalikan, waktu_pengembalian, denda, ganti_rugi, total_sanksi, bukti_pembayaran)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            `;
            const insertPengembalianValues = [id_peminjaman, jumlah_dikembalikan, waktuPengembalian, denda, gantiRugi, totalSanksi, bukti_pembayaran];
            const insertPengembalianResult = await client.query(insertPengembalianQuery, insertPengembalianValues);
            const pengembalian = insertPengembalianResult.rows[0];

            res.status(201).json(pengembalian);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat melakukan pengembalian:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.get('/pengembalian', async (req, res) => {
        try {
            const client = await pool.connect();

            // Ambil semua data pengembalian
            const getPengembalianQuery = 'SELECT * FROM pengembalian';
            const getPengembalianResult = await client.query(getPengembalianQuery);
            const pengembalian = getPengembalianResult.rows;

            res.status(200).json(pengembalian);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mengambil data pengembalian:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });


    app.get('/pengembalian/:id_praktikan', async (req, res) => {
        const { id_praktikan } = req.body;

        try {
            const client = await pool.connect();

            // Ambil data peminjaman berdasarkan id_praktikan
            const getPeminjamanQuery = 'SELECT id_peminjaman FROM peminjaman WHERE id_praktikan = $1';
            const getPeminjamanValues = [id_praktikan];
            const getPeminjamanResult = await client.query(getPeminjamanQuery, getPeminjamanValues);
            const peminjamanIds = getPeminjamanResult.rows.map(row => row.id_peminjaman);

            // Ambil data pengembalian berdasarkan id_peminjaman
            const getPengembalianQuery = 'SELECT * FROM pengembalian WHERE id_peminjaman = ANY($1)';
            const getPengembalianValues = [peminjamanIds];
            const getPengembalianResult = await client.query(getPengembalianQuery, getPengembalianValues);
            const pengembalian = getPengembalianResult.rows;

            res.status(200).json(pengembalian);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mengambil data pengembalian:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.get('/akun/:id_akun', async (req, res) => {
        const { id_akun } = req.body;

        try {
            const client = await pool.connect();

            // Ambil data pengguna berdasarkan id_akun
            const getAkunQuery = 'SELECT * FROM akun WHERE id_akun = $1';
            const getAkunValues = [id_akun];
            const getAkunResult = await client.query(getAkunQuery, getAkunValues);
            const akun = getAkunResult.rows;

            res.status(200).json(akun);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mengambil data akun:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    app.put('/akun/:id_akun', async (req, res) => {
        const { id_akun } = req.body;
        const { nama, npm, username, password, id_kelompok, kode_aslab } = req.body;

        try {
            const client = await pool.connect();

            // Periksa id_role dari akun yang akan diperbarui
            const getAkunQuery = 'SELECT id_role FROM akun WHERE id_akun = $1';
            const getAkunValues = [id_akun];
            const getAkunResult = await client.query(getAkunQuery, getAkunValues);
            const id_role = getAkunResult.rows[0].id_role;

            let updateQuery = '';
            let updateValues = [];

            // Periksa id_role untuk menentukan tabel yang akan diperbarui
            if (id_role == 0) {
            // Akun dengan id_role = 0 adalah praktikan
            updateQuery = 'UPDATE praktikan SET id_kelompok = $1 WHERE id_akun = $2';
            updateValues = [id_kelompok, id_akun];
            } else if (id_role == 1) {
            // Akun dengan id_role = 1 adalah asisten
            updateQuery = 'UPDATE asisten SET kode_aslab = $1 WHERE id_akun = $2';
            updateValues = [kode_aslab, id_akun];
            } else {
            // Jika id_role tidak valid, kirimkan respons dengan kode status 400
            return res.status(400).json({ error: 'ID role tidak valid' });
            }

            // Lakukan pembaruan pada tabel yang sesuai
            updateQuery = 'UPDATE akun SET nama = $1, username = $2, password = $3 WHERE id_akun = $4';
            updateValues = [nama, username, password, id_akun];
            await client.query(updateQuery, updateValues);

            res.status(200).json({ message: 'Data akun berhasil diperbarui' });
            client.release();
        } catch (error) {
            console.error('Kesalahan saat memperbarui data akun:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    const port = 3000; // Port yang akan digunakan oleh server

    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });

}