--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: jurusan_enum; Type: TYPE; Schema: public; Owner: rianraffi
--

CREATE TYPE public.jurusan_enum AS ENUM (
    'Teknik Komputer',
    'Teknik Elektro',
    'Teknik Biomedik'
);


ALTER TYPE public.jurusan_enum OWNER TO rianraffi;

--
-- Name: semester_enum; Type: TYPE; Schema: public; Owner: rianraffi
--

CREATE TYPE public.semester_enum AS ENUM (
    'Undefined',
    'Gasal',
    'Genap'
);


ALTER TYPE public.semester_enum OWNER TO rianraffi;

--
-- Name: semester_new; Type: TYPE; Schema: public; Owner: rianraffi
--

CREATE TYPE public.semester_new AS ENUM (
    'genap',
    'gasal',
    'undefined'
);


ALTER TYPE public.semester_new OWNER TO rianraffi;

--
-- Name: status_aslab_enum; Type: TYPE; Schema: public; Owner: rianraffi
--

CREATE TYPE public.status_aslab_enum AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.status_aslab_enum OWNER TO rianraffi;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: akun; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.akun (
    id_akun integer NOT NULL,
    id_role integer NOT NULL,
    nama text NOT NULL,
    npm text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    telepon text,
    jurusan public.jurusan_enum,
    angkatan integer
);


ALTER TABLE public.akun OWNER TO rianraffi;

--
-- Name: asisten; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.asisten (
    id_akun integer NOT NULL,
    kode_aslab text NOT NULL,
    status_aslab public.status_aslab_enum DEFAULT 'active'::public.status_aslab_enum
);


ALTER TABLE public.asisten OWNER TO rianraffi;

--
-- Name: id_barang_sequence; Type: SEQUENCE; Schema: public; Owner: rianraffi
--

CREATE SEQUENCE public.id_barang_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_barang_sequence OWNER TO rianraffi;

--
-- Name: barang; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.barang (
    id_barang integer DEFAULT nextval('public.id_barang_sequence'::regclass) NOT NULL,
    harga integer NOT NULL,
    jumlah_tersedia integer NOT NULL,
    nama_barang text NOT NULL
);


ALTER TABLE public.barang OWNER TO rianraffi;

--
-- Name: id_akun_sequence; Type: SEQUENCE; Schema: public; Owner: rianraffi
--

CREATE SEQUENCE public.id_akun_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_akun_sequence OWNER TO rianraffi;

--
-- Name: id_kelompok_sequence; Type: SEQUENCE; Schema: public; Owner: rianraffi
--

CREATE SEQUENCE public.id_kelompok_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_kelompok_sequence OWNER TO rianraffi;

--
-- Name: id_peminjaman_sequence; Type: SEQUENCE; Schema: public; Owner: rianraffi
--

CREATE SEQUENCE public.id_peminjaman_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_peminjaman_sequence OWNER TO rianraffi;

--
-- Name: id_pengembalian_sequence; Type: SEQUENCE; Schema: public; Owner: rianraffi
--

CREATE SEQUENCE public.id_pengembalian_sequence
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.id_pengembalian_sequence OWNER TO rianraffi;

--
-- Name: kelompok; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.kelompok (
    id_kelompok integer DEFAULT nextval('public.id_kelompok_sequence'::regclass) NOT NULL,
    id_asisten integer NOT NULL,
    nama_kelompok text NOT NULL,
    tahun_ajaran text NOT NULL,
    semester public.semester_enum
);


ALTER TABLE public.kelompok OWNER TO rianraffi;

--
-- Name: peminjaman; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.peminjaman (
    id_peminjaman integer DEFAULT nextval('public.id_peminjaman_sequence'::regclass) NOT NULL,
    id_barang integer NOT NULL,
    jumlah_dipinjam integer NOT NULL,
    id_praktikan integer NOT NULL,
    waktu_peminjaman date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    tenggat_waktu date DEFAULT (CURRENT_TIMESTAMP + '30 days'::interval) NOT NULL,
    returned boolean DEFAULT false,
    id_pengembalian integer
);


ALTER TABLE public.peminjaman OWNER TO rianraffi;

--
-- Name: pengembalian; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.pengembalian (
    id_pengembalian integer DEFAULT nextval('public.id_pengembalian_sequence'::regclass) NOT NULL,
    id_peminjaman integer NOT NULL,
    jumlah_dikembalikan integer NOT NULL,
    waktu_pengembalian date DEFAULT CURRENT_TIMESTAMP NOT NULL,
    denda integer NOT NULL,
    ganti_rugi integer DEFAULT 0 NOT NULL,
    total_sanksi integer NOT NULL,
    bukti_pembayaran text
);


ALTER TABLE public.pengembalian OWNER TO rianraffi;

--
-- Name: praktikan; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.praktikan (
    id_akun integer NOT NULL,
    id_kelompok integer NOT NULL
);


ALTER TABLE public.praktikan OWNER TO rianraffi;

--
-- Name: role; Type: TABLE; Schema: public; Owner: rianraffi
--

CREATE TABLE public.role (
    id_role integer NOT NULL,
    name_role text
);


ALTER TABLE public.role OWNER TO rianraffi;

--
-- Name: view_akun_praktikan_kelompok; Type: VIEW; Schema: public; Owner: rianraffi
--

CREATE VIEW public.view_akun_praktikan_kelompok AS
 SELECT akun.id_akun,
    akun.nama,
    kelompok.nama_kelompok,
    akun.npm,
    akun.username
   FROM ((public.akun
     JOIN public.praktikan ON ((akun.id_akun = praktikan.id_akun)))
     JOIN public.kelompok ON ((praktikan.id_kelompok = kelompok.id_kelompok)));


ALTER TABLE public.view_akun_praktikan_kelompok OWNER TO rianraffi;

--
-- Name: view_asisten_akun; Type: VIEW; Schema: public; Owner: rianraffi
--

CREATE VIEW public.view_asisten_akun AS
 SELECT ak.id_akun,
    ak.nama,
    ast.kode_aslab,
    ak.npm,
    ak.username,
    ast.status_aslab
   FROM (public.asisten ast
     JOIN public.akun ak ON ((ast.id_akun = ak.id_akun)));


ALTER TABLE public.view_asisten_akun OWNER TO rianraffi;

--
-- Name: view_data_akun; Type: VIEW; Schema: public; Owner: rianraffi
--

CREATE VIEW public.view_data_akun AS
 SELECT akun.id_akun,
    akun.nama,
    akun.npm,
    akun.username,
    role.name_role,
    asisten.kode_aslab,
    asisten.status_aslab,
    COALESCE(string_agg(DISTINCT kelompok.nama_kelompok, ', '::text ORDER BY kelompok.nama_kelompok), ''::text) AS kelompok_didampingi
   FROM ((((public.akun
     LEFT JOIN public.praktikan ON ((akun.id_akun = praktikan.id_akun)))
     LEFT JOIN public.kelompok ON ((praktikan.id_kelompok = kelompok.id_kelompok)))
     LEFT JOIN public.asisten ON ((akun.id_akun = asisten.id_akun)))
     LEFT JOIN public.role ON ((akun.id_role = role.id_role)))
  WHERE (akun.id_akun <> ALL (ARRAY[0, 1]))
  GROUP BY akun.id_akun, akun.nama, akun.npm, akun.username, role.name_role, asisten.kode_aslab, asisten.status_aslab, role.id_role
 HAVING ((role.id_role = 1) AND (asisten.kode_aslab IS NOT NULL))
  ORDER BY role.name_role, akun.nama;


ALTER TABLE public.view_data_akun OWNER TO rianraffi;

--
-- Name: view_data_asisten; Type: VIEW; Schema: public; Owner: rianraffi
--

CREATE VIEW public.view_data_asisten AS
 SELECT akun.id_akun,
    akun.nama,
    asisten.kode_aslab,
    akun.npm,
    akun.username,
    string_agg(kelompok.nama_kelompok, ', '::text) AS kelompok_didampingi,
    asisten.status_aslab
   FROM ((public.akun
     JOIN public.kelompok ON ((akun.id_akun = kelompok.id_asisten)))
     JOIN public.asisten ON ((akun.id_akun = asisten.id_akun)))
  GROUP BY akun.id_akun, akun.nama, akun.npm, asisten.kode_aslab, akun.username, asisten.status_aslab
  ORDER BY akun.nama;


ALTER TABLE public.view_data_asisten OWNER TO rianraffi;

--
-- Data for Name: akun; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.akun (id_akun, id_role, nama, npm, username, password, telepon, jurusan, angkatan) FROM stdin;
0	1	-	-	-	-	\N	\N	\N
1	0	-	--	--	-	\N	\N	\N
8	1	Aldrian Raffi	2106653256	rianraff	$2b$10$3l09CuJ3TPOXz.X7PT9GKuHhC9a3GGdSwrSJIySBNNeyXho3PbeS6	\N	\N	\N
9	1	Naufal Faza	207893456	mnfaza	$2b$10$HlxO0/Q0SQ8y0ME7BRUEA.FTs.ss0fROZgiSowRxuIAKs8OTiSa7S	\N	\N	\N
10	1	Rizki Awanta	219875664	rizkiaj	$2b$10$kyUE0qTrXllgObOWLkFaLelYtOVp/YqCVl6eqYPemM5wwRg5CvRu2	\N	\N	\N
11	1	Juan Jonathan	2108856483	juanjons	$2b$10$U6knImVCHi7HfJvZE6RrZO6SZaPu9RCbE2k6ap8SpOptF0wRkCKLe	\N	\N	\N
12	1	Raihan Azhari	2078845736	azharaihan	$2b$10$alBUkJN3jkaEYnuCxEQKE.FDV8k1.FbLtM3vvAJnmjLbUMkQYmIeK	\N	\N	\N
19	0	Kartika Dewi	2025678901	kartika.dewi	$2b$10$v2/kzfvt7GNMSwQ5MymuK.VbVpU.tijzinQwLO97mHiMFKE6OaPUu	\N	\N	\N
21	0	Budi Cahyono	2026789012	budi.cahyono	$2b$10$7PjA9E8RayVH7/6kJ6d5OuNpjqMOMmHyw1bypocD20vKFyF5PcfYW	\N	\N	\N
22	0	Kartini	2123456784	kartini	$2b$10$O/yoIoyH/G.8X1Mx4Wrfuu7sYt0BKrUWXjZOwb8/gX525ldP7dPxq	\N	\N	\N
23	0	Andhika Wisanggeni	2026789015	andhika.wisanggeni	$2b$10$yMWLcWtDwTRKtLzMHXtvneRjHP7x.SuwK2PSrsoQm7eEtUuBXPGE.	\N	\N	\N
24	0	Farrel Mirawan	2123456543	farrel.mirawan	$2b$10$UTn6/2SszTw7nELnjJaBneuQsaqJ9/AkoiIw697JpL662B1fW2JRO	\N	\N	\N
25	0	Shafa Putri	2109984567	shafaputri	$2b$10$0PDokS4oJPzw3t32XHRetOw8CgjElqsFW.TxsmdXGwflFzGVvfMcS	089884668948	Teknik Biomedik	2021
26	1	Muhammad Syauqi	21088763456	muhammadsyauqi	$2b$10$WoZmcXP5vpaHbKLxpwhBt.8vS.Cd5fwaRfQOnLG5wNAJH8Tdoyuii	089886775433	Teknik Komputer	2021
18	0	Bayu Pratama Hasibuan	2123456782	bayu.pratama	$2b$10$1BVMVZ6q8lGVP8PekZ/9/OyVeONOLBx5ovj5IZDWft8BWZJR8qUpy	\N	\N	\N
27	0	Kresna Ramdhani	210345678	kresna.ramdhani	$2b$10$hLJ2STZ6UOhD8y4SdnlnAuYaiVSjYsoBsUVkiJMkKba1.0RFU3NbC	089768907878	Teknik Komputer	2021
28	1	Albertus	2106639472	albertustimothy	$2b$10$ZNNP7AmYMcZYIvSyg8/Dz.12vUu7FXijgDFalWeGhCihJDsl3tQvO	321321	Teknik Elektro	2021
30	0	Arka Brian	209886745	arka.brian	$2b$10$5g11qiz8e37KJRmaKThscOSANkIKeh9PEstO5CYHD.ijOBw/IBb0.	089768907878	Teknik Biomedik	2020
31	0	Amrita Deviayu	210998767	amrita.deviayu	$2b$10$28rXr2QOsooYf5xXyg/71.buoYxbF/Cs4FHF4tsIn3ejuclOxxpIq	089887665454	Teknik Elektro	2021
33	1	Albert	0987	albertus	$2b$10$KR8TJGV4FKPhdrHAWUREMOwQx0rGHhupK9i/byYiFdqzFLN9hkF0G	2135	Teknik Komputer	2009
34	1	Albertus	12532	halosemua	$2b$10$03cYcAtD4EzjtRQfcPdjO.2Ea6Rm8rf0dFZVSn141vEqmWxMtvAvu	21321	Teknik Elektro	2012
35	1	false	857483	hai	$2b$10$5c.7b9z/nLEFUGVaPoegg.jPrmorSJmclEueEJjJHtnVJJE8SFJSW	3213	Teknik Elektro	2085
32	0	Luthfi Misbachul	213446785	luthfi.misbachul	$2b$10$fm9UOP23nreXu.kgWQVVBuKwocoKmwb0vXoQalik.3DKrf8XkxTTq	089776554789	Teknik Komputer	2021
36	1	Ryan	210528382	RYAN	$2b$10$xx96wStHweMoEWcR5U.mO.3Thiel7ThIu2e849aMv8LXCbubIb5ou	908302	Teknik Elektro	2021
29	0	Albertus Timothy Gunawan	2206639222	albertus.timothy	$2b$10$pOa.H9aqf01Ol3JoUna8n.wOg5c20Dq0eH047lgTTOuV4tHvT6oTC	087888865678	Teknik Elektro	2012
37	1	Althaf Nafi Anwar	2104242	althaf.nafi	$2b$10$AOI7V2qxugm2NXlPNe2OkudfmBaNzGR/PSH5dbIAPcDQkEioVc65O	087888865678	Teknik Komputer	2021
\.


--
-- Data for Name: asisten; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.asisten (id_akun, kode_aslab, status_aslab) FROM stdin;
0	-	inactive
8	AR	active
9	NF	active
10	AJ	active
11	JJ	active
12	RI	active
26	MS	active
33	AL	active
34	123	active
35	321	active
36	RY	active
37	ANA	active
\.


--
-- Data for Name: barang; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.barang (id_barang, harga, jumlah_tersedia, nama_barang) FROM stdin;
8	60000	90	Counter 4-bit
12	55000	65	Encoder 4-to-2
1	15000	9	7408 Quadruple AND Gate
5	75000	74	BCD to Seven Segment Decoder
13	50000	70	Full Adder
7	45000	60	XOR Gate
15	15000	10	Pir Sensor
11	70000	77	Decade Counter
4	50000	45	AND Gate
16	10000	20	Digital Servo
6	40000	60	Flip-Flop D
10	65000	74	Shift Register
2	5000	17	4-bit PIPO Register
9	55000	61	Multiplexer 8-to-1
\.


--
-- Data for Name: kelompok; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.kelompok (id_kelompok, id_asisten, nama_kelompok, tahun_ajaran, semester) FROM stdin;
0	0	undefined	0	Undefined
11	10	E2	2021-2022	Genap
12	11	B3	2022-2023	Gasal
13	12	K2	2022-2023	Gasal
17	8	E1	2022-2023	Genap
16	11	E4	2022-2023	Genap
20	37	E9	2022-2023	Genap
21	37	K21	2021-2022	Gasal
19	26	B10	2023-2024	Gasal
10	8	K1	2021-2022	Gasal
23	26	B5	2023-2024	Gasal
\.


--
-- Data for Name: peminjaman; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.peminjaman (id_peminjaman, id_barang, jumlah_dipinjam, id_praktikan, waktu_peminjaman, tenggat_waktu, returned, id_pengembalian) FROM stdin;
29	10	9	18	2023-06-06	2023-07-06	f	\N
28	9	14	22	2023-06-06	2023-07-06	t	23
25	2	2	24	2023-06-06	2023-07-06	f	\N
27	6	14	1	2023-06-06	2023-07-06	t	22
30	1	5	25	2023-06-09	2023-07-09	t	24
31	2	6	1	2023-06-09	2023-07-09	t	25
33	5	2	1	2023-06-09	2023-07-09	f	\N
36	5	2	27	2023-06-10	2023-07-10	f	\N
37	2	5	29	2023-06-10	2023-07-10	t	28
38	2	5	29	2023-06-10	2023-07-10	t	29
44	10	2	29	2023-05-13	2023-06-15	f	\N
42	7	4	29	2023-06-10	2023-07-10	f	\N
41	11	3	29	2023-06-10	2023-07-10	f	\N
40	13	2	29	2023-06-10	2023-07-10	f	\N
48	4	5	29	2023-06-10	2023-06-16	f	\N
50	6	4	29	2023-06-11	2023-07-11	t	35
46	16	3	29	2023-06-10	2023-06-17	t	36
49	9	10	29	2023-06-11	2023-07-11	t	37
39	6	3	29	2023-06-10	2023-07-10	t	38
43	10	2	29	2023-06-10	2023-07-10	t	39
45	2	2	29	2023-06-10	2023-07-10	t	41
51	9	10	29	2023-06-11	2023-07-11	f	\N
\.


--
-- Data for Name: pengembalian; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.pengembalian (id_pengembalian, id_peminjaman, jumlah_dikembalikan, waktu_pengembalian, denda, ganti_rugi, total_sanksi, bukti_pembayaran) FROM stdin;
22	27	6	2023-05-02	0	320000	320000	bukti2.jpg
23	28	10	2023-05-02	0	220000	220000	bukti2.jpg
24	30	4	2023-06-09	0	15000	15000	buktibintang.jpg
25	31	6	2023-06-09	0	0	0	buktibintang.jpg
27	37	3	2023-06-10	0	10000	10000	
28	37	1	2023-06-10	0	20000	20000	
29	38	5	2023-06-10	0	0	0	
34	39	2	2023-06-11	0	40000	40000	LINK
35	50	4	2023-06-11	0	0	0	LINK
36	46	3	2023-06-11	0	0	0	link
37	49	10	2023-06-11	0	0	0	buktibintang.jpg
38	39	3	2023-07-10	0	0	0	buktibintang.jpg
39	43	2	2023-07-15	5000	0	5000	buktibintang.jpg
41	45	2	2023-06-11	0	0	0	\N
\.


--
-- Data for Name: praktikan; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.praktikan (id_akun, id_kelompok) FROM stdin;
1	0
19	10
21	12
22	13
23	12
24	11
18	12
27	12
30	19
31	16
32	10
25	0
29	16
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: rianraffi
--

COPY public.role (id_role, name_role) FROM stdin;
0	praktikan
1	asisten
\.


--
-- Name: id_akun_sequence; Type: SEQUENCE SET; Schema: public; Owner: rianraffi
--

SELECT pg_catalog.setval('public.id_akun_sequence', 2, true);


--
-- Name: id_barang_sequence; Type: SEQUENCE SET; Schema: public; Owner: rianraffi
--

SELECT pg_catalog.setval('public.id_barang_sequence', 23, true);


--
-- Name: id_kelompok_sequence; Type: SEQUENCE SET; Schema: public; Owner: rianraffi
--

SELECT pg_catalog.setval('public.id_kelompok_sequence', 24, true);


--
-- Name: id_peminjaman_sequence; Type: SEQUENCE SET; Schema: public; Owner: rianraffi
--

SELECT pg_catalog.setval('public.id_peminjaman_sequence', 52, true);


--
-- Name: id_pengembalian_sequence; Type: SEQUENCE SET; Schema: public; Owner: rianraffi
--

SELECT pg_catalog.setval('public.id_pengembalian_sequence', 41, true);


--
-- Name: akun akun_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.akun
    ADD CONSTRAINT akun_pkey PRIMARY KEY (id_akun);


--
-- Name: akun akun_username_key; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.akun
    ADD CONSTRAINT akun_username_key UNIQUE (username);


--
-- Name: asisten asisten_kode_aslab_key; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.asisten
    ADD CONSTRAINT asisten_kode_aslab_key UNIQUE (kode_aslab);


--
-- Name: asisten asisten_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.asisten
    ADD CONSTRAINT asisten_pkey PRIMARY KEY (id_akun);


--
-- Name: barang barang_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.barang
    ADD CONSTRAINT barang_pkey PRIMARY KEY (id_barang);


--
-- Name: kelompok kelompok_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.kelompok
    ADD CONSTRAINT kelompok_pkey PRIMARY KEY (id_kelompok);


--
-- Name: peminjaman peminjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT peminjaman_pkey PRIMARY KEY (id_peminjaman);


--
-- Name: pengembalian pengembalian_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.pengembalian
    ADD CONSTRAINT pengembalian_pkey PRIMARY KEY (id_pengembalian);


--
-- Name: praktikan praktikan_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.praktikan
    ADD CONSTRAINT praktikan_pkey PRIMARY KEY (id_akun);


--
-- Name: role role_name_role_key; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_name_role_key UNIQUE (name_role);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (id_role);


--
-- Name: kelompok unique_nama_kelompok; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.kelompok
    ADD CONSTRAINT unique_nama_kelompok UNIQUE (nama_kelompok);


--
-- Name: akun unique_npm; Type: CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.akun
    ADD CONSTRAINT unique_npm UNIQUE (npm);


--
-- Name: akun akun_id_role_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.akun
    ADD CONSTRAINT akun_id_role_fkey FOREIGN KEY (id_role) REFERENCES public.role(id_role);


--
-- Name: asisten asisten_id_akun_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.asisten
    ADD CONSTRAINT asisten_id_akun_fkey FOREIGN KEY (id_akun) REFERENCES public.akun(id_akun);


--
-- Name: kelompok kelompok_id_asisten_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.kelompok
    ADD CONSTRAINT kelompok_id_asisten_fkey FOREIGN KEY (id_asisten) REFERENCES public.asisten(id_akun);


--
-- Name: peminjaman peminjaman_id_barang_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT peminjaman_id_barang_fkey FOREIGN KEY (id_barang) REFERENCES public.barang(id_barang);


--
-- Name: peminjaman peminjaman_id_pengembalian_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT peminjaman_id_pengembalian_fkey FOREIGN KEY (id_pengembalian) REFERENCES public.pengembalian(id_pengembalian);


--
-- Name: peminjaman peminjaman_id_praktikan_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT peminjaman_id_praktikan_fkey FOREIGN KEY (id_praktikan) REFERENCES public.praktikan(id_akun);


--
-- Name: pengembalian pengembalian_id_peminjaman_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.pengembalian
    ADD CONSTRAINT pengembalian_id_peminjaman_fkey FOREIGN KEY (id_peminjaman) REFERENCES public.peminjaman(id_peminjaman);


--
-- Name: praktikan praktikan_id_akun_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.praktikan
    ADD CONSTRAINT praktikan_id_akun_fkey FOREIGN KEY (id_akun) REFERENCES public.akun(id_akun);


--
-- Name: praktikan praktikan_id_kelompok_fkey; Type: FK CONSTRAINT; Schema: public; Owner: rianraffi
--

ALTER TABLE ONLY public.praktikan
    ADD CONSTRAINT praktikan_id_kelompok_fkey FOREIGN KEY (id_kelompok) REFERENCES public.kelompok(id_kelompok);


--
-- PostgreSQL database dump complete
--

