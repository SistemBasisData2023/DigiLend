module.exports = (app, pool) => {
  
    const bcrypt = require('bcrypt');
    let lastInsertedId = 0; // Menyimpan ID terakhir yang diinsert

    // Middleware untuk memeriksa session
    const checkAuth = (req, res, next) => {
      if (req.session.loggedIn) {
        // Jika session loggedIn = true, lanjutkan ke rute selanjutnya
        next();
      } else {
        // Jika session tidak ada atau loggedIn = false, kembalikan respons error
        res.status(401).json({ error: 'Akses ditolak' });
      }
    };   
    
    ///                  ///
    /// REGISTER & LOGIN ///
    ///                  ///

    app.post('/register', async (req, res) => {
        const { id_role, nama, npm, username, password, nama_kelompok, kode_aslab } = req.body;
      
        try {
          const client = await pool.connect();
      
          if (!kode_aslab && !nama_kelompok) {
            throw new Error('Kode Aslab atau Nama Kelompok harus diisi');
          }
      
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
      
          const hashedPassword = await bcrypt.hash(password, 10); // Mengenkripsi password
      
          const akunQuery = `
            INSERT INTO akun (id_akun, id_role, nama, npm, username, password)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *
          `;
          const akunValues = [newId, id_role, nama, npm, username, hashedPassword]; // Menggunakan password yang telah dienkripsi
      
          const akunResult = await client.query(akunQuery, akunValues);
          const akunData = akunResult.rows[0];
      
          let roleSpecificData;
          if (id_role == 0) {
            if (!nama_kelompok) {
              throw new Error('Nama kelompok harus diisi');
            }
      
            const kelompokQuery = `
              SELECT id_kelompok FROM kelompok WHERE nama_kelompok = $1
            `;
            const kelompokValues = [nama_kelompok];
      
            const kelompokResult = await client.query(kelompokQuery, kelompokValues);
      
            if (kelompokResult.rows.length > 0) {
              const praktikanQuery = `
                INSERT INTO praktikan (id_akun, id_kelompok)
                VALUES ($1, $2)
                RETURNING *
              `;
              const praktikanValues = [akunData.id_akun, kelompokResult.rows[0].id_kelompok];
      
              const praktikanResult = await client.query(praktikanQuery, praktikanValues);
              roleSpecificData = praktikanResult.rows[0];
            } else {
              throw new Error('Kelompok tidak ditemukan');
            }
          } else if (id_role == 1) {
            if (!kode_aslab) {
              throw new Error('Kode Aslab harus diisi');
            }
      
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
          const passwordMatch = await bcrypt.compare(password, akun.password); // Membandingkan password dengan hash yang tersimpan di database
      
          if (passwordMatch) {
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

    ///        ///
    /// Barang ///
    ///        ///

    app.post('/barang', async (req, res) => {
      const { harga, jumlah_tersedia, nama_barang } = req.body;
  
      try {
          const client = await pool.connect();
  
          // Insert data ke tabel barang
          const insertBarangQuery = `
          INSERT INTO barang (harga, jumlah_tersedia, nama_barang)
          VALUES ($1, $2, $3)
          RETURNING id_barang
          `;
          const insertBarangValues = [harga, jumlah_tersedia, nama_barang];
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
            ORDER BY nama_barang ASC
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
        const { id_barang } = req.body;

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

    ///            ///
    /// PEMINJAMAN ///
    ///            ///

    app.post('/peminjaman', async (req, res) => {
      const { id_barang, jumlah_dipinjam, id_praktikan } = req.body;
    
      try {
        const client = await pool.connect();
    
        // Ambil informasi barang berdasarkan id_barang
        const getBarangQuery = `
          SELECT * FROM barang WHERE id_barang = $1
        `;
        const getBarangValues = [id_barang];
        const barangResult = await client.query(getBarangQuery, getBarangValues);
        const barang = barangResult.rows[0];
    
        if (!barang) {
          return res.status(404).json({ error: 'Data barang tidak ditemukan' });
        }
    
        if (jumlah_dipinjam > barang.jumlah_tersedia) {
          return res.status(400).json({ error: 'Jumlah dipinjam melebihi jumlah tersedia' });
        }
    
        // Kurangi jumlah_tersedia di tabel barang
        const updateBarangQuery = `
          UPDATE barang
          SET jumlah_tersedia = jumlah_tersedia - $1
          WHERE id_barang = $2
        `;
        const updateBarangValues = [jumlah_dipinjam, id_barang];
        await client.query(updateBarangQuery, updateBarangValues);
    
        // Insert data ke tabel peminjaman
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
            const query = 'SELECT * FROM peminjaman ORDER BY waktu_peminjaman DESC';
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
            SELECT * FROM peminjaman WHERE id_praktikan = $1 ORDER BY waktu_peminjaman DESC
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

    app.delete('/peminjaman/:id_peminjaman', async (req, res) => {
      const idPeminjaman = req.body.id_peminjaman;
    
      try {
        const client = await pool.connect();
    
        // Periksa apakah data peminjaman dengan id_peminjaman yang sesuai memiliki nilai pada kolom id_pengembalian
        const checkPeminjamanQuery = `
          SELECT id_pengembalian FROM peminjaman WHERE id_peminjaman = $1
        `;
        const checkPeminjamanValues = [idPeminjaman];
        const checkPeminjamanResult = await client.query(checkPeminjamanQuery, checkPeminjamanValues);
        const idPengembalian = checkPeminjamanResult.rows[0].id_pengembalian;
    
        if (idPengembalian) {
          // Jika id_pengembalian tidak NULL, ubah nilainya menjadi NULL pada tabel peminjaman
          const updatePeminjamanQuery = `
            UPDATE peminjaman 
            SET id_pengembalian = NULL, returned = FALSE
            WHERE id_peminjaman = $1
          `;
          const updatePeminjamanValues = [idPeminjaman];
          await client.query(updatePeminjamanQuery, updatePeminjamanValues);
        }

        // Hapus data pengembalian dengan id_peminjaman yang sama
        const deletePengembalianQuery = `
          DELETE FROM pengembalian WHERE id_peminjaman = $1
        `;
        const deletePengembalianValues = [idPeminjaman];
        await client.query(deletePengembalianQuery, deletePengembalianValues);
    
        // Hapus data peminjaman dengan id_peminjaman yang sama
        const deletePeminjamanQuery = `
          DELETE FROM peminjaman WHERE id_peminjaman = $1
        `;
        const deletePeminjamanValues = [idPeminjaman];
        await client.query(deletePeminjamanQuery, deletePeminjamanValues);
    
        res.status(200).json({ message: 'Data peminjaman dan pengembalian berhasil dihapus' });
        client.release();
      } catch (error) {
        console.error('Kesalahan saat menghapus data peminjaman:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });    

    ///              ///
    /// PENGEMBALIAN ///
    ///              ///

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
    
        // Pastikan jumlah_dikembalikan tidak lebih dari jumlah_dipinjam
        if (jumlah_dikembalikan > peminjaman.jumlah_dipinjam) {
          return res.status(400).json({ error: 'Jumlah yang dikembalikan tidak boleh lebih dari jumlah yang dipinjam' });
        }
    
        // Hitung jumlah hari terlambat, denda, dan total sanksi
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
    
        // Tambahkan jumlah_tersedia di tabel barang
        const updateBarangQuery = `
          UPDATE barang
          SET jumlah_tersedia = jumlah_tersedia + $1
          WHERE id_barang = $2
        `;
        const updateBarangValues = [jumlah_dikembalikan, barang.id_barang];
        await client.query(updateBarangQuery, updateBarangValues);
    
        // Insert data ke tabel pengembalian
        const insertPengembalianQuery = `
          INSERT INTO pengembalian (id_peminjaman, jumlah_dikembalikan, waktu_pengembalian, denda, ganti_rugi, total_sanksi, bukti_pembayaran)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          RETURNING *
        `;
        const insertPengembalianValues = [id_peminjaman, jumlah_dikembalikan, waktuPengembalian, denda, gantiRugi, totalSanksi, bukti_pembayaran];
        const insertPengembalianResult = await client.query(insertPengembalianQuery, insertPengembalianValues);
        const pengembalian = insertPengembalianResult.rows[0];
    
        // Update kolom returned dan id_pengembalian pada tabel peminjaman
        const updatePeminjamanQuery = `
          UPDATE peminjaman
          SET returned = TRUE, id_pengembalian = $1
          WHERE id_peminjaman = $2
        `;
        const updatePeminjamanValues = [pengembalian.id_pengembalian, id_peminjaman];
        await client.query(updatePeminjamanQuery, updatePeminjamanValues);
    
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
            const getPengembalianQuery = 'SELECT * FROM pengembalian ORDER BY waktu_pengembalian DESC';
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
    
        // Ambil data pengembalian berdasarkan id_peminjaman yang diurutkan berdasarkan waktu_pengembalian secara menurun (descending)
        const getPengembalianQuery = 'SELECT * FROM pengembalian WHERE id_peminjaman = ANY($1) ORDER BY waktu_pengembalian DESC';
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

    app.delete('/pengembalian/:id_pengembalian', async (req, res) => {
      const idPengembalian = req.body.id_pengembalian;
    
      try {
        const client = await pool.connect();
    
        // Periksa data pengembalian dengan id_pengembalian yang sesuai
        const checkPengembalianQuery = `
          SELECT id_peminjaman FROM pengembalian WHERE id_pengembalian = $1
        `;
        const checkPengembalianValues = [idPengembalian];
        const checkPengembalianResult = await client.query(checkPengembalianQuery, checkPengembalianValues);
        const idPeminjaman = checkPengembalianResult.rows[0].id_peminjaman;
    
        if (idPeminjaman) {
          // Jika id_peminjaman tidak NULL, ubah nilainya menjadi NULL pada tabel peminjaman
          const updatePeminjamanQuery = `
            UPDATE peminjaman 
            SET id_pengembalian = NULL, returned = FALSE 
            WHERE id_peminjaman = $1
          `;
          const updatePeminjamanValues = [idPeminjaman];
          await client.query(updatePeminjamanQuery, updatePeminjamanValues);
        }
    
        // Hapus data pengembalian dengan id_pengembalian yang sesuai
        const deletePengembalianQuery = `
          DELETE FROM pengembalian WHERE id_pengembalian = $1
        `;
        const deletePengembalianValues = [idPengembalian];
        await client.query(deletePengembalianQuery, deletePengembalianValues);
    
        res.status(200).json({ message: 'Data pengembalian berhasil dihapus' });
        client.release();
      } catch (error) {
        console.error('Kesalahan saat menghapus data pengembalian:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });    

    ///          ///
    /// KELOMPOK ///
    ///          ///

    app.post('/kelompok', async (req, res) => {
      const { kode_aslab, tahun1, tahun2, nama_kelompok, semester } = req.body;
  
      // Validasi tahun2 harus lebih besar dari tahun1
      if (tahun2 <= tahun1) {
          return res.status(400).json({ error: 'Tahun kedua harus lebih besar dari tahun pertama' });
      }
  
      try {
          const client = await pool.connect();
  
          // Cari id_asisten berdasarkan kode_aslab
          const getAsistenQuery = 'SELECT id_akun FROM asisten WHERE kode_aslab = $1';
          const getAsistenValues = [kode_aslab];
          const getAsistenResult = await client.query(getAsistenQuery, getAsistenValues);
          const id_akun = getAsistenResult.rows[0].id_akun;
  
          // Gabungkan tahun1 dan tahun2 menjadi format <tahun1>/<tahun2>
          const tahunAjaran = `${tahun1}/${tahun2}`;
  
          // Insert data ke tabel kelompok
          const insertKelompokQuery = `
              INSERT INTO kelompok (id_kelompok, id_asisten, nama_kelompok, semester, tahun_ajaran)
              VALUES (nextval('id_kelompok_sequence'), $1, $2, $3, $4)
              RETURNING id_kelompok
          `;
          const insertKelompokValues = [id_akun, nama_kelompok, semester, tahunAjaran];
          const insertKelompokResult = await client.query(insertKelompokQuery, insertKelompokValues);
          const kelompokId = insertKelompokResult.rows[0].id_kelompok;
  
          res.status(201).json({ message: 'Data kelompok berhasil ditambahkan', id_kelompok: kelompokId });
          client.release();
      } catch (error) {
          console.error('Kesalahan saat menambahkan data kelompok:', error);
          res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });  

    app.get('/nama_kelompok', async (req, res) => {
      try {
        const client = await pool.connect();
    
        const getKelompokQuery = `
          SELECT nama_kelompok FROM kelompok
        `;
        const kelompokResult = await client.query(getKelompokQuery);
        const kelompok = kelompokResult.rows.map(row => row.nama_kelompok);
    
        res.status(200).json(kelompok);
        client.release();
      } catch (error) {
        console.error('Kesalahan saat mengambil data kelompok:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });    

    app.put('/kelompok/:id_kelompok', async (req, res) => {
      const { id_kelompok } = req.body;
      const { id_asisten, tahun1, tahun2, semester } = req.body;
    
      try {
        const client = await pool.connect();
    
        // Periksa apakah kelompok dengan id_kelompok tertentu ada di tabel kelompok
        const checkKelompokQuery = 'SELECT * FROM kelompok WHERE id_kelompok = $1';
        const checkKelompokValues = [id_kelompok];
        const checkKelompokResult = await client.query(checkKelompokQuery, checkKelompokValues);
        const kelompok = checkKelompokResult.rows[0];
    
        if (!kelompok) {
          return res.status(404).json({ error: 'Kelompok tidak ditemukan' });
        }
        
        // Gabungkan tahun1 dan tahun2 menjadi format <tahun1>/<tahun2>
        const tahunAjaran = `${tahun1}/${tahun2}`;
        
        // Update nilai-nilai pada tabel kelompok, kecuali id_kelompok dan nama_kelompok
        const updateKelompokQuery = `
          UPDATE kelompok
          SET id_asisten = $1, tahun_ajaran = $2, semester = $3
          WHERE id_kelompok = $4
        `;
        const updateKelompokValues = [id_asisten, tahunAjaran, semester, id_kelompok];
        await client.query(updateKelompokQuery, updateKelompokValues);
    
        res.status(200).json({ message: 'Data kelompok berhasil diperbarui' });
        client.release();
      } catch (error) {
        console.error('Kesalahan saat memperbarui data kelompok:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });
      
    app.delete('/kelompok/:id_kelompok', async (req, res) => {
      const { id_kelompok } = req.body;
    
      try {
        const client = await pool.connect();
    
        // Perbarui nilai id_kelompok pada akun menjadi 0
        const updateAkunQuery = 'UPDATE praktikan SET id_kelompok = 0 WHERE id_kelompok = $1';
        const updateAkunValues = [id_kelompok];
        await client.query(updateAkunQuery, updateAkunValues);
    
        // Hapus kelompok dengan id_kelompok tertentu
        const deleteKelompokQuery = 'DELETE FROM kelompok WHERE id_kelompok = $1';
        const deleteKelompokValues = [id_kelompok];
        await client.query(deleteKelompokQuery, deleteKelompokValues);
    
        res.status(200).json({ message: 'Kelompok berhasil dihapus' });
        client.release();
      } catch (error) {
        console.error('Kesalahan saat menghapus kelompok:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });    

    ///      ///
    /// AKUN ///
    ///      ///

    app.get('/akun', async (req, res) => {
      try {
        const client = await pool.connect();
    
        const getAkunQuery = `
          SELECT * FROM view_data_akun
        `;
        const akunResult = await client.query(getAkunQuery);
        const akun = akunResult.rows;
    
        res.status(200).json(akun);
        client.release();
      } catch (error) {
        console.error('Kesalahan saat mengambil data akun:', error);
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
        const { nama, npm, username, password, id_kelompok, kode_aslab, status_aslab } = req.body;

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
            updateQuery = 'UPDATE asisten SET kode_aslab = $1, status_aslab = $2 WHERE id_akun = $3';
            updateValues = [kode_aslab, status_aslab, id_akun];
            } else {
            // Jika id_role tidak valid, kirimkan respons dengan kode status 400
            return res.status(400).json({ error: 'ID role tidak valid' });
            }

            // Lakukan pembaruan pada tabel yang sesuai
            updateQuery = 'UPDATE akun SET nama = $1, username = $2, password = $3, npm = $4 WHERE id_akun = $5';
            updateValues = [nama, username, password, npm, id_akun];
            await client.query(updateQuery, updateValues);

            res.status(200).json({ message: 'Data akun berhasil diperbarui' });
            client.release();
        } catch (error) {
            console.error('Kesalahan saat memperbarui data akun:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });

    ///         ///
    /// ASISTEN ///
    ///         ///

    app.get('/kode_aslab', async (req, res) => {
        try {
            const client = await pool.connect();
          
            const query = `
                SELECT kode_aslab FROM asisten
                WHERE id_akun <> 0
            `;
            const result = await client.query(query);
            const kodeAslab = result.rows.map((row) => row.kode_aslab);
          
            res.status(200).json(kodeAslab);
            client.release();
        } catch (error) {
            console.error('Kesalahan saat mendapatkan data kode_aslab:', error);
            res.status(500).json({ error: 'Terjadi kesalahan server' });
        }
    });    

    app.get('/asisten', async (req, res) => {
      try {
        const client = await pool.connect();
    
        const getAkunQuery = `
          SELECT * FROM view_data_asisten
        `;
        const akunResult = await client.query(getAkunQuery);
        const akun = akunResult.rows;
    
        res.status(200).json(akun);
        client.release();
      } catch (error) {
        console.error('Kesalahan saat mengambil data akun:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });

    app.put('/asisten/:id_akun', async (req, res) => {
      const { id_akun } = req.body;
      const { status_aslab } = req.body;
  
      try {
          const client = await pool.connect();
  
          // Periksa apakah akun dengan id_akun yang diberikan adalah asisten
          const checkAsistenQuery = 'SELECT * FROM asisten WHERE id_akun = $1';
          const checkAsistenValues = [id_akun];
          const checkAsistenResult = await client.query(checkAsistenQuery, checkAsistenValues);
          const asisten = checkAsistenResult.rows[0];
  
          if (!asisten) {
              return res.status(404).json({ error: 'Data asisten tidak ditemukan' });
          }
  
          // Update nilai status_aslab pada tabel asisten
          const updateAsistenQuery = 'UPDATE asisten SET status_aslab = $1 WHERE id_akun = $2';
          const updateAsistenValues = [status_aslab, id_akun];
          await client.query(updateAsistenQuery, updateAsistenValues);
  
          res.status(200).json({ message: 'Nilai status_aslab berhasil diperbarui' });
          client.release();
      } catch (error) {
          console.error('Kesalahan saat memperbarui nilai status_aslab:', error);
          res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });

    app.delete('/asisten/:id_akun', async (req, res) => {
      const { id_akun } = req.body;
  
      try {
          const client = await pool.connect();
  
          // Periksa apakah akun yang akan dihapus adalah asisten
          const checkAsistenQuery = 'SELECT * FROM asisten WHERE id_akun = $1';
          const checkAsistenValues = [id_akun];
          const checkAsistenResult = await client.query(checkAsistenQuery, checkAsistenValues);
  
          let updateKelompokQuery = '';
          let updateKelompokValues = [];

          // Jika akun adalah asisten, perbarui data kolom id_asisten pada tabel kelompok menjadi NULL
          updateKelompokQuery = 'UPDATE kelompok SET id_asisten = 0 WHERE id_asisten = $1';
          updateKelompokValues = [id_akun];
          await client.query(updateKelompokQuery, updateKelompokValues);
  
          // Hapus data asisten dari tabel asisten
          const deleteAsistenQuery = 'DELETE FROM asisten WHERE id_akun = $1';
          const deleteAsistenValues = [id_akun];
          await client.query(deleteAsistenQuery, deleteAsistenValues);
  
          // Hapus data akun dari tabel akun
          const deleteAkunQuery = 'DELETE FROM akun WHERE id_akun = $1';
          const deleteAkunValues = [id_akun];
          await client.query(deleteAkunQuery, deleteAkunValues);
  
          res.status(200).json({ message: 'Data akun berhasil dihapus' });
          client.release();
      } catch (error) {
          console.error('Kesalahan saat menghapus data akun:', error);
          res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });

    ///           ///
    /// PRAKTIKAN ///
    ///           ///
    
    app.delete('/praktikan/:id_akun', async (req, res) => {
      const { id_akun } = req.body;
  
      try {
          const client = await pool.connect();
  
          const updatePeminjamanQuery = 'UPDATE peminjaman SET id_praktikan = 1 WHERE id_praktikan = $1';
          const updatePeminjamanValues = [id_akun];
          await client.query(updatePeminjamanQuery, updatePeminjamanValues);

          // Hapus data praktikan dari tabel praktikan
          const deletePraktikanQuery = 'DELETE FROM praktikan WHERE id_akun = $1';
          const deletePraktikanValues = [id_akun];
          await client.query(deletePraktikanQuery, deletePraktikanValues);
  
          // Hapus data akun dari tabel akun
          const deleteAkunQuery = 'DELETE FROM akun WHERE id_akun = $1';
          const deleteAkunValues = [id_akun];
          await client.query(deleteAkunQuery, deleteAkunValues);
  
          res.status(200).json({ message: 'Data akun berhasil dihapus' });
          client.release();
      } catch (error) {
          console.error('Kesalahan saat menghapus data akun:', error);
          res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });
  
    app.get('/praktikan', async (req, res) => {
      try {
        const client = await pool.connect();
    
        // Query untuk mengambil data praktikan dari view view_akun_praktikan_kelompok
        const query = `
        SELECT * FROM view_akun_praktikan_kelompok
        WHERE id_akun <> 1
        `;
        const result = await client.query(query);
    
        const asisten = result.rows;
    
        res.status(200).json(asisten);
        client.release();
      } catch (error) {
        console.error('Kesalahan saat mengambil data asisten:', error);
        res.status(500).json({ error: 'Terjadi kesalahan server' });
      }
    });

    // Contoh penggunaan middleware checkAuth
    app.get('/protected', checkAuth, (req, res) => {
      res.status(200).json({ message: 'Akses diizinkan' });
    }); 

    const port = 3000; // Port yang akan digunakan oleh server

    app.listen(port, () => {
        console.log(`Server berjalan di http://localhost:${port}`);
    });

}