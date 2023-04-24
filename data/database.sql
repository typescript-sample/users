--
-- PostgreSQL database dump
--

-- Dumped from database version 14.7 (Homebrew)
-- Dumped by pg_dump version 14.7 (Homebrew)

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appreciation; 
--

CREATE TABLE public.appreciation (
    id character varying(40) NOT NULL,
    author character varying(40),
    title character varying(120),
    description character varying(120),
    usefulcount integer,
    replycount integer,
    createdat date,
    userid character varying(40),
    "time" date
);


--ALTER TABLE public.appreciation ;

--
-- Name: appreciationcomment; 
--

CREATE TABLE public.appreciationcomment (
    commentid character varying(255) NOT NULL,
    id character varying(255),
    author character varying(255),
    userid character varying(255),
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[]
);


--ALTER TABLE public.appreciationcomment ;

--
-- Name: appreciationreaction; 
--

CREATE TABLE public.appreciationreaction (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.appreciationreaction ;

--
-- Name: article; 
--

CREATE TABLE public.article (
    id character varying(40) NOT NULL,
    title character varying(300),
    name character varying(300),
    description character varying(1000),
    type character varying(40),
    content character varying(100000),
    authorid character varying(40),
    tags character varying[],
    status character varying(1)
);


--ALTER TABLE public.article ;

--
-- Name: articlecomment; 
--

CREATE TABLE public.articlecomment (
    commentid character varying(40) NOT NULL,
    commentthreadid character varying(40),
    id character varying(40),
    author character varying(255),
    comment text,
    "time" timestamp with time zone,
    updatedat timestamp with time zone,
    histories jsonb[]
);


--ALTER TABLE public.articlecomment ;

--
-- Name: articlecommentinfo; 
--

CREATE TABLE public.articlecommentinfo (
    commentid character varying(40) NOT NULL,
    replycount integer DEFAULT 0,
    usefulcount integer DEFAULT 0
);


--ALTER TABLE public.articlecommentinfo ;

--
-- Name: articlecommentreaction; 
--

CREATE TABLE public.articlecommentreaction (
    commentid character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp with time zone,
    reaction smallint
);


--ALTER TABLE public.articlecommentreaction ;

--
-- Name: articlecommentthread; 
--

CREATE TABLE public.articlecommentthread (
    commentid character varying(40) NOT NULL,
    id character varying(40),
    author character varying(255),
    comment text,
    "time" timestamp with time zone,
    updatedat timestamp with time zone,
    histories jsonb[]
);


--ALTER TABLE public.articlecommentthread ;

--
-- Name: articlecommentthreadinfo; 
--

CREATE TABLE public.articlecommentthreadinfo (
    commentid character varying(40) NOT NULL,
    replycount integer DEFAULT 0,
    usefulcount integer DEFAULT 0
);


--ALTER TABLE public.articlecommentthreadinfo ;

--
-- Name: articlecommentthreadreaction; 
--

CREATE TABLE public.articlecommentthreadreaction (
    commentid character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp with time zone,
    reaction smallint
);


--ALTER TABLE public.articlecommentthreadreaction ;

--
-- Name: articleinfo; 
--

CREATE TABLE public.articleinfo (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer DEFAULT 0,
    score numeric DEFAULT 0
);


--ALTER TABLE public.articleinfo ;

--
-- Name: articlerate; 
--

CREATE TABLE public.articlerate (
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    rate integer NOT NULL,
    "time" timestamp without time zone,
    review text,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0,
    histories jsonb[],
    anonymous boolean
);


--ALTER TABLE public.articlerate ;

--
-- Name: articleratecomment; 
--

CREATE TABLE public.articleratecomment (
    commentid character varying(40) NOT NULL,
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[],
    anonymous boolean
);


--ALTER TABLE public.articleratecomment ;

--
-- Name: articleratereaction; 
--

CREATE TABLE public.articleratereaction (
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.articleratereaction ;

--
-- Name: authencodes; 
--

CREATE TABLE public.authencodes (
    id character varying(40) NOT NULL,
    code character varying(500) NOT NULL,
    expiredat timestamp with time zone NOT NULL
);


--ALTER TABLE public.authencodes ;

--
-- Name: authentication; 
--

CREATE TABLE public.authentication (
    id character varying,
    password character varying,
    failcount character varying,
    lockeduntiltime character varying,
    successtime character varying,
    failtime character varying
);


--ALTER TABLE public.authentication ;

--
-- Name: brand; 
--

CREATE TABLE public.brand (
    brand character varying(255) NOT NULL
);


--ALTER TABLE public.brand ;

--
-- Name: category; 
--

CREATE TABLE public.category (
    categoryid character varying(40) NOT NULL,
    categoryname character varying(300) NOT NULL,
    status character(1) NOT NULL,
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone
);


--ALTER TABLE public.category ;

--
-- Name: cinema; 
--

CREATE TABLE public.cinema (
    id character varying(40) NOT NULL,
    name character varying(255) NOT NULL,
    address character varying(255) NOT NULL,
    parent character varying(40),
    status character(1) NOT NULL,
    latitude numeric,
    longitude numeric,
    imageurl text,
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone,
    gallery jsonb[],
    coverurl text
);


--ALTER TABLE public.cinema ;

--
-- Name: company; 
--

CREATE TABLE public.company (
    id character varying(40) NOT NULL,
    name character varying(120),
    description character varying(1000),
    address character varying(255) NOT NULL,
    size integer,
    status character(1) NOT NULL,
    establishedat timestamp with time zone,
    categories character varying[],
    imageurl character varying(300),
    coverurl character varying(300),
    gallery character varying[]
);


--ALTER TABLE public.company ;

--
-- Name: company_users; 
--

CREATE TABLE public.company_users (
    company_id character varying(40) NOT NULL,
    user_id character varying(40) NOT NULL
);


--ALTER TABLE public.company_users ;

--
-- Name: companycategory; 
--

CREATE TABLE public.companycategory (
    categoryid character varying(40) NOT NULL,
    categoryname character varying(300) NOT NULL,
    status character(1) NOT NULL,
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone
);


--ALTER TABLE public.companycategory ;

--
-- Name: companycomment; 
--

CREATE TABLE public.companycomment (
    commentid character varying(40) NOT NULL,
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[]
);


--ALTER TABLE public.companycomment ;

--
-- Name: companyrate; 
--

CREATE TABLE public.companyrate (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    rate integer,
    "time" timestamp without time zone,
    review text,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0,
    histories jsonb[]
);


--ALTER TABLE public.companyrate ;

--
-- Name: companyratefullinfo; 
--

CREATE TABLE public.companyratefullinfo (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.companyratefullinfo ;

--
-- Name: companyrateinfo01; 
--

CREATE TABLE public.companyrateinfo01 (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.companyrateinfo01 ;

--
-- Name: companyrateinfo02; 
--

CREATE TABLE public.companyrateinfo02 (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.companyrateinfo02 ;

--
-- Name: companyrateinfo03; 
--

CREATE TABLE public.companyrateinfo03 (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.companyrateinfo03 ;

--
-- Name: companyrateinfo04; 
--

CREATE TABLE public.companyrateinfo04 (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.companyrateinfo04 ;

--
-- Name: companyrateinfo05; 
--

CREATE TABLE public.companyrateinfo05 (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.companyrateinfo05 ;

--
-- Name: companyratereaction; 
--

CREATE TABLE public.companyratereaction (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.companyratereaction ;

--
-- Name: countries; 
--

CREATE TABLE public.countries (
    country character varying(120) NOT NULL
);


--ALTER TABLE public.countries ;

--
-- Name: film; 
--

CREATE TABLE public.film (
    id character varying(40) NOT NULL,
    title character varying(300) NOT NULL,
    description character varying(300),
    imageurl character varying(300),
    trailerurl character varying(300),
    categories character varying[],
    directors character varying[],
    casts character varying[],
    productions character varying[],
    countries character varying[],
    language character varying(300),
    writer character varying[],
    gallery jsonb[],
    coverurl character varying(300),
    status character(1) NOT NULL,
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone
);


--ALTER TABLE public.film ;

--
-- Name: filmcasts; 
--

CREATE TABLE public.filmcasts (
    actor character varying(120) NOT NULL
);


--ALTER TABLE public.filmcasts ;

--
-- Name: filmcategory; 
--

CREATE TABLE public.filmcategory (
    categoryid character varying(40) NOT NULL,
    categoryname character varying(300) NOT NULL,
    status character(1) NOT NULL,
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone
);


--ALTER TABLE public.filmcategory ;

--
-- Name: filmcommentthread; 
--

CREATE TABLE public.filmcommentthread (
    commentid character varying(40) NOT NULL,
    id character varying(40),
    author character varying(255),
    comment text,
    "time" timestamp with time zone,
    updatedat timestamp with time zone,
    histories jsonb[]
);


--ALTER TABLE public.filmcommentthread ;

--
-- Name: filmcommentthreadinfo; 
--

CREATE TABLE public.filmcommentthreadinfo (
    commentid character varying(40) NOT NULL,
    replycount integer DEFAULT 0,
    usefulcount integer DEFAULT 0
);


--ALTER TABLE public.filmcommentthreadinfo ;

--
-- Name: filmcommentthreadreaction; 
--

CREATE TABLE public.filmcommentthreadreaction (
    commentid character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp with time zone,
    reaction smallint
);


--ALTER TABLE public.filmcommentthreadreaction ;

--
-- Name: filmdirectors; 
--

CREATE TABLE public.filmdirectors (
    director character varying(120) NOT NULL
);


--ALTER TABLE public.filmdirectors ;

--
-- Name: filmproductions; 
--

CREATE TABLE public.filmproductions (
    production character varying(120) NOT NULL
);


--ALTER TABLE public.filmproductions ;

--
-- Name: filmrate; 
--

CREATE TABLE public.filmrate (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    rate integer,
    "time" timestamp without time zone,
    review text,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0,
    histories jsonb[],
    anonymous boolean
);


--ALTER TABLE public.filmrate ;

--
-- Name: filmratecomment; 
--

CREATE TABLE public.filmratecomment (
    commentid character varying(255) NOT NULL,
    id character varying(255),
    author character varying(255),
    userid character varying(255),
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[],
    anonymous boolean
);


--ALTER TABLE public.filmratecomment ;

--
-- Name: filmrateinfo; 
--

CREATE TABLE public.filmrateinfo (
    id character varying(255) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    rate6 integer DEFAULT 0,
    rate7 integer DEFAULT 0,
    rate8 integer DEFAULT 0,
    rate9 integer DEFAULT 0,
    rate10 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.filmrateinfo ;

--
-- Name: filmratereaction; 
--

CREATE TABLE public.filmratereaction (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.filmratereaction ;

--
-- Name: filmreplycomment; 
--

CREATE TABLE public.filmreplycomment (
    commentid character varying(40) NOT NULL,
    commentthreadid character varying(40),
    id character varying(40),
    author character varying(255),
    comment text,
    "time" timestamp with time zone,
    updatedat timestamp with time zone,
    histories jsonb[]
);


--ALTER TABLE public.filmreplycomment ;

--
-- Name: filmreplycommentinfo; 
--

CREATE TABLE public.filmreplycommentinfo (
    commentid character varying(40) NOT NULL,
    replycount integer DEFAULT 0,
    usefulcount integer DEFAULT 0
);


--ALTER TABLE public.filmreplycommentinfo ;

--
-- Name: filmreplycommentreaction; 
--

CREATE TABLE public.filmreplycommentreaction (
    commentid character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp with time zone,
    reaction smallint
);


--ALTER TABLE public.filmreplycommentreaction ;

--
-- Name: history; 
--

CREATE TABLE public.history (
    id character varying(40) NOT NULL,
    history character varying[]
);


--ALTER TABLE public.history ;

--
-- Name: integrationconfiguration; 
--

CREATE TABLE public.integrationconfiguration (
    id character varying,
    link character varying,
    cliendid character varying,
    scope character varying,
    redirecturi character varying,
    accesstokenlink character varying,
    clientsecret character varying,
    status character varying
);


--ALTER TABLE public.integrationconfiguration ;

--
-- Name: item; 
--

CREATE TABLE public.item (
    id character varying(40) NOT NULL,
    title character varying(120),
    author character varying(140),
    status character varying(1),
    description character varying(1500),
    price numeric,
    imageurl character varying(300),
    brand character varying(120),
    publishedat timestamp without time zone,
    expiredat timestamp without time zone,
    category character varying[],
    gallery jsonb[],
    condition character varying(50)
);


--ALTER TABLE public.item ;

--
-- Name: itemcategory; 
--

CREATE TABLE public.itemcategory (
    categoryid character varying(40) NOT NULL,
    categoryname character varying(300) NOT NULL,
    status character(1) NOT NULL,
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone
);


--ALTER TABLE public.itemcategory ;

--
-- Name: itemcomment; 
--

CREATE TABLE public.itemcomment (
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[]
);


--ALTER TABLE public.itemcomment ;

--
-- Name: iteminfo; 
--

CREATE TABLE public.iteminfo (
    id character varying(255) NOT NULL,
    viewcount integer DEFAULT 0
);


--ALTER TABLE public.iteminfo ;

--
-- Name: itemresponse; 
--

CREATE TABLE public.itemresponse (
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    description text,
    "time" timestamp without time zone,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0,
    histories jsonb[],
    price bigint
);


--ALTER TABLE public.itemresponse ;

--
-- Name: itemresponsereaction; 
--

CREATE TABLE public.itemresponsereaction (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.itemresponsereaction ;

--
-- Name: job; 
--

CREATE TABLE public.job (
    id character varying(40) NOT NULL,
    title character varying(300),
    description character varying(1000),
    skill jsonb[],
    publishedat timestamp with time zone,
    expiredat timestamp with time zone,
    quantity bigint DEFAULT 0,
    applicantcount bigint DEFAULT 0,
    requirements character varying(255),
    benefit character varying(255),
    company_id character varying(40) NOT NULL
);


--ALTER TABLE public.job ;

--
-- Name: location; 
--

CREATE TABLE public.location (
    id character varying(40) NOT NULL,
    name character varying(300) NOT NULL,
    type character varying(40),
    description character varying(1000),
    status character(1) NOT NULL,
    geo jsonb,
    latitude numeric(20,16),
    longitude numeric(20,16),
    imageurl character varying(1500),
    customurl character varying(1500),
    createdby character varying(1500),
    createdat timestamp without time zone,
    updatedby character varying(1500),
    version integer,
    info jsonb
);


--ALTER TABLE public.location ;

--
-- Name: locationcomment; 
--

CREATE TABLE public.locationcomment (
    commentid character varying(40) NOT NULL,
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[],
    anonymous boolean
);


--ALTER TABLE public.locationcomment ;

--
-- Name: locationcommentthread; 
--

CREATE TABLE public.locationcommentthread (
    commentid character varying(40) NOT NULL,
    id character varying(40),
    author character varying(255),
    comment text,
    "time" timestamp with time zone,
    updatedat timestamp with time zone,
    histories jsonb[]
);


--ALTER TABLE public.locationcommentthread ;

--
-- Name: locationcommentthreadinfo; 
--

CREATE TABLE public.locationcommentthreadinfo (
    commentid character varying(40) NOT NULL,
    replycount integer DEFAULT 0,
    usefulcount integer DEFAULT 0
);


--ALTER TABLE public.locationcommentthreadinfo ;

--
-- Name: locationcommentthreadreaction; 
--

CREATE TABLE public.locationcommentthreadreaction (
    commentid character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp with time zone,
    reaction smallint
);


--ALTER TABLE public.locationcommentthreadreaction ;

--
-- Name: locationfollower; 
--

CREATE TABLE public.locationfollower (
    id character varying(40) NOT NULL,
    follower character varying(40) NOT NULL
);


--ALTER TABLE public.locationfollower ;

--
-- Name: locationfollowing; 
--

CREATE TABLE public.locationfollowing (
    id character varying(40) NOT NULL,
    following character varying(40) NOT NULL
);


--ALTER TABLE public.locationfollowing ;

--
-- Name: locationinfo; 
--

CREATE TABLE public.locationinfo (
    id character varying(40) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    count integer DEFAULT 0,
    score numeric DEFAULT 0
);


--ALTER TABLE public.locationinfo ;

--
-- Name: locationinfomation; 
--

CREATE TABLE public.locationinfomation (
    id character varying(40) NOT NULL,
    followercount bigint,
    followingcount bigint
);


--ALTER TABLE public.locationinfomation ;

--
-- Name: locationrate; 
--

CREATE TABLE public.locationrate (
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    rate integer NOT NULL,
    "time" timestamp without time zone,
    review text,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0,
    anonymous boolean,
    histories jsonb[]
);


--ALTER TABLE public.locationrate ;

--
-- Name: locationratereaction; 
--

CREATE TABLE public.locationratereaction (
    id character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.locationratereaction ;

--
-- Name: locationreplycomment; 
--

CREATE TABLE public.locationreplycomment (
    commentid character varying(40) NOT NULL,
    commentthreadid character varying(40),
    id character varying(40),
    author character varying(255),
    comment text,
    "time" timestamp with time zone,
    updatedat timestamp with time zone,
    histories jsonb[]
);


--ALTER TABLE public.locationreplycomment ;

--
-- Name: locationreplycommentinfo; 
--

CREATE TABLE public.locationreplycommentinfo (
    commentid character varying(40) NOT NULL,
    replycount integer DEFAULT 0,
    usefulcount integer DEFAULT 0
);


--ALTER TABLE public.locationreplycommentinfo ;

--
-- Name: locationreplycommentreaction; 
--

CREATE TABLE public.locationreplycommentreaction (
    commentid character varying(40) NOT NULL,
    author character varying(40) NOT NULL,
    userid character varying(40) NOT NULL,
    "time" timestamp with time zone,
    reaction smallint
);


--ALTER TABLE public.locationreplycommentreaction ;

--
-- Name: music; 
--

CREATE TABLE public.music (
    id character varying(40) NOT NULL,
    name character varying(300) NOT NULL,
    author character varying[],
    releasedate date,
    duration date,
    lyric text,
    imageurl character varying(300),
    mp3url character varying(300)
);


--ALTER TABLE public.music ;

--
-- Name: passwordcodes; 
--

CREATE TABLE public.passwordcodes (
    id character varying(40) NOT NULL,
    code character varying(500) NOT NULL,
    expiredat timestamp with time zone NOT NULL
);


--ALTER TABLE public.passwordcodes ;

--
-- Name: passwords; 
--

CREATE TABLE public.passwords (
    id character varying(40) NOT NULL,
    password character varying(255),
    successtime timestamp with time zone,
    failtime timestamp with time zone,
    failcount integer,
    lockeduntiltime timestamp with time zone,
    history character varying[]
);


--ALTER TABLE public.passwords ;

--
-- Name: playlist; 
--

CREATE TABLE public.playlist (
    id character varying(40) NOT NULL,
    title character varying(255),
    userid character varying(255),
    imageurl character varying(255)
);


--ALTER TABLE public.playlist ;

--
-- Name: reservation; 
--

CREATE TABLE public.reservation (
    id character varying(40) NOT NULL,
    startdate date,
    enddate date,
    guestid character varying(255),
    totalprice integer,
    roomid character varying(255)
);


--ALTER TABLE public.reservation ;

--
-- Name: room; 
--

CREATE TABLE public.room (
    id character varying(255) NOT NULL,
    title character varying(255),
    description character varying(1000),
    price integer,
    offer character varying[],
    location character varying(255),
    host character varying(255),
    guest integer,
    bedrooms integer,
    bed integer,
    bathrooms integer,
    highlight character varying[],
    status character(1),
    region character varying(255),
    category character varying[],
    typeof character varying[],
    property character varying(255),
    language character varying[],
    imageurl jsonb[]
);


--ALTER TABLE public.room ;

--
-- Name: saveditem; 
--

CREATE TABLE public.saveditem (
    id character varying(40) NOT NULL,
    items character varying[],
    createdby character varying(40),
    createdat timestamp without time zone,
    updatedby character varying(40),
    updatedat timestamp without time zone
);


--ALTER TABLE public.saveditem ;

--
-- Name: savedlocation; 
--

CREATE TABLE public.savedlocation (
    id character varying(40) NOT NULL,
    items character varying[]
);


--ALTER TABLE public.savedlocation ;

--
-- Name: signupcodes; 
--

CREATE TABLE public.signupcodes (
    id character varying(40) NOT NULL,
    code character varying(500) NOT NULL,
    expiredat timestamp with time zone NOT NULL
);


--ALTER TABLE public.signupcodes ;

--
-- Name: usercompanies; 
--

CREATE TABLE public.usercompanies (
    company character varying(120) NOT NULL
);


--ALTER TABLE public.usercompanies ;

--
-- Name: usereducations; 
--

CREATE TABLE public.usereducations (
    school character varying(120) NOT NULL
);


--ALTER TABLE public.usereducations ;

--
-- Name: userfollower; 
--

CREATE TABLE public.userfollower (
    id character varying(40) NOT NULL,
    follower character varying(40) NOT NULL
);


--ALTER TABLE public.userfollower ;

--
-- Name: userfollowing; 
--

CREATE TABLE public.userfollowing (
    id character varying(40) NOT NULL,
    following character varying(40) NOT NULL
);


--ALTER TABLE public.userfollowing ;

--
-- Name: userinfo; 
--

CREATE TABLE public.userinfo (
    id character varying(40) NOT NULL,
    followercount bigint DEFAULT 0,
    followingcount bigint DEFAULT 0,
    rate1 integer DEFAULT 0
);


--ALTER TABLE public.userinfo ;

--
-- Name: userinfomation; 
--

CREATE TABLE public.userinfomation (
    id character varying(255) NOT NULL,
    appreciate bigint DEFAULT 0,
    respect bigint DEFAULT 0,
    admire bigint DEFAULT 0,
    reactioncount bigint DEFAULT 0
);


--ALTER TABLE public.userinfomation ;

--
-- Name: userinterests; 
--

CREATE TABLE public.userinterests (
    interest character varying(120) NOT NULL
);


--ALTER TABLE public.userinterests ;

--
-- Name: userrate; 
--

CREATE TABLE public.userrate (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    rate integer,
    "time" timestamp without time zone,
    review text,
    usefulcount integer DEFAULT 0,
    replycount integer DEFAULT 0,
    histories jsonb[]
);


--ALTER TABLE public.userrate ;

--
-- Name: userratecomment; 
--

CREATE TABLE public.userratecomment (
    commentid character varying(255) NOT NULL,
    id character varying(255),
    author character varying(255),
    userid character varying(255),
    comment text,
    "time" timestamp without time zone,
    updatedat timestamp without time zone,
    histories jsonb[]
);


--ALTER TABLE public.userratecomment ;

--
-- Name: userrateinfo; 
--

CREATE TABLE public.userrateinfo (
    id character varying(255) NOT NULL,
    rate numeric DEFAULT 0,
    rate1 integer DEFAULT 0,
    rate2 integer DEFAULT 0,
    rate3 integer DEFAULT 0,
    rate4 integer DEFAULT 0,
    rate5 integer DEFAULT 0,
    rate6 integer DEFAULT 0,
    rate7 integer DEFAULT 0,
    rate8 integer DEFAULT 0,
    rate9 integer DEFAULT 0,
    rate10 integer DEFAULT 0,
    count integer,
    score numeric
);


--ALTER TABLE public.userrateinfo ;

--
-- Name: userratereaction; 
--

CREATE TABLE public.userratereaction (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    "time" timestamp without time zone,
    reaction smallint
);


--ALTER TABLE public.userratereaction ;

--
-- Name: userreaction; 
--

CREATE TABLE public.userreaction (
    id character varying(255) NOT NULL,
    author character varying(255) NOT NULL,
    userid character varying(255) NOT NULL,
    reaction smallint,
    "time" timestamp without time zone
);


--ALTER TABLE public.userreaction ;

--
-- Name: users; 
--

CREATE TABLE public.users (
    id character varying(40) NOT NULL,
    username character varying(120),
    email character varying(120),
    phone character varying(45),
    gender character(1),
    displayname character varying(500),
    givenname character varying(100),
    familyname character varying(100),
    middlename character varying(100),
    alternativeemail character varying(255),
    alternativephone character varying(45),
    imageurl character varying(255),
    coverurl character varying(255),
    title character varying(255),
    nationality character varying(255),
    address character varying(255),
    bio character varying(255),
    website character varying(255),
    occupation character varying(255),
    company character varying(255),
    location character varying(255),
    maxpasswordage integer,
    dateofbirth timestamp with time zone,
    settings jsonb,
    links jsonb,
    gallery jsonb[],
    skills jsonb[],
    achievements jsonb[],
    works jsonb[],
    companies jsonb[],
    educations jsonb[],
    interests character varying[],
    lookingfor character varying[],
    status character(1),
    createdby character varying(40) NOT NULL,
    createdat timestamp with time zone,
    updatedby character varying(40) NOT NULL,
    updatedat timestamp with time zone,
    social jsonb,
    version integer
);


--ALTER TABLE public.users ;

--
-- Name: usersearchs; 
--

CREATE TABLE public.usersearchs (
    item character varying(120) NOT NULL
);


--ALTER TABLE public.usersearchs ;

--
-- Name: userskills; 
--

CREATE TABLE public.userskills (
    skill character varying(120) NOT NULL
);


--ALTER TABLE public.userskills ;

--
-- Data for Name: appreciation; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.appreciation (id, author, title, description, usefulcount, replycount, createdat, userid, "time") FROM stdin;
\.


--
-- Data for Name: appreciationcomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.appreciationcomment (commentid, id, author, userid, comment, "time", updatedat, histories) FROM stdin;
\.


--
-- Data for Name: appreciationreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.appreciationreaction (id, author, userid, "time", reaction) FROM stdin;
\.


--
-- Data for Name: article; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.article (id, title, name, description, type, content, authorid, tags, status) FROM stdin;
01	This is title 01	This is name 01	This is description 01	type 01	<div class="key-event__content"> \r\n    <p>Trong phần thủ tục, các luật sư bảo vệ người bị hại đề nghị HĐXX xác định tỷ lệ thương tích của bị hại vào các ngày 7, 10, và 12.12.2021, nhằm xem xét xử lý các bị cáo hành vi “cố ý gây thương tích. </p> \r\n    <p>Bên cạnh đó, các luật sư đề nghị HĐXX xem xét và xác định Thái đồng phạm tội danh "giết người" với bị cáo Trang.</p>  \r\n    <table class="picture" align="center"> \r\n     <tbody> \r\n      <tr> \r\n       <td class="pic"> <img data-image-id="3910826" src="https://image.thanhnien.vn/w2048/Uploaded/2022/bahgtm/2022_07_21/thai-2-3830.jpg" data-width="2560" data-height="1697" class="cms-photo" alt="Xét xử vụ bé gái 8 tuổi bị bạo hành tử vong: Tòa cân nhắc khi trình chiếu video hành vi phạm tội  - ảnh 1" caption="Xét xử vụ bé gái 8 tuổi bị bạo hành tử vong: Tòa cân nhắc khi trình chiếu video hành vi phạm tội  - ảnh 1"> </td> \r\n      </tr> \r\n      <tr>\r\n       <td class="caption"><p>Bị cáo Trung Thái và Quỳnh Trang tại phiên tòa sáng 21.7</p>\r\n        <div class="source">\r\n         <p>ngọc dương</p>\r\n        </div></td>\r\n      </tr> \r\n     </tbody>\r\n    </table> \r\n   </div>	77c35c38c3554ea6906730dbcfeca0f2	{tag01,tag02}	A
02	This is title 02	This is name 02	This is description 02	type 02	This is content 02	77c35c38c3554ea6906730dbcfeca0f2	{tag01,tag02}	A
03	This is title 03	This is name 03	This is description 03	type 03	This is content 03	77c35c38c3554ea6906730dbcfeca0f2	{tag01,tag02}	A
04	This is title 04	This is name 04	This is description 04	type 04	This is content 04	77c35c38c3554ea6906730dbcfeca0f2	{tag01,tag02}	A
05	This is title 05	This is name 05	This is description 05	type 05	This is content 05	77c35c38c3554ea6906730dbcfeca0f2	{tag01,tag02}	A
abw6F9-ap	Điều gì đang xảy ra với thị trường xăng dầu?		Việt Nam tự chủ được 70% nguồn cung, có 36 doanh nghiệp đầu mối lo nhập hàng, 17.000 cửa hàng bán lẻ nhưng người dân vẫn không mua được xăng dầu.	Kinh doanh	<p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Ở TP HCM có 550 cửa hàng bán lẻ nhưng theo thống kê của quản lý thị trường, đến chiều qua, 137 cây xăng (chiếm 20% hệ thống) tại 19 quận, huyện thiếu hàng, đóng cửa. Nhiều người dân thậm chí phải dắt bộ xe máy nhiều cây số để tìm nơi đổ xăng.</p><figure data-size="true" itemprop="associatedMedia image" itemscope="" itemtype="http://schema.org/ImageObject" class="tplCaption action_thumb_added" style="letter-spacing: normal; margin-right: auto; margin-bottom: 15px; margin-left: auto; padding: 0px; text-rendering: optimizelegibility; max-width: 100%; clear: both; position: relative; text-align: center; width: 670px; float: left; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><div class="fig-picture" style="margin: 0px; padding: 0px 0px 376.698px; text-rendering: optimizelegibility; width: 670px; float: left; display: table; -webkit-box-pack: center; justify-content: center; background: rgb(240, 238, 234); position: relative;"><picture style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><source data-srcset="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=P5fMzE4p1lqAKYUOuSRUQg 1x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=RjFIqvg2F1YgLt0Db4xEHQ 1.5x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=b4UQ-3_8skwK-EJQfClODA 2x" srcset="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=P5fMzE4p1lqAKYUOuSRUQg 1x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=RjFIqvg2F1YgLt0Db4xEHQ 1.5x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=b4UQ-3_8skwK-EJQfClODA 2x" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><img itemprop="contentUrl" loading="lazy" intrinsicsize="680x0" alt="Hàng trăm xe máy, ôtô vây quanh cây xăng trên đường Tô Ký, quận 12 để chờ đổ xăng sáng nay.  Hầu hết người dân phải chờ hơn 30 phút mới đến lượt đổ xăng. Ảnh: Quỳnh Trần" class="lazy lazied" src="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=P5fMzE4p1lqAKYUOuSRUQg" data-src="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-4371-1665550330.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=P5fMzE4p1lqAKYUOuSRUQg" data-ll-status="loaded" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; border: 0px; font-size: 0px; line-height: 0; max-width: 100%; position: absolute; top: 0px; left: 0px; max-height: 700px; width: 670px;"></picture></div><figcaption itemprop="description" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 670px; float: left; text-align: left;"><p class="Image" style="margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 10px 0px 0px; text-rendering: optimizespeed; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 14px; line-height: 22.4px; font-family: arial;">Hàng trăm xe máy, ôtô vây quanh cây xăng trên đường Tô Ký, quận 12 để chờ đổ xăng sáng nay. Hầu hết người dân phải chờ hơn 30 phút mới đến lượt đổ xăng. Ảnh:&nbsp;<em style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">Đình Văn</em></p></figcaption></figure><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Không chỉ TP HCM, tình trạng này lan ra một số tỉnh, thành khác phía Nam như Bình Dương, Đồng Nai, Bình Phước hay khu vực Tây Nguyên, như Đăk Lăk...</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Riêng trong năm nay, đây không phải lần đầu có tình trạng thiếu xăng, các cửa hàng ngưng bán. Hồi tháng 2, khi nguồn cung từ Lọc dầu Nghi Sơn bị ảnh hưởng, cảnh tượng này đã diễn ra.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Việt Nam hiện sản xuất được 70% nguồn cung xăng dầu trong nước thông qua hai nhà máy lọc dầu, phần còn lại nhập khẩu. Trong chuỗi cung ứng đưa xăng tới người dân, 36 doanh nghiệp đầu mối có chức năng nhập hàng đầu nguồn (từ nhà máy lọc dầu trong nước hoặc nhập từ nước ngoài). Tiếp đến là 500 thương nhân phân phối, những người mua lại từ các đầu mối và bán buôn cho các đại lý và sau cùng là 17.000 cửa hàng xăng dầu trên khắp cả nước. Tuy nhiên, những ngày qua, hệ thống phân phối với hàng chục nghìn điểm chạm này bộc lộ nhiều vấn đề.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Chủ một doanh nghiệp kinh doanh xăng dầu cho rằng, quan trọng nhất trong kinh doanh bán lẻ xăng dầu là nguồn cung, chiết khấu, giá nhưng cả ba yếu tố này đều bất ổn thời gian qua.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><span style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(44, 62, 80);"><strong style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">Đầu tiên là nguồn cung đầu nguồn đã không còn dồi dào như trước.&nbsp;</strong></span>Vụ Thị trường trong nước (Bộ Công Thương) thừa nhận, nguyên nhân chính khiến loạt cửa hàng bán lẻ xăng dầu đóng cửa, ngừng bán xuất phát từ việc các doanh nghiệp đầu mối không có đủ nguồn tài chính để nhập hàng. Họ chỉ duy trì lượng hàng đủ để cung cấp cho hệ thống phân phối của mình và duy trì lượng dự trữ tồn kho theo quy định.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Lãnh đạo một doanh nghiệp tại phía Nam chia sẻ, trước đây 3 tỷ đồng nhập được 2 tàu, nhưng giá hiện đã tăng vọt. "Cùng số tiền đó, giờ chỉ nhập được 1-1,5 tàu, mà vay ngân hàng thì khó do room tín dụng cạn", ông bộc bạch.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Còn theo Bộ Tài chính, nguồn hàng ít hơn một phần vì chính các doanh nghiệp đầu mối hiện cũng e dè hơn khi nhập khẩu do giá thế giới biến động khó lường, nguy cơ thua lỗ cao. Bộ này dẫn số liệu từ hải quan cho thấy, trong quý III, sản lượng nhập khẩu giảm 40% với xăng, 35% với dầu diesel so với quý II. Ngoài 3 đầu mối nhập nhiên liệu cho máy bay, chỉ 19 trong số 33 doanh nghiệp đầu mối xăng dầu còn lại nhập khẩu.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Cũng trong thời gian này, hàng loạt doanh nghiệp đầu mối bị rút giấy phép trong 1-1,5 tháng, đồng nghĩa họ cũng không thể tham gia nhập khẩu hoặc mua từ nguồn trong nước. Sau khi được trả giấy phép, các doanh nghiệp này cũng chưa thể nối lại việc nhập khẩu ngay do thời gian đàm phán mua, hàng về cảng nhanh nhất cũng 2-3 tuần.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Có 5 doanh nghiệp đầu mối xăng dầu được hoãn lại việc rút giấy phép, nhưng sau khi có thông tin xử phạt, nguồn tin của&nbsp;<em style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">VnExpress</em>&nbsp;cho biết, họ cũng bị ngân hàng siết tín dụng, không có nguồn tài chính nên ảnh hưởng tới nhập khẩu hàng.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Tình hình bão lũ xảy ra tại miền Trung vừa qua cũng ảnh hưởng tới tiến độ nhập hàng. Như tại Saigon Petro, kế hoạch nhập 12.000 m3 xăng dầu từ nhà máy lọc dầu trong nước phải dời lại.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><span style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(44, 62, 80);"><strong style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">Tiếp đến là vấn đề về chiết khấu&nbsp;</strong></span>- nguyên nhân chính khiến các doanh nghiệp bán xăng dầu không muốn tiếp tục kinh doanh. Chiết khấu là khoản thoả thuận, giảm giá của đơn vị bán buôn xăng dầu (đầu mối, tổng đại lý, thương nhân phân phối) cho doanh nghiệp bán lẻ, chủ các cây xăng về 0 đồng, thậm chí âm.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Khi nguồn cung dồi dào, giá thế giới giảm, doanh nghiệp đầu mối, thương nhân phân phối tăng chiết khấu cho cửa hàng, đại lý bán lẻ để đẩy lượng bán ra. Ngược lại, giá thế giới tăng, họ giảm mức chiết khấu này.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Thậm chí gần đây xảy ra tình trạng chiết khấu âm. Theo phản ánh của một số chủ doanh nghiệp bán lẻ, các doanh nghiệp phân phối bán ra cho các cây xăng với giá cao hơn giá bán lẻ quy định, bằng cách thu thêm phí vận chuyển vào một hóa đơn khác. Vì thế, khi cộng phí vận chuyển, doanh nghiệp bán hàng ra với mức giá thấp hơn khi họ nhập về, khiến họ bị âm vốn.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Ông Giang Chấn Tây, sở hữu 6 cửa hàng xăng dầu ở Trà Vinh, cho rằng doanh nghiệp bán lẻ là khâu cuối trong chuỗi cung ứng, cung cấp xăng dầu trực tiếp cho người tiêu dùng nhưng không được quan tâm đúng mức. "Càng bán ra càng lỗ. Một mặt do đứt nguồn cung mặt khác chủ cây xăng sợ lỗ nên không dám nhập hàng về", ông giải thích.</p><figure data-size="true" itemprop="associatedMedia image" itemscope="" itemtype="http://schema.org/ImageObject" class="tplCaption action_thumb_added" style="letter-spacing: normal; margin-right: auto; margin-bottom: 15px; margin-left: auto; padding: 0px; text-rendering: optimizelegibility; max-width: 100%; clear: both; position: relative; text-align: center; width: 670px; float: left; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><div class="fig-picture" style="margin: 0px; padding: 0px 0px 502.135px; text-rendering: optimizelegibility; width: 670px; float: left; display: table; -webkit-box-pack: center; justify-content: center; background: rgb(240, 238, 234); position: relative;"><picture style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><source data-srcset="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=ibQmeD9IzrOfguDOvoSJag 1x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hFKGoYR-EK0dS1pITNHYGQ 1.5x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=sB2GKcgXS4mLZqTaBA5i1Q 2x" srcset="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=ibQmeD9IzrOfguDOvoSJag 1x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=1020&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=hFKGoYR-EK0dS1pITNHYGQ 1.5x, https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=sB2GKcgXS4mLZqTaBA5i1Q 2x" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><img itemprop="contentUrl" loading="lazy" intrinsicsize="680x0" alt="Cửa hàng trên đường Cộng Hoà, quận Tân Bình thông báo hết xăng kèm lý do đứt gãy nguồn hàng, ngày 12/10. Ảnh: Quỳnh Trần" class="lazy lazied" src="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=ibQmeD9IzrOfguDOvoSJag" data-src="https://i1-kinhdoanh.vnecdn.net/2022/10/12/-6261-1665558593.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=ibQmeD9IzrOfguDOvoSJag" data-ll-status="loaded" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; border: 0px; font-size: 0px; line-height: 0; max-width: 100%; position: absolute; top: 0px; left: 0px; max-height: 700px; width: 670px;"></picture></div><figcaption itemprop="description" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 670px; float: left; text-align: left;"><p class="Image" style="margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 10px 0px 0px; text-rendering: optimizespeed; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 14px; line-height: 22.4px; font-family: arial;">Cửa hàng trên đường Cộng Hoà, quận Tân Bình thông báo hết xăng kèm lý do "đứt gãy nguồn hàng", ngày 12/10.&nbsp;<em style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">Ảnh: Quỳnh Trần</em></p></figcaption></figure><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><span style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(44, 62, 80);"><strong style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">Giá xăng chưa thỏa đáng&nbsp;</strong></span>cũng là nguyên nhân khiến các doanh nghiệp nói "không muốn tiếp tục kinh doanh". Giá cơ sở xăng dầu mỗi kỳ điều hành do liên Bộ Công Thương - Tài chính quyết định, là căn cứ để xác định mức giá bán lẻ mỗi lít nhiên liệu cho người tiêu dùng. Nhưng theo 36 doanh nghiệp đã gửi đơn kiến nghị lên Thủ tướng, chi phí thực tế chưa được phản ánh đầy đủ và nhà điều hành chậm điều chỉnh các&nbsp;<a href="https://vnexpress.net/se-xem-xet-dieu-chinh-chi-phi-kinh-doanh-xang-dau-4518026.html" rel="dofollow" style="margin: 0px; padding: 0px 0px 1px; text-rendering: optimizelegibility; color: rgb(7, 109, 182); position: relative; text-underline-position: under; border-bottom-width: 1px; border-bottom-style: solid;">chi phí kinh doanh</a><span style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(44, 62, 80);">,&nbsp;</span>kìm giá khiến bất ổn gia tăng.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Trong chi phí kinh doanh có khoản đưa xăng dầu về đến cảng, chi phí vận tải tạo nguồn trong nước... Các phụ phí, chi phí kinh doanh này vừa qua tăng 7-8 lần so với trước đây và chưa được phán ánh đủ trong giá cơ sở. Hiện chi phí vận chuyển từ nước ngoài về Việt Nam đã được Bộ Tài chính điều chỉnh từ kỳ điều hành 21/9; còn chi phí vận chuyển xăng dầu từ nhà máy về cảng và premium trong nước tới hôm qua, ở kỳ điều hành ngày 11/10, mới điều chỉnh</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Do đó, khi chưa được điều chỉnh chi phí hợp lý khiến kinh doanh bị lỗ, nhà cung cấp (đầu mối, thương nhân phân phối) hạn chế bán ra. Điển hình là hơn một tuần nay, từ sau kỳ điều hành 3/10, nguồn cung từ các thương nhân đầu mối bán ra rất ít, chỉ cung cấp một lượng rất nhỏ với những doanh nghiệp có hợp đồng, để "cầm cự qua ngày".</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Ông Lê Văn Mỵ, Tổng giám đốc Công ty cổ phần thương mại Hóc Môn - đơn vị đang sở hữu 11 cửa hàng và 21 đại lý bán lẻ ở TP HCM cho biết, từ đầu năm đến nay công ty ông đã lỗ 8 tỷ đồng. Ông lo ngại nếu vẫn cứ thiếu cung, chiết khấu về 0 đồng, doanh nghiệp có nguy cơ giải thể.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Mỗi ngày tổng sản lượng tiêu thụ xăng dầu bình quân của TP HCM khoảng 6.880 m3, nhưng một tuần qua luôn ghi nhận thiếu hụt. Lãnh đạo một doanh nghiệp tại phía Nam - nơi xảy ra chủ yếu việc khan hiếm xăng - chia sẻ, điều quan trọng trong kinh doanh là lợi nhuận phải đảm bảo, nhưng triền miên khó khăn, thua lỗ từ đầu mối, thương nhân phân phối tới đại lý thì rất khó.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">"Cái gốc là giá, tức là các yếu tố cấu thành trong giá cơ sở phải đảm bảo tính đúng, đủ để ít nhất doanh nghiệp hoà vốn", ông nêu.</p><figure class="item_slide_show clearfix" style="letter-spacing: normal; margin-right: auto; margin-bottom: 20px; margin-left: auto; padding: 0px; text-rendering: optimizelegibility; max-width: 100%; clear: both; position: relative; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><div id="video_parent_364576" class="box_embed_video_parent embed_video_new" data-vcate="1003834" data-vscate="1003004" data-vscaten="Thời sự" data-vid="364576" data-ratio="1" data-articleoriginal="4521984" data-ads="1" data-license="1" data-duration="122" data-brandsafe="0" data-type="0" data-play="1" data-frame="" data-aot="Mua bán căng thẳng ở cây xăng" data-videoclassify="Ban Video" data-initdom="1" data-view="inview" data-auto="1" data-status="play" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; position: relative; overflow: hidden; clear: both;"><div id="embed_video_364576" class="box_embed_video" style="margin: 0px; padding: 0px 0px 376.875px; text-rendering: optimizelegibility; height: 0px; width: 670px; position: relative; background: rgb(225, 225, 225);"><div class="bg_overlay_small_unpin" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"></div><div class="bg_overlay_small" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"></div><div class="embed-container" style="margin: 0px; padding: 0px 0px 376.875px; text-rendering: optimizelegibility; position: relative; height: 0px; overflow: hidden; clear: both; transition-duration: 300ms; transition-property: left; transition-timing-function: cubic-bezier(0.7, 1, 0.7, 1);"><div id="video-364576" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 670px; height: 376.875px;"><div id="parser_player_364576" class="media_content" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 670px; height: 376.875px; position: relative; background: rgb(0, 0, 0);"><div id="videoContainter_364576" class="videoContainter" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 670px; height: 376.875px;"><div class="video-js vjs-default-skin vjs-controls-enabled vjs-workinghover vjs-v7 media-video-364576-dimensions vjs-has-started vjs-paused vjs-ended vjs-user-inactive" data-ex="st=1&amp;bs=0&amp;pt=1" adsconfig="{&quot;adlist&quot;:[{&quot;type&quot;:&quot;preroll&quot;,&quot;tag&quot;:&quot;https:\\/\\/pubads.g.doubleclick.net\\/gampad\\/ads?iu=\\/27973503\\/Vnexpress\\/Desktop\\/Instream.preroll\\/Kinhdoanh\\/Kinhdoanh.detail&amp;description_url=http%3A%2F%2Fvnexpress.net&amp;tfcd=0&amp;npa=0&amp;sz=640x360&amp;gdfp_req=1&amp;output=vast&amp;unviewed_position_start=1&amp;env=vp&amp;impl=s&amp;correlator=&quot;,&quot;skipOffset&quot;:&quot;00:00:06&quot;,&quot;duration&quot;:&quot;00:00:30&quot;},{&quot;type&quot;:&quot;overlay&quot;,&quot;tag&quot;:&quot;&quot;,&quot;script&quot;:&quot;%3Cdiv%20id%3D%22div-gpt-ad-overlay%22%3E%3Cdiv%20style%3D%22height%3A70px%3Bwidth%3A480px%3B%22%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cscript%3Evar%20gR%3D%210%2CsR%3D%22div-overlay-0%22%2BMath.round%281E6%2AMath.random%28%29%29%2CeL%3Ddocument.getElementById%28%22div-gpt-ad-overlay%22%29%3Bif%28eL%29%7BeL.firstChild.id%3DsR%3Bif%28%21window.googletag%7C%7C%21googletag.apiReady%29%7BgR%3D%211%3Bvar%20googletag%3Dwindow.googletag%7C%7C%7Bcmd%3A%5B%5D%7D%2Csb%3Ddocument.getElementsByTagName%28%22script%22%29%5B0%5D%2Csa%3Ddocument.createElement%28%22script%22%29%3Bsa.setAttribute%28%22type%22%2C%22text%2Fjavascript%22%29%3Bsa.setAttribute%28%22src%22%2C%22https%3A%2F%2Fwww.googletagservices.com%2Ftag%2Fjs%2Fgpt.js%22%29%3Bsa.setAttribute%28%22async%22%2C%22true%22%29%3Bsb.parentNode.appendChild%28sa%29%7Dtry%7Bgoogletag.cmd.push%28function%28%29%7Bvar%20a%3Dgoogletag.defineSlot%28%22%2F27973503%2FVnexpress%2FDesktop%2FOverlay%2FKinhdoanh%2FKinhdoanh.detail%22%2C%5B%22fluid%22%2C%20%5B480%2C%2070%5D%5D%2CsR%29%3Ba%26%26%28a.addService%28googletag.pubads%28%29%29%2CgR%3Fgoogletag.pubads%28%29.refresh%28%5Ba%5D%29%3A%28googletag.pubads%28%29.enableSingleRequest%28%29%2Cgoogletag.enableServices%28%29%2Cgoogletag.pubads%28%29.refresh%28%5Ba%5D%29%29%29%7D%29%7Dcatch%28a%29%7B%7D%7D%3B%3C%2Fscript%3E&quot;,&quot;size&quot;:&quot;480x70&quot;,&quot;offset&quot;:&quot;30%&quot;,&quot;skipOffset&quot;:&quot;00:00:01&quot;,&quot;duration&quot;:&quot;00:00:15&quot;}]}" ads="" active-mode="720" data-subtitle="0" max-mode="720" data-mode="240|360|480|720" type="application/x-mpegURL" src="https://d1.vnecdn.net/vnexpress/video/video/web/mp4/,240p,360p,480p,,/2022/10/11/tranh-cai-khi-mua-xang-1665474761/vne/master.m3u8" webkit-playsinline="" playsinline="true" preload="auto" id="media-video-364576" lang="vi" role="region" aria-label="Video Player" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 670px; height: 376.875px; vertical-align: top; color: rgb(255, 255, 255); position: relative; font-size: 10px; line-height: 1; font-family: Arial, Helvetica, sans-serif; user-select: none;"><div class="vjs-text-track-display" aria-live="off" aria-atomic="true" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: absolute; inset: 0px 0px 3em; pointer-events: none; transform: translateY(-2em);"></div><div class="vjs-loading-spinner" dir="ltr" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: absolute; top: 0px; left: 0px; opacity: 0.0001; width: 670px; height: 376.875px; background: url(&quot;data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgeD0iMHB4IiB5PSIwcHgiIHdpZHRoPSI0OHB4IiBoZWlnaHQ9IjQ4cHgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgNDggNDgiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxyZWN0IHg9Ii0wLjA4MyIgZmlsbD0ibm9uZSIgd2lkdGg9IjQ3Ljk5OSIgaGVpZ2h0PSI0OCIvPjxjaXJjbGUgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgY3g9IjI0IiBjeT0iMjQiIHI9IjIwIj48YW5pbWF0ZSAgZmlsbD0icmVtb3ZlIiByZXN0YXJ0PSJhbHdheXMiIGNhbGNNb2RlPSJsaW5lYXIiIGFkZGl0aXZlPSJyZXBsYWNlIiBhY2N1bXVsYXRlPSJub25lIiB0bz0iMCIgZnJvbT0iMzYwIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgZHVyPSIzcyIgYXR0cmlidXRlTmFtZT0ic3Ryb2tlLWRhc2hvZmZzZXQiPjwvYW5pbWF0ZT48YW5pbWF0ZSAgZmlsbD0icmVtb3ZlIiB2YWx1ZXM9IjEwMCAxNTA7MSAyNTAiIHJlc3RhcnQ9ImFsd2F5cyIgY2FsY01vZGU9ImxpbmVhciIgYWRkaXRpdmU9InJlcGxhY2UiIGFjY3VtdWxhdGU9Im5vbmUiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBkdXI9IjNzIiBhdHRyaWJ1dGVOYW1lPSJzdHJva2UtZGFzaGFycmF5Ij48L2FuaW1hdGU+PC9jaXJjbGU+PC9zdmc+&quot;) center center / auto 20% no-repeat rgba(0, 0, 0, 0.7); transition: all 0.5s ease 0s;"><span class="vjs-control-text" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;">Video Player is loading.</span></div><button class="vjs-big-play-button" type="button" title="" aria-disabled="false" style="padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border-width: initial; border-style: none; border-color: initial; outline: 0px; background: url(&quot;data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNi4wLjMsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iNTBweCIgaGVpZ2h0PSI1MHB4IiB2aWV3Qm94PSItMSAtMSA1MCA1MCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAtMSAtMSA1MCA1MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cmVjdCB4PSItMSIgeT0iLTEiIGZpbGw9Im5vbmUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIvPg0KPGNpcmNsZSBmaWxsPSJub25lIiBzdHJva2U9IiNGRkZGRkYiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBjeD0iMjQiIGN5PSIyNCIgcj0iMjIuNSIvPg0KPHBvbHlnb24gZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSIxOC41MzEsMTEuNTg3IDE4LjUzMSwzNi40MTMgMzcuMjgsMjQgIi8+DQo8L3N2Zz4NCg==&quot;) center center / auto 20% no-repeat rgba(0, 0, 0, 0.1); transition: all 0.5s ease 0s; appearance: none; position: absolute; top: 0px; left: 0px; opacity: 0.85; width: 670px; height: 376.875px;"><span aria-hidden="true" class="vjs-icon-placeholder" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;"></span><span class="vjs-control-text" aria-live="polite" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;"></span></button><div class="vjs-control-bar" dir="ltr" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; display: flex; width: 670px; position: absolute; bottom: 0px; left: 0px; right: 0px; height: 5em; background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8)); visibility: visible; opacity: 1; transition: visibility 0.1s ease 0s, opacity 0.1s ease 0s;"><button class="vjs-play-control vjs-control vjs-button vjs-paused vjs-ended" type="button" title="Replay" aria-disabled="false" style="padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border-width: initial; border-style: none; border-color: initial; outline: 0px; background-image: initial; background-position: 0px 0px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; transition: none 0s ease 0s; appearance: none; position: relative; height: 50px; width: 5em; flex: 0 0 auto;"><span aria-hidden="true" class="vjs-icon-placeholder" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; cursor: pointer; flex: 0 0 auto; font-family: VideoJS !important;"></span><span class="vjs-control-text" aria-live="polite" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;">Replay</span></button><div class="vjs-current-time vjs-time-control vjs-control" style="margin: 0px; padding: 0px 0.1em; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-align: center; height: 50px; width: auto; flex: 0 0 auto; font-size: 1.4em; line-height: 3.5em; min-width: 0.5em;"><span class="vjs-control-text" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;">Hiện tại&nbsp;</span><span class="vjs-current-time-display" aria-live="off" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;">2:02</span></div><div class="vjs-time-control vjs-time-divider" style="margin: 0px; padding: 0px 0.1em; box-sizing: inherit; text-rendering: optimizelegibility; line-height: 3.5em; flex: 0 0 auto; font-size: 1.4em; min-width: 0.5em; width: auto;"><div style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;"><span style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;">/</span></div></div><div class="vjs-duration vjs-time-control vjs-control" style="margin: 0px; padding: 0px 0.1em; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-align: center; height: 50px; width: auto; flex: 0 0 auto; font-size: 1.4em; line-height: 3.5em; min-width: 0.5em;"><span class="vjs-control-text" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;">Thời lượng&nbsp;</span><span class="vjs-duration-display" aria-live="off" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;">2:02</span></div><div class="vjs-progress-control vjs-control" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-align: center; height: 50px; width: 5em; flex: 1 1 auto; cursor: pointer; display: flex; -webkit-box-align: center; align-items: center; min-width: 4em;"><div tabindex="0" class="vjs-progress-holder vjs-slider vjs-slider-horizontal" role="slider" aria-valuenow="100.00" aria-valuemin="0" aria-valuemax="100" aria-label="Progress Bar" aria-valuetext="2:02 of 2:02" style="margin: 0px 10px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; flex: 1 1 auto; transition: all 0.2s ease 0s; height: 0.5em; position: relative; cursor: pointer; user-select: none; background-color: rgba(255, 255, 255, 0.3);"><div class="vjs-load-progress" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; background: rgba(200, 200, 200, 0.3); overflow: hidden; position: absolute; height: 5px; width: 432.906px; left: 0px; top: 0px;"><span class="vjs-control-text" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;"><span style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;">Đã tải</span>: 0%</span><div style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; position: absolute; height: 5px; width: 432.615px; left: 0.28125px; top: 0px;"></div></div><div class="vjs-play-progress vjs-slider-bar" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; background-color: rgb(159, 34, 78); position: absolute; height: 5px; width: 432.917px; left: 0px; top: 0px; font-family: VideoJS !important;"><div class="vjs-time-tooltip" style="margin: 0px; padding: 6px 8px 8px; box-sizing: inherit; text-rendering: optimizelegibility; font-family: Arial, Helvetica, sans-serif; background-color: rgba(255, 255, 255, 0.8); border-radius: 0.3em; color: rgb(0, 0, 0); float: right; font-size: 1em; pointer-events: none; position: relative; top: -3.4em; visibility: hidden; z-index: 1; right: -17.7344px;"></div><span class="vjs-control-text" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;"><span style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility;">Tiến trình</span>: 0%</span></div></div></div><div class="vjs-volume-panel vjs-control vjs-volume-panel-vertical" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-align: center; height: 50px; width: 5em; flex: 0 0 auto; transition: width 1s ease 0s; display: flex;"><button class="vjs-mute-control vjs-control vjs-button vjs-vol-0" type="button" title="Bỏ tắt tiếng" aria-disabled="false" style="padding: 0px 2em 3em; box-sizing: inherit; text-rendering: optimizelegibility; border-width: initial; border-style: none; border-color: initial; outline: 0px; background-image: initial; background-position: 0px 0px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; transition: none 0s ease 0s; appearance: none; width: 5em; height: 50px; position: relative; flex: 0 0 auto;"><span aria-hidden="true" class="vjs-icon-placeholder" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; font-family: VideoJS !important;"></span><span class="vjs-control-text" aria-live="polite" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;">Bỏ tắt tiếng</span></button><div class="vjs-volume-control vjs-control vjs-volume-vertical" style="margin: 0px 1em 0px -1px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; height: 8em; width: 3em; flex: 0 0 auto; cursor: pointer; display: flex; bottom: 8em; background-color: rgba(43, 51, 63, 0.7); visibility: visible; opacity: 0; left: -3.5em; transition: visibility 1s ease 0s, opacity 1s ease 0s, height 1s ease 1s, width 1s ease 1s, left 1s ease 1s, top 1s ease 1s;"><div tabindex="0" class="vjs-volume-bar vjs-slider-bar vjs-slider vjs-slider-vertical" role="slider" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" aria-label="Volume Level" aria-live="polite" aria-valuetext="0%" style="margin: 1.35em auto; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; cursor: pointer; user-select: none; background-color: rgba(255, 255, 255, 0.3); width: 0.5em; height: 5em;"><div class="vjs-volume-level" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; position: absolute; bottom: 0px; left: 0px; background-color: rgb(159, 34, 78); width: 0.5em; height: 0px; font-family: VideoJS !important;"><span class="vjs-control-text" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;"></span></div></div></div></div><button class="vjs-fullscreen-control vjs-control vjs-button" type="button" title="Toàn màn hình" aria-disabled="false" style="padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border-width: initial; border-style: none; border-color: initial; outline: 0px; background-image: initial; background-position: 0px 0px; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; transition: none 0s ease 0s; appearance: none; position: relative; height: 50px; width: 5em; flex: 0 0 auto;"><span aria-hidden="true" class="vjs-icon-placeholder" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; font-family: VideoJS !important;"></span><span class="vjs-control-text" aria-live="polite" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; border: 0px; clip: rect(0px, 0px, 0px, 0px); height: 1px; overflow: hidden; position: absolute; width: 1px;">Toàn màn hình</span></button></div><div class="fp-sound-status-container" id="364576_soundTopRight" style="margin: 0px; padding: 0px; box-sizing: inherit; text-rendering: optimizelegibility; opacity: 0; position: absolute; top: 15px; right: 15px; min-width: 108px; width: auto; height: 32px; border-radius: 16px; background-color: rgba(0, 0, 0, 0.8); text-align: center; font-size: 12px; line-height: 32px; transition: opacity 2s ease 0s;"></div><div class="share-hover" style="margin: 0px; padding: 10px 15px; box-sizing: inherit; text-rendering: optimizelegibility; display: flex; -webkit-box-pack: end; justify-content: flex-end; width: 670px; height: 55px; position: absolute; top: 0px; left: 0px;"><a class="share-item" style="margin: 0px 0px 0px 10px; padding: 5px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-underline-position: under; display: block; z-index: 1; height: 26px; color: rgb(255, 255, 255) !important; border-bottom-width: 0px !important;"><svg class="ic ic-face"><use xlink:href="#Facebook"></use></svg></a><a class="share-item" style="margin: 0px 0px 0px 10px; padding: 5px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-underline-position: under; display: block; z-index: 1; height: 26px; color: rgb(255, 255, 255) !important; border-bottom-width: 0px !important;"><svg class="ic ic-twit"><use xlink:href="#Twitter"></use></svg></a><a class="share-item" style="margin: 0px 0px 0px 10px; padding: 5px; box-sizing: inherit; text-rendering: optimizelegibility; position: relative; text-underline-position: under; display: block; z-index: 1; height: 26px; color: rgb(255, 255, 255) !important; border-bottom-width: 0px !important;"><svg class="ic ic-link"><use xlink:href="#Link"></use></svg></a></div></div></div></div></div></div></div></div><figcaption class="desc_cation" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><div class="inner_caption" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><p class="Image" style="margin-right: 0px; margin-bottom: 0px; margin-left: 0px; padding: 10px 0px 0px; text-rendering: optimizespeed; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 14px; line-height: 22.4px; font-family: arial;">Không khí căng thẳng khi mua xăng tại TP HCM. Video:&nbsp;<em style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">Thịnh Việt - Điệp Khang</em></p></div></figcaption></figure><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);"><span style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(44, 62, 80);"><strong style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">"Điều hành của hai bộ Công Thương, Tài chính&nbsp;<a href="https://vnexpress.net/doanh-nghiep-to-bo-cong-thuong-tai-chinh-dieu-hanh-xang-dau-co-van-de-4520554.html" rel="dofollow" style="margin: 0px; padding: 0px 0px 1px; text-rendering: optimizelegibility; color: rgb(7, 109, 182); position: relative; text-underline-position: under; border-bottom-width: 1px; border-bottom-style: solid;">có vấn đề</a>",</strong></span>&nbsp;theo 36 doanh nghiệp kinh doanh tại TP HCM. Hai cơ quan được giao nhiệm vụ điều hành thị trường và&nbsp;<a href="https://vnexpress.net/chu-de/gia-xang-hom-nay-3026" rel="dofollow" style="margin: 0px; padding: 0px 0px 1px; text-rendering: optimizelegibility; color: rgb(7, 109, 182); position: relative; text-underline-position: under; border-bottom-width: 1px; border-bottom-style: solid;">giá xăng dầu&nbsp;</a>thời gian qua bị doanh nghiệp cho rằng "phản ứng chậm, và đùn đẩy trách nhiệm".</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Trước khi quyết định điều chỉnh chi phí kinh doanh xăng dầu được Bộ Tài chính đưa ra ngày 7/10, Bộ Công Thương cho hay đã ít nhất 4 lần đề xuất cơ quan này điều chỉnh, nhưng chưa được đồng thuận. Bộ này đánh giá việc điều chỉnh chậm là nguyên nhân khiến chiết khấu giảm về 0, cửa hàng bán lẻ bị lỗ...</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Trong khi đó, Bộ Tài chính cho rằng việc đảm bảo nguồn cung xăng dầu, các chi phí trung gian, tiết giảm chi phí quản trị doanh nghiệp xăng dầu thuộc trách nhiệm của Bộ Công Thương và các doanh nghiệp.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Bộ trưởng Tài chính Hồ Đức Phớc ngày 10/10 thừa nhận có trách nhiệm trong đưa ra chi phí định mức kinh doanh xăng dầu và tham mưu Chính phủ trình Quốc hội các khoản thuế phí với xăng dầu. Tuy nhiên, quản lý doanh nghiệp đầu mối, doanh nghiệp phân phối và bán lẻ thuộc về trách nhiệm của Bộ Công Thương.</p><div class="width_common box-tinlienquanv2 " style="letter-spacing: normal; margin-bottom: 20px; padding: 15px; text-rendering: optimizelegibility; width: 670px; float: left; background-image: initial; background-position: initial; background-size: initial; background-repeat: initial; background-attachment: initial; background-origin: initial; background-clip: initial; border: 1px solid rgb(229, 229, 229); color: rgb(34, 34, 34); font-family: arial; font-size: 18px;"><article class="item-news" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; width: 638px; float: left; border-bottom: none;"><div class="thumb-art" style="margin: 0px 10px 0px 0px; padding: 0px; text-rendering: optimizelegibility; position: relative; float: left; width: 145px;"><a href="https://vnexpress.net/doanh-nghiep-to-bo-cong-thuong-tai-chinh-dieu-hanh-xang-dau-co-van-de-4520554.html" data-itm-source="#vn_source=Detail-KinhDoanh_ViMo-4521590&amp;vn_campaign=Box-TinXemThem&amp;vn_medium=Item-1&amp;vn_term=Desktop&amp;vn_thumb=1" class="thumb thumb-5x3" title="Doanh nghiệp xăng dầu: Bộ Công Thương, Tài chính 'điều hành có vấn đề'" data-itm-added="1" style="margin: 0px; padding: 0px 0px 87px; text-rendering: optimizelegibility; color: rgb(7, 109, 182); text-decoration-line: underline; display: block; overflow: hidden; height: 0px; position: relative; width: 145px; background: rgb(244, 244, 244); text-underline-position: under;"><picture style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><source data-srcset="https://i1-kinhdoanh.vnecdn.net/2022/10/07/-1507-1665148345.jpg?w=180&amp;h=108&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=fB3_KEuch8SjEI_kAWsgSg 1x, https://i1-kinhdoanh.vnecdn.net/2022/10/07/-1507-1665148345.jpg?w=180&amp;h=108&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=aEt0kGO9WFmxC0uymfC6mA 2x" srcset="https://i1-kinhdoanh.vnecdn.net/2022/10/07/-1507-1665148345.jpg?w=180&amp;h=108&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=fB3_KEuch8SjEI_kAWsgSg 1x, https://i1-kinhdoanh.vnecdn.net/2022/10/07/-1507-1665148345.jpg?w=180&amp;h=108&amp;q=100&amp;dpr=2&amp;fit=crop&amp;s=aEt0kGO9WFmxC0uymfC6mA 2x" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;"><img loading="lazy" intrinsicsize="180x108" alt="Doanh nghiệp xăng dầu\\: Bộ Công Thương, Tài chính 'điều hành có vấn đề'" class="lazy lazied" src="https://i1-kinhdoanh.vnecdn.net/2022/10/07/-1507-1665148345.jpg?w=180&amp;h=108&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=fB3_KEuch8SjEI_kAWsgSg" data-src="https://i1-kinhdoanh.vnecdn.net/2022/10/07/-1507-1665148345.jpg?w=180&amp;h=108&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=fB3_KEuch8SjEI_kAWsgSg" data-ll-status="loaded" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; border: 0px; font-size: 0px; line-height: 0; max-width: 100%; position: absolute; inset: 0px; object-fit: cover; width: 145px; height: 87px;"></picture></a></div><h4 class="title-news" style="margin-top: 0px; margin-bottom: 5px; padding: 0px; text-rendering: optimizelegibility; line-height: 24px; font-feature-settings: &quot;pnum&quot;, &quot;lnum&quot;; font-family: Merriweather, serif;"><a href="https://vnexpress.net/doanh-nghiep-to-bo-cong-thuong-tai-chinh-dieu-hanh-xang-dau-co-van-de-4520554.html" data-itm-source="#vn_source=Detail-KinhDoanh_ViMo-4521590&amp;vn_campaign=Box-TinXemThem&amp;vn_medium=Item-1&amp;vn_term=Desktop&amp;vn_thumb=1" title="Doanh nghiệp xăng dầu: Bộ Công Thương, Tài chính 'điều hành có vấn đề'" data-itm-added="1" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(34, 34, 34); transition-duration: 200ms; transition-property: all; transition-timing-function: cubic-bezier(0.7, 1, 0.7, 1); position: relative; text-underline-position: under;">Doanh nghiệp xăng dầu: Bộ Công Thương, Tài chính 'điều hành có vấn đề'</a></h4><p class="description" style="padding: 0px; text-rendering: optimizespeed; line-height: 22.4px; font-size: 14px;"><a data-itm-source="#vn_source=Detail-KinhDoanh_ViMo-4521590&amp;vn_campaign=Box-TinXemThem&amp;vn_medium=Item-1&amp;vn_term=Desktop&amp;vn_thumb=1" href="https://vnexpress.net/doanh-nghiep-to-bo-cong-thuong-tai-chinh-dieu-hanh-xang-dau-co-van-de-4520554.html" title="Doanh nghiệp xăng dầu: Bộ Công Thương, Tài chính 'điều hành có vấn đề'" data-itm-added="1" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; color: rgb(7, 109, 182); text-decoration-line: underline; position: relative; text-underline-position: under;">Các doanh nghiệp cho rằng cơ quan quản lý điều hành xăng dầu trái với quy luật cung cầu, để giá mua cao hơn bán khiến nhiều cây xăng thua lỗ, đóng cửa.</a>&nbsp;<span class="meta-news" style="margin: 0px 0px 0px 5px; padding: 0px; text-rendering: optimizelegibility; color: rgb(117, 117, 117); font-size: 12px; line-height: 14px; font-family: Arial; float: none; display: inline-block; vertical-align: middle; font-weight: 400 !important;"><a class="count_cmt" href="https://vnexpress.net/doanh-nghiep-to-bo-cong-thuong-tai-chinh-dieu-hanh-xang-dau-co-van-de-4520554.html#box_comment_vne" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility; text-decoration-line: underline; position: relative; text-underline-position: under; display: inline-block; white-space: nowrap; color: rgb(7, 109, 182) !important;"><svg class="ic ic-comment"><use xlink:href="#Comment-Reg"></use></svg>&nbsp;<span class="font_icon widget-comment-4520554-1" style="margin: 0px; padding: 0px; text-rendering: optimizelegibility;">230</span></a></span></p></article></div><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Các phụ phí, chi phí kinh doanh xăng dầu thực tế đã được điều chỉnh từ kỳ điều hành 11/10, song theo các doanh nghiệp, vẫn có độ trễ. Theo họ, nếu nhà chức trách rà soát, điều chỉnh các chi phí này từ kỳ điều hành trong tháng 9, thuận lợi hơn nhiều do thời điểm này giá xuống thấp. Còn với kỳ điều hành 11/10,&nbsp;<a href="https://vnexpress.net/gia-xang-dau-ngay-mai-co-the-tang-tro-lai-4521151.html" rel="dofollow" style="margin: 0px; padding: 0px 0px 1px; text-rendering: optimizelegibility; color: rgb(7, 109, 182); position: relative; text-underline-position: under; border-bottom-width: 1px; border-bottom-style: solid;">giá xăng đã tăng trở lại</a>&nbsp;sau 3 kỳ giảm liên tiếp.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">PGS.TS Đinh Trọng Thịnh cũng cho rằng "đang có vấn đề" trong điều hành thị trường xăng dầu của liên Bộ. Theo ông, cơ chế giữa doanh nghiệp đầu mối - phân phối và bán lẻ chưa rõ ràng; nên chuyện "ép giá" xảy ra. Bộ Công Thương cũng chưa tính đúng, tính đủ nhu cầu và sản lượng tiêu thụ của từng địa phương.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">"Cần phải cụ thể từng tháng, từng quý để đảm bảo nhu cầu, không để thiếu đột xuất", ông nhìn nhận. Ngoài ra, quy định về kiểm tra, phân phối hạn mức nhập khẩu đã có, nhưng việc giám sát các đầu mối có nhập đúng, đủ theo đúng thời hạn quy định hay không, lại chưa chặt chẽ, khiến thực tế quý III vừa qua có tới 2/3 đầu mối không nhập khẩu, gây thiếu hụt nguồn hàng.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Ở góc độ cơ quan quản lý giá xăng dầu, Bộ Tài chính chưa kịp thời cập nhật những thay đổi về chi phí trong cơ cấu giá bán, khiến doanh nghiệp thua lỗ.</p><p class="Normal" style="letter-spacing: normal; margin-right: 0px; margin-bottom: 1em; margin-left: 0px; padding: 0px; text-rendering: optimizespeed; line-height: 28.8px; color: rgb(34, 34, 34); font-family: arial; font-size: 18px; background-color: rgb(252, 250, 246);">Tại phiên họp thứ 16 của Uỷ ban Thường vụ Quốc hội ngày 11/10, Ủy ban Kinh tế khi thẩm tra báo cáo kinh tế xã hội 2022, kế hoạch 2023 của Chính phủ cũng đề nghị phân tích rõ nguyên nhân trong điều hành giá xăng dầu. Việc này để rút ra bài học kinh nghiệm và có giải pháp ứng phó phù hợp, kịp thời khi giá xăng dầu thế giới có những diễn biến bất lợi trong tương lai.</p>	AWvaYDttM	\N	
\.


--
-- Data for Name: articlecomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlecomment (commentid, commentthreadid, id, author, comment, "time", updatedat, histories) FROM stdin;
35vJP2Lnb	j3xlD3DIt	abw6F9-ap	uEyz9MqaM	test 3	2022-11-08 13:03:04.285+07	\N	\N
rkKu76p-r	j3xlD3DIt	abw6F9-ap	uEyz9MqaM	test 4	2022-11-08 13:03:19.611+07	\N	\N
luSQpIQlO	XstrMmbor	abw6F9-ap	uEyz9MqaM	game cho * choi a	2022-11-09 17:01:30.371+07	\N	{}
fV3_2Jcnv	XstrMmbor	abw6F9-ap	uEyz9MqaM	best ending	2022-11-09 17:13:10.788+07	\N	{}
patkthInN	0v79DeRaC	abw6F9-ap	uEyz9MqaM	aaaa	2022-11-10 11:04:48.333+07	\N	{}
r3Jyws4it	0v79DeRaC	abw6F9-ap	uEyz9MqaM	soloko	2022-11-10 13:45:20.124+07	\N	{}
5ao19HoT1	BwscWRPYB	abw6F9-ap	uEyz9MqaM	fine	2023-03-27 13:57:22.833+07	\N	{}
D_j7MhdTU	Peo0sio7x	abw6F9-ap	uEyz9MqaM	!@#	2023-03-27 14:48:50.738+07	\N	{}
HKYriMyKE	BwscWRPYB	abw6F9-ap	uEyz9MqaM	water	2023-03-28 14:43:17.364+07	\N	{}
4le5TenHE	BwscWRPYB	abw6F9-ap	uEyz9MqaM	loo	2023-03-28 14:50:06.049+07	\N	{}
ArJsh0Y0t	CaP4JWfMW	abw6F9-ap	pu65Tr6FE	yo	2023-04-03 10:17:13.629+07	\N	{}
CVxNU5xOe	7qUfAFE_z	abw6F9-ap	pu65Tr6FE	hi	2023-04-03 14:22:53.619+07	\N	{}
\.


--
-- Data for Name: articlecommentinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlecommentinfo (commentid, replycount, usefulcount) FROM stdin;
CVxNU5xOe	0	1
\.


--
-- Data for Name: articlecommentreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlecommentreaction (commentid, author, userid, "time", reaction) FROM stdin;
CVxNU5xOe	pu65Tr6FE	pu65Tr6FE	2023-04-03 14:22:55.016+07	1
\.


--
-- Data for Name: articlecommentthread; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlecommentthread (commentid, id, author, comment, "time", updatedat, histories) FROM stdin;
7qUfAFE_z	abw6F9-ap	pu65Tr6FE	yup	2023-04-03 14:22:28.309+07	\N	{}
\.


--
-- Data for Name: articlecommentthreadinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlecommentthreadinfo (commentid, replycount, usefulcount) FROM stdin;
0v79DeRaC	2	0
UhZ1uBuNi	0	1
xHeq3KlUq	0	0
XstrMmbor	2	0
Peo0sio7x	1	0
BwscWRPYB	3	0
CaP4JWfMW	1	0
7qUfAFE_z	1	1
\.


--
-- Data for Name: articlecommentthreadreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlecommentthreadreaction (commentid, author, userid, "time", reaction) FROM stdin;
7qUfAFE_z	pu65Tr6FE	pu65Tr6FE	2023-04-03 14:22:45.504+07	1
\.


--
-- Data for Name: articleinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articleinfo (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
abw6F9-ap	3.2000000000000000	0	0	4	1	0	5	16
\.


--
-- Data for Name: articlerate; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articlerate (id, author, rate, "time", review, usefulcount, replycount, histories, anonymous) FROM stdin;
abw6F9-ap	uEyz9MqaM	3	2023-03-27 16:37:42.861	a	1	2	{"{\\"rate\\": 4, \\"time\\": \\"2023-03-27T02:27:57.032Z\\", \\"review\\": \\"hi\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-03-27T02:32:15.778Z\\", \\"review\\": \\"yolo\\"}"}	\N
\.


--
-- Data for Name: articleratecomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articleratecomment (commentid, id, author, userid, comment, "time", updatedat, histories, anonymous) FROM stdin;
LPRa64I3p	abw6F9-ap	uEyz9MqaM	uEyz9MqaM	yooo	2023-03-27 09:58:46.409	\N	\N	t
jf1hIVDHf	abw6F9-ap	uEyz9MqaM	uEyz9MqaM	yolo	2023-03-27 11:01:08.198	\N	\N	f
\.


--
-- Data for Name: articleratereaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.articleratereaction (id, author, userid, "time", reaction) FROM stdin;
abw6F9-ap	uEyz9MqaM	pu65Tr6FE	2023-04-03 09:21:09.311	1
\.


--
-- Data for Name: authencodes; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.authencodes (id, code, expiredat) FROM stdin;
\.


--
-- Data for Name: authentication; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.authentication (id, password, failcount, lockeduntiltime, successtime, failtime) FROM stdin;
\.


--
-- Data for Name: brand; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.brand (brand) FROM stdin;
Sony
Samsung
Canon
Nikon
Olypus
Xiaomi
Apple
Disney
\.


--
-- Data for Name: category; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.category (categoryid, categoryname, status, createdby, createdat, updatedby, updatedat) FROM stdin;
action	action	A	\N	\N	\N	\N
comedy	comedy	A	\N	\N	\N	\N
camera	camera	A	\N	\N	\N	\N
mobiphone	mobiphone	A	\N	\N	\N	\N
technological	technological	A	\N	\N	\N	\N
apple	apple	A	\N	\N	\N	\N
laptop	laptop	A	\N	\N	\N	\N
\.


--
-- Data for Name: cinema; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.cinema (id, name, address, parent, status, latitude, longitude, imageurl, createdby, createdat, updatedby, updatedat, gallery, coverurl) FROM stdin;
CGV1	CGV Thu Duc	216 Đ. Võ Văn Ngân, Bình Thọ, Thủ Đức, T	CGV	A	\N	\N	https:/storage.googleapis.com/go-firestore-rest-api.appspot.com/sub/PvYGRnrtp_pup.jpg	\N	\N	\N	\N	{"{\\"url\\": \\"https:/storage.googleapis.com/go-firestore-rest-api.appspot.com/sub/O6EC3CztM_dog3.jfif\\", \\"type\\": \\"image\\"}","{\\"url\\": \\"https:/storage.googleapis.com/go-firestore-rest-api.appspot.com/sub/trvCFk-tp_pup.jpg\\", \\"type\\": \\"image\\"}"}	https:/storage.googleapis.com/go-firestore-rest-api.appspot.com/sub/hiF_Fk-tM_cover.jpg
\.


--
-- Data for Name: company; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.company (id, name, description, address, size, status, establishedat, categories, imageurl, coverurl, gallery) FROM stdin;
id1	Softwave company	This is description	 Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh	500	A	2022-07-21 00:00:00+07	{Categories1,Categories2}	https://maisonoffice.vn/wp-content/uploads/2021/09/toa-nha-hung-vuong-plaza.jpg	\N	\N
id2	Softwave company	This is description	 Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh	500	A	2022-07-21 00:00:00+07	{Categories1,Categories2}	https://maisonoffice.vn/wp-content/uploads/2021/09/toa-nha-hung-vuong-plaza.jpg	\N	\N
id3	Softwave company	This is description	 Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh	500	A	2022-07-21 00:00:00+07	{Categories1,Categories2}	https://maisonoffice.vn/wp-content/uploads/2021/09/toa-nha-hung-vuong-plaza.jpg	\N	\N
id4	Softwave company	This is description	 Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh	500	I	2022-07-21 00:00:00+07	{Categories1,Categories2}	https://maisonoffice.vn/wp-content/uploads/2021/09/toa-nha-hung-vuong-plaza.jpg	\N	\N
id5	Softwave company	This is description	 Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh	500	I	2022-07-21 00:00:00+07	{Categories1,Categories2}	https://maisonoffice.vn/wp-content/uploads/2021/09/toa-nha-hung-vuong-plaza.jpg	\N	\N
\.


--
-- Data for Name: company_users; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.company_users (company_id, user_id) FROM stdin;
odltd	h3-bIa9tp
odltd	mPOdF3rap
odltd	1c7TAkSsA
id2	1c7TAkSsA
\.


--
-- Data for Name: companycategory; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companycategory (categoryid, categoryname, status, createdby, createdat, updatedby, updatedat) FROM stdin;
Entertainment	Entertainment	A	\N	\N	\N	\N
Financial business	Financial business	A	\N	\N	\N	\N
Industrial production	Industrial production	A	\N	\N	\N	\N
Real estate business	Real estate business	A	\N	\N	\N	\N
Business services	Business services	A	\N	\N	\N	\N
\.


--
-- Data for Name: companycomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companycomment (commentid, id, author, userid, comment, "time", updatedat, histories) FROM stdin;
\.


--
-- Data for Name: companyrate; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyrate (id, author, rate, "time", review, usefulcount, replycount, histories) FROM stdin;
\.


--
-- Data for Name: companyratefullinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyratefullinfo (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
id2	2.799999952316284	4	3	4	2	1	1	2.799999952316284
\.


--
-- Data for Name: companyrateinfo01; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyrateinfo01 (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
id2	4	0	0	0	1	0	1	4
\.


--
-- Data for Name: companyrateinfo02; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyrateinfo02 (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
id2	3	0	0	1	0	0	1	3
\.


--
-- Data for Name: companyrateinfo03; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyrateinfo03 (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
id2	4	0	0	0	1	0	1	4
\.


--
-- Data for Name: companyrateinfo04; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyrateinfo04 (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
id2	2	0	1	0	0	0	1	2
\.


--
-- Data for Name: companyrateinfo05; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyrateinfo05 (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
id2	1	1	0	0	0	0	1	1
\.


--
-- Data for Name: companyratereaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.companyratereaction (id, author, userid, "time", reaction) FROM stdin;
id2	h3-bIa9tp	h3-bIa9tp	2022-11-05 07:45:05.676442	1
\.


--
-- Data for Name: countries; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.countries (country) FROM stdin;
Vietnam
United State
England
Chinese
Australia
\.


--
-- Data for Name: film; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.film (id, title, description, imageurl, trailerurl, categories, directors, casts, productions, countries, language, writer, gallery, coverurl, status, createdby, createdat, updatedby, updatedat) FROM stdin;
00001	The Shawshank Redemption	\N	https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg	https://www.imdb.com/video/vi3877612057?playlistId=tt0111161&ref_=tt_pr_ov_vi	{drama}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00002	Thor: Love and Thunder	\N	https://genk.mediacdn.vn/139269124445442048/2022/4/19/2-16503255592162067496114.jpg	https://www.youtube.com/watch?v=tgB1wUcmbbw	{drama,crime}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00003	Top Gun: Maverick	\N	https://www.cgv.vn/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/t/o/top_gun_maverick_-_poster_28.03_1_.jpg	https://www.youtube.com/watch?v=yM389FbhlRQ	{action,drama}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00004	The Batman	\N	https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/o/poster_batman-1.jpg	https://youtu.be/761uRaAoW00	{action,crime,drama}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00005	The Sadness	\N	https://phimnhua.com/wp-content/uploads/2022/04/phimnhua_1650248826.jpg	https://www.youtube.com/watch?v=axjme4v-xRo	{horror}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00006	Doctor Strange in the Multiverse of Madness	\N	https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg	https://www.imdb.com/video/vi3877612057?playlistId=tt0111161&ref_=tt_pr_ov_vi	{action,adventure,fantasy}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00007	Fantastic Beasts: The Secrets of Dumbledore	\N	https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2022/04/review-phim-sinh-vat-huyen-bi-3-fantastic-beasts-3-2-696x1031.jpg?fit=700%2C20000&quality=95&ssl=1	https://youtu.be/Y9dr2zw-TXQ	{family,adventure,fantasy}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00008	The Adam Project	\N	http://photos.q00gle.com/storage/files/images-2021/images-movies/09/622b6789e7084.jpg	https://youtu.be/IE8HIsIrq4o	{action,comedy,adventure}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00009	Spider-Man: No Way Home	\N	https://gamek.mediacdn.vn/133514250583805952/2021/11/17/photo-1-1637118381839432740223.jpg	https://www.youtube.com/watch?v=OB3g37GTALc	{action,adventure,fantasy}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
00010	Dune	\N	https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/d/u/dune-poster-1.jpg	https://youtu.be/8g18jFHCLXk	{action,adventure,drama}	\N	\N	\N	\N	\N	\N	\N	\N	A	\N	\N	\N	\N
\.


--
-- Data for Name: filmcasts; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmcasts (actor) FROM stdin;
Will Smith
Leonardo DiCaprio
Tom Hanks
Samuel L. Jackson
Robert Downey Jr.
Johnny Deep
Benedict Cumberbatch
\.


--
-- Data for Name: filmcategory; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmcategory (categoryid, categoryname, status, createdby, createdat, updatedby, updatedat) FROM stdin;
adventure	adventure	A	\N	\N	\N	\N
animated	animated	A	\N	\N	\N	\N
comedy	comedy	A	\N	\N	\N	\N
drama	drama	A	\N	\N	\N	\N
horror	horror	A	\N	\N	\N	\N
crime	crime	A	\N	\N	\N	\N
fantasy	fantasy	A	\N	\N	\N	\N
family	family	A	\N	\N	\N	\N
\.


--
-- Data for Name: filmcommentthread; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmcommentthread (commentid, id, author, comment, "time", updatedat, histories) FROM stdin;
7_Pblhrzn	00002	uEyz9MqaM	hi	2023-03-29 14:07:55.007+07	\N	{}
zfVUyEgHR	00002	pu65Tr6FE	hi	2023-04-03 09:19:55.2+07	\N	{}
c0cWhmwdG	00001	pu65Tr6FE	yo	2023-04-03 13:50:22.819+07	\N	{}
F5jCAtR9_	00001	pu65Tr6FE	a	2023-04-07 09:41:51.653+07	\N	\N
r3agdZQcJ	00001	pu65Tr6FE	b	2023-04-07 09:41:54.213+07	\N	\N
6QPDwt6b5	00001	pu65Tr6FE	c	2023-04-07 09:41:56.864+07	\N	\N
YL93OqP_L	00001	pu65Tr6FE	d	2023-04-07 09:41:59.205+07	\N	\N
hSU_DwgzF	00001	pu65Tr6FE	e	2023-04-07 09:42:01.597+07	\N	\N
GLNCpyjmd	00001	pu65Tr6FE	f	2023-04-07 09:42:03.832+07	\N	\N
QUuNhgAv1	00001	pu65Tr6FE	g	2023-04-07 09:42:06.346+07	\N	\N
JredRTfaH	00001	pu65Tr6FE	k	2023-04-07 09:42:14.781+07	\N	\N
G9VuEdWyn	00001	pu65Tr6FE	l	2023-04-07 09:42:18.26+07	\N	\N
Ujfc98cda	00001	pu65Tr6FE	m	2023-04-07 09:42:21.33+07	\N	\N
dcj3Vb_Hs	00001	pu65Tr6FE	hhhbaba	2023-04-07 09:42:08.933+07	2023-04-07 10:54:25.086+07	{"{\\"time\\": \\"2023-04-07T02:42:08.933Z\\", \\"comment\\": \\"h\\"}","{\\"time\\": \\"2023-04-07T02:42:08.933Z\\", \\"comment\\": \\"hhh\\"}","{\\"time\\": \\"2023-04-07T02:42:08.933Z\\", \\"comment\\": \\"hhh b\\"}","{\\"time\\": \\"2023-04-07T02:42:08.933Z\\", \\"comment\\": \\"hhh\\"}","{\\"time\\": \\"2023-04-07T02:42:08.933Z\\", \\"comment\\": \\"hhhba\\"}"}
Y7EcAhUMf	00001	pu65Tr6FE	klka	2023-04-07 09:42:11.496+07	2023-04-07 11:19:56.03+07	{"{\\"time\\": \\"2023-04-07T02:42:11.496Z\\", \\"comment\\": \\"j\\"}","{\\"time\\": \\"2023-04-07T02:42:11.496Z\\", \\"comment\\": \\"klk\\"}","{\\"time\\": \\"2023-04-07T02:42:11.496Z\\", \\"comment\\": \\"klka\\"}","{\\"time\\": \\"2023-04-07T02:42:11.496Z\\", \\"comment\\": \\"klkb\\"}","{\\"time\\": \\"2023-04-07T02:42:11.496Z\\", \\"comment\\": \\"klka\\"}","{\\"time\\": \\"2023-04-07T02:42:11.496Z\\", \\"comment\\": \\"klkb\\"}"}
Z2ENHmsM-	00001	pu65Tr6FE	alo aboseyo	2023-04-03 10:25:23.401+07	2023-04-07 13:49:25.525+07	{"{\\"time\\": \\"2023-04-03T03:25:23.401Z\\", \\"comment\\": \\"alo\\"}"}
4kL4o6eeO	00001	pu65Tr6FE	Filling the Resignation letter form. Signature of your Project manager and yours are requested.\nPlease return all of TMA’s equipment and get signature of IT/Security Department at Item I\nAnd get signature of your Project Manager at item III and at the end of this document (Checklist of Resignation)	2023-04-07 15:45:47.118+07	\N	\N
\.


--
-- Data for Name: filmcommentthreadinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmcommentthreadinfo (commentid, replycount, usefulcount) FROM stdin;
r3agdZQcJ	0	0
F5jCAtR9_	0	1
4kL4o6eeO	0	0
c0cWhmwdG	0	1
\.


--
-- Data for Name: filmcommentthreadreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmcommentthreadreaction (commentid, author, userid, "time", reaction) FROM stdin;
F5jCAtR9_	pu65Tr6FE	pu65Tr6FE	2023-04-07 14:22:43.099+07	1
c0cWhmwdG	pu65Tr6FE	uEyz9MqaM	2023-04-07 14:45:13.396+07	1
\.


--
-- Data for Name: filmdirectors; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmdirectors (director) FROM stdin;
Steven Spielberg
Quentin Tarantino
christopher Nolan
Peter Jackson
Martin Scorsese
\.


--
-- Data for Name: filmproductions; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmproductions (production) FROM stdin;
Walt Disney Studios
Warner Bros.
Universal Pictures
Paramount Pictures
Lionsgate Films
\.


--
-- Data for Name: filmrate; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmrate (id, author, rate, "time", review, usefulcount, replycount, histories, anonymous) FROM stdin;
00002	uEyz9MqaM	8	2023-03-29 14:05:15.874	poor	0	1	\N	f
00001	uEyz9MqaM	9	2023-04-07 13:56:57.118	he	0	2	{"{\\"rate\\": 4, \\"time\\": \\"2023-03-20T03:19:11.113Z\\", \\"review\\": \\"Abc\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-03-22T04:52:23.538Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T04:37:46.812Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 7, \\"time\\": \\"2023-04-05T02:22:16.703Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-05T07:16:50.336Z\\", \\"review\\": \\"a\\"}"}	f
00001	pu65Tr6FE	4	2023-04-07 15:47:37.515	Filling the Resignation letter form. Signature of your Project manager and yours are requested. Please return all of TMA’s equipment and get signature of IT/Security Department at Item I And get signature of your Project Manager at item III and at the end of this document (Checklist of Resignation)	0	1	{"{\\"rate\\": 7, \\"time\\": \\"2023-04-07T04:21:30.048Z\\", \\"review\\": \\"hellu\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-07T04:33:32.394Z\\", \\"review\\": \\"bello\\"}","{\\"rate\\": 9, \\"time\\": \\"2023-04-07T04:37:51.359Z\\", \\"review\\": \\"oh no\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-07T06:24:55.001Z\\", \\"review\\": \\"abc\\"}","{\\"rate\\": 9, \\"time\\": \\"2023-04-07T06:25:20.593Z\\", \\"review\\": \\"abc\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-07T06:54:15.120Z\\", \\"review\\": \\"haha\\"}","{\\"rate\\": 7, \\"time\\": \\"2023-04-07T06:54:39.294Z\\", \\"review\\": \\"huhu\\"}"}	f
\.


--
-- Data for Name: filmratecomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmratecomment (commentid, id, author, userid, comment, "time", updatedat, histories, anonymous) FROM stdin;
schiZMrme	00002	uEyz9MqaM	pu65Tr6FE	g	2023-04-03 10:05:33.564	\N	\N	f
cuJA0_nJo	00001	pu65Tr6FE	pu65Tr6FE	Filling the Resignation letter form. Signature of your Project manager and yours are requested. Please return all of TMA’s equipment and get signature of IT/Security Department at Item I And get signature of your Project Manager at item III and at the end of this document (Checklist of Resignation)	2023-04-07 11:47:53.237	2023-04-07 15:47:46.036	{"{\\"time\\": \\"2023-04-07T04:47:53.237Z\\", \\"comment\\": \\"yolo\\"}"}	f
NAzIzzLna	00001	uEyz9MqaM	pu65Tr6FE	asd	2023-04-10 15:07:32.926	\N	\N	f
0SlhMKCp0	00001	uEyz9MqaM	uEyz9MqaM	hihu	2023-04-17 14:35:19.251	2023-04-17 14:38:06.85	{"{\\"time\\": \\"2023-04-17T07:35:19.251Z\\", \\"comment\\": \\"hi\\"}"}	f
\.


--
-- Data for Name: filmrateinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmrateinfo (id, rate, rate1, rate2, rate3, rate4, rate5, rate6, rate7, rate8, rate9, rate10, count, score) FROM stdin;
00002	8	0	0	0	0	0	0	0	1	0	0	1	8
00001	6.5000000000000000	0	0	0	1	0	0	0	0	1	0	2	13
\.


--
-- Data for Name: filmratereaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmratereaction (id, author, userid, "time", reaction) FROM stdin;
\.


--
-- Data for Name: filmreplycomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmreplycomment (commentid, commentthreadid, id, author, comment, "time", updatedat, histories) FROM stdin;
XFFVX-ZjP	c0cWhmwdG	00001	pu65Tr6FE	oh hell	2023-04-07 14:03:24.287+07	\N	{"{\\"time\\": \\"2023-04-07T07:03:24.287Z\\", \\"comment\\": \\"oh hello\\"}"}
\.


--
-- Data for Name: filmreplycommentinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmreplycommentinfo (commentid, replycount, usefulcount) FROM stdin;
wv5cx_a-e	0	2
XFFVX-ZjP	0	1
\.


--
-- Data for Name: filmreplycommentreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.filmreplycommentreaction (commentid, author, userid, "time", reaction) FROM stdin;
wv5cx_a-e	uEyz9MqaM	uEyz9MqaM	2023-04-07 14:02:51.738+07	1
wv5cx_a-e	uEyz9MqaM	pu65Tr6FE	2023-04-07 14:09:51.168+07	1
XFFVX-ZjP	pu65Tr6FE	uEyz9MqaM	2023-04-07 14:45:07.274+07	1
\.


--
-- Data for Name: history; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.history (id, history) FROM stdin;
mPOdF3rap	{$2a$10$RYOJbtG1crorHlvkRpjcO.Cf21BWnEQXisdGtqKt2NDj0bRovv0/C,$2a$10$44Gh5T5QctnkK/XaGrKLeenuaLgUS40vxyPWahdbBWjsINEyisFFi,$2a$10$pW/zKZCs0qkNOmTiFDj8x.KOUrZkO8DsI0.eTRbhNd.qF3PtqLMtm,$2a$10$eHNlUsZMFMpHxefurOOLmuoChl65N0AkhrjKJh7yxEU0jCElhbxwi,$2a$10$x60m11QjQHYheZn3raWLg.2EPlaJsmljnT4GVlfNN8Wj0lTEPCHBa}
\.


--
-- Data for Name: integrationconfiguration; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.integrationconfiguration (id, link, cliendid, scope, redirecturi, accesstokenlink, clientsecret, status) FROM stdin;
\.


--
-- Data for Name: item; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.item (id, title, author, status, description, price, imageurl, brand, publishedat, expiredat, category, gallery, condition) FROM stdin;
04	Movie tickets	pu65Tr6FE	A	Minion mooive ticket	100000	https://i.pinimg.com/originals/2d/ac/e7/2dace73219e9f26ffb39b3bfbb98c41b.jpg	Disney	2022-07-19 00:00:00	2023-04-12 00:00:00	{comedy,action}	{"{\\"url\\": \\"https://i.pinimg.com/originals/2d/ac/e7/2dace73219e9f26ffb39b3bfbb98c41b.jpg\\", \\"type\\": \\"image\\", \\"source\\": \\"\\"}"}	\N
01	Movie tickets	pu65Tr6FE	A	Thor movie ticket	100000	https://i.etsystatic.com/31051854/r/il/951542/3882447990/il_570xN.3882447990_8so4.jpg	Disney	2022-07-19 00:00:00	2023-04-25 00:00:00	{comedy,action}	{"{\\"url\\": \\"https://i.etsystatic.com/31051854/r/il/951542/3882447990/il_570xN.3882447990_8so4.jpg\\", \\"type\\": \\"image\\", \\"source\\": \\"\\"}"}	\N
02	Iphone 13	pu65Tr6FE	A	Iphone 13 from Apple	20000000	https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png	Apple	2022-07-19 00:00:00	2023-04-17 00:00:00	{mobiphone,technological,apple}	{"{\\"url\\": \\"https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png\\", \\"type\\": \\"image\\", \\"source\\": \\"\\"}"}	\N
05	Macbook	pu65Tr6FE	A	Macbook from Apple	25000000	https://www.maccenter.vn/App_images/MacBookPro-14-SpaceGray.jpg	Apple	2022-07-19 00:00:00	2023-04-20 00:00:00	{laptop,technological,apple}	{"{\\"url\\": \\"https://www.maccenter.vn/App_images/MacBookPro-14-SpaceGray.jpg\\", \\"type\\": \\"image\\", \\"source\\": \\"\\"}"}	\N
03	Camera	pu65Tr6FE	A	Camera from Samsung	100000000	https://acmartbd.com/wp-content/uploads/2015/03/Samsung-wb1100f.jpg	Samsung	2022-07-19 00:00:00	2023-04-12 00:00:00	{camera,technological}	{"{\\"url\\": \\"https://acmartbd.com/wp-content/uploads/2015/03/Samsung-wb1100f.jpg\\", \\"type\\": \\"image\\", \\"source\\": \\"\\"}"}	\N
\.


--
-- Data for Name: itemcategory; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.itemcategory (categoryid, categoryname, status, createdby, createdat, updatedby, updatedat) FROM stdin;
\.


--
-- Data for Name: itemcomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.itemcomment (id, author, userid, comment, "time", updatedat, histories) FROM stdin;
01	02	77c35c38c3554ea6906730dbcfeca0f2	Good	2022-07-22 00:00:00	\N	\N
02	06	77c35c38c3554ea6906730dbcfeca0f2	Not Bad	2022-07-22 00:00:00	\N	\N
03	05	77c35c38c3554ea6906730dbcfeca0f2	abc	2022-07-22 00:00:00	\N	\N
04	07	77c35c38c3554ea6906730dbcfeca0f2	Bad	2022-07-22 00:00:00	\N	\N
05	11	77c35c38c3554ea6906730dbcfeca0f2	123	2022-07-22 00:00:00	\N	\N
\.


--
-- Data for Name: iteminfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.iteminfo (id, viewcount) FROM stdin;
\.


--
-- Data for Name: itemresponse; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.itemresponse (id, author, description, "time", usefulcount, replycount, histories, price) FROM stdin;
01	77c35c38c3554ea6906730dbcfeca0f2	Good	2022-07-22 00:00:00	0	0	\N	0
02	77c35c38c3554ea6906730dbcfeca0f2	Not Bad	2022-07-22 00:00:00	0	0	\N	0
03	77c35c38c3554ea6906730dbcfeca0f2	Wow	2022-07-22 00:00:00	0	0	\N	0
04	77c35c38c3554ea6906730dbcfeca0f2	Bad	2022-07-22 00:00:00	0	0	\N	0
05	77c35c38c3554ea6906730dbcfeca0f2	I hate this	2022-07-22 00:00:00	0	0	\N	0
01	pu65Tr6FE	as	2023-04-10 17:03:47.866	0	0	\N	0
03	pu65Tr6FE	abc	2023-04-11 17:33:09.319	0	0	\N	0
\.


--
-- Data for Name: itemresponsereaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.itemresponsereaction (id, author, userid, "time", reaction) FROM stdin;
\.


--
-- Data for Name: job; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.job (id, title, description, skill, publishedat, expiredat, quantity, applicantcount, requirements, benefit, company_id) FROM stdin;
aaa	aaa	\N	\N	\N	\N	1	1	\N	\N	odltd
\.


--
-- Data for Name: location; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.location (id, name, type, description, status, geo, latitude, longitude, imageurl, customurl, createdby, createdat, updatedby, version, info) FROM stdin;
5d1d7a66c5e4f320a86ca6b2	Highland Coffee	coffee	Highland Coffee	A	\N	10.7826048776525080	106.7009147396518000	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/image/5d1d7a66c5e4f320a86ca6b2_IFc9Db9DT_c.jpg	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg	\N	\N	\N	\N	\N
5d1d7a85c5e4f320a86ca6b3	Starbucks Coffee	coffee	Starbucks Coffee	A	\N	10.7826048776525080	106.7009147396518000	https://ichef.bbci.co.uk/news/976/cpsprodpb/17185/production/_118879549_gettyimages-1308703596.jpg	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg	\N	\N	\N	\N	\N
5d1d7b79c5e4f320a86ca6b4	King Coffee	coffee	King Coffee	A	\N	10.7826048776525080	106.7009147396518000	https://www.asia-bars.com/wp-content/uploads/2015/11/cong-caphe-1.jpg	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg	\N	\N	\N	\N	\N
5d1efb3796988a127077547c	Sumo BBQ Restaurant	restaurant	farthest	A	\N	10.7826048776525080	106.7009147396518000	https://aeonmall-binhduongcanary.com.vn/wp-content/uploads/2018/12/IMG-2041-min-e1558279440850.jpg	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg	\N	\N	\N	\N	\N
5d562ad357568217d0d9a2d5	CGV	cinema	CGV cinema	A	\N	10.7826048776525080	10.8548611610901300	https://rapchieuphim.com/photos/9/rap-cgv-su-van-hanh/rap-CGV-Su-van-hanh-8__2_.jpg	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg	\N	\N	\N	\N	\N
5d146cbffbdf2b1d30742262	Highland Coffee	coffee	Highland Coffee	A	\N	10.7826048776525080	106.7009147396518000	https://i.ndh.vn/2022/07/29/1600834272dautuvietnamsuchunglaicuahighlandscoffeelabandapchotheluckhac-1659080446.jpg	https://i.ndh.vn/2022/07/29/1600834272dautuvietnamsuchunglaicuahighlandscoffeelabandapchotheluckhac-1659080446.jpg	\N	\N	\N	\N	\N
5d1d7a18c5e4f320a86ca6b1	Trung Nguyen Coffee	coffee	Trung Nguyen Coffee	A	\N	10.7826048776525080	106.7009147396518000	https://cdn2.shopify.com/s/files/1/0065/6759/1999/files/dia-chi-trung-nguyen-legend-cafe-tai-vincom-ha-nam_grande.jpg	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg	\N	\N	\N	\N	\N
\.


--
-- Data for Name: locationcomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationcomment (commentid, id, author, userid, comment, "time", updatedat, histories, anonymous) FROM stdin;
CPh9yOO8H	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	hi	2023-03-23 15:44:25.356	\N	\N	t
cQ6hNws3v	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	yolo	2023-03-23 15:45:32.621	\N	\N	f
MAk1BOOPB	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	hi	2023-03-23 16:51:46.922	\N	\N	f
EzRxHlOBC	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	oh yeah	2023-03-23 16:57:01.95	\N	\N	f
EDepjfUZz	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	yolo	2023-03-23 16:58:28.567	\N	\N	t
29feI2KC9	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	yup	2023-03-27 10:46:09.769	\N	\N	f
XhtnFuz_0	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	yolo	2023-03-27 10:47:04.826	\N	\N	f
9ukzkr43b	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	hi	2023-03-27 10:47:29.937	\N	\N	f
nmlfmxPl0	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	hi	2023-03-27 10:47:29.937	\N	\N	f
VwP1pBM40	5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	yo	2023-03-27 10:52:48.336	\N	\N	f
e-nmtaraD	5d146cbffbdf2b1d30742262	pu65Tr6FE	pu65Tr6FE	hi	2023-03-30 13:40:15.87	\N	\N	f
JxoG2Ct8n	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	uEyz9MqaM	a	2023-04-04 13:18:16.839	\N	\N	f
n_C2clD6g	5d146cbffbdf2b1d30742262	pu65Tr6FE	uEyz9MqaM	yeah	2023-04-04 13:20:19.586	\N	\N	f
piwKVqajD	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	uEyz9MqaM	b	2023-04-04 14:03:22.18	\N	\N	f
d1mLikn2k	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	uEyz9MqaM	a	2023-04-04 16:13:02.472	\N	\N	f
Q6bBIl8Zc	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	uEyz9MqaM	b	2023-04-04 16:13:06.534	\N	\N	f
hI_v0wrjo	5d146cbffbdf2b1d30742262	pu65Tr6FE	pu65Tr6FE	Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged	2023-04-06 10:28:46.38	\N	\N	f
g1Of56Z9C	5d146cbffbdf2b1d30742262	pu65Tr6FE	pu65Tr6FE	hi	2023-04-06 10:45:18.101	\N	\N	t
3BCGcCgC8	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	pu65Tr6FE	b	2023-04-06 13:40:42.394	\N	\N	f
Hiq0RQPEt	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	pu65Tr6FE	abc	2023-04-14 10:34:41.991	\N	\N	f
4vvjkCiTv	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	uEyz9MqaM	helu	2023-04-14 10:35:16.755	\N	\N	f
QyY3vL_AT	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	pu65Tr6FE	bloavla	2023-04-14 11:01:07.313	\N	\N	f
B2AnGZ2Co	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	uEyz9MqaM	yoo	2023-04-14 11:02:19.625	\N	\N	f
ELH_IQyqf	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	pu65Tr6FE	eeeee	2023-04-06 11:00:48.4	2023-04-17 11:08:58.801	{"{\\"time\\": \\"2023-04-06T04:00:48.400Z\\", \\"comment\\": \\"e\\"}"}	f
B3ctw27P5	5d146cbffbdf2b1d30742262	pu65Tr6FE	uEyz9MqaM	huhu	2023-04-18 17:16:26.522	\N	\N	t
\.


--
-- Data for Name: locationcommentthread; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationcommentthread (commentid, id, author, comment, "time", updatedat, histories) FROM stdin;
4QkTPXfLt	5d146cbffbdf2b1d30742262	pu65Tr6FE	hi	2023-04-03 14:57:04.638+07	\N	{}
SMmXVksrQ	5d146cbffbdf2b1d30742262	pu65Tr6FE	a	2023-04-04 09:28:36.938+07	\N	{}
xGsBHvAhI	5d146cbffbdf2b1d30742262	pu65Tr6FE	b	2023-04-04 09:28:40.291+07	\N	{}
ks-txtHW5	5d146cbffbdf2b1d30742262	pu65Tr6FE	c	2023-04-04 09:28:41.934+07	\N	{}
gQsRtAsY8	5d146cbffbdf2b1d30742262	pu65Tr6FE	d	2023-04-04 09:28:43.621+07	\N	{}
u7rf0YUD4	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	b	2023-04-06 13:46:03.804+07	\N	{}
M369VOqsD	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	test	2023-04-06 13:47:50.358+07	\N	\N
jQ-d1LjB2	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	a	2023-04-06 15:15:46.102+07	\N	\N
fQ8ZGjZV0	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	a	2023-04-06 15:16:00.971+07	\N	\N
FBFtrF7a3	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	b	2023-04-06 15:16:03.984+07	\N	\N
2wA097XQl	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	aa	2023-04-06 15:16:06.02+07	\N	\N
8R2era603	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	dd	2023-04-06 15:16:10.003+07	\N	\N
lCM2iMFwk	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	qw	2023-04-06 15:16:12.484+07	\N	\N
wzBnAmMZ5	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	qwe	2023-04-10 11:15:20.215+07	\N	\N
NM8JHf5w6	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	rty	2023-04-10 11:15:22.159+07	\N	\N
UoPwSaRJU	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	uio	2023-04-10 11:15:23.957+07	\N	\N
VtZUjfyPh	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	m,.	2023-04-10 11:15:26.991+07	\N	\N
xVJy8Uj9g	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	zxc	2023-04-10 11:15:28.807+07	\N	\N
YOBTuks1e	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	asd	2023-04-10 11:15:30.44+07	\N	\N
JihXTDUrN	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	kyu	2023-04-10 11:15:32.723+07	\N	\N
u0mYlY4LG	5d562ad357568217d0d9a2d5	pu65Tr6FE	hi	2023-04-11 16:25:07.016+07	\N	\N
ig_UEXS5b	5d562ad357568217d0d9a2d5	pu65Tr6FE	no	2023-04-11 16:29:45.674+07	\N	\N
ywurd_OaC	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	yehoo	2023-04-04 13:24:41.486+07	2023-04-13 11:49:59.501+07	{"{\\"time\\": \\"2023-04-04T06:24:41.486Z\\", \\"comment\\": \\"abc\\"}","{\\"time\\": \\"2023-04-04T06:24:41.486Z\\", \\"comment\\": \\"abcxyz\\"}","{\\"time\\": \\"2023-04-04T06:24:41.486Z\\", \\"comment\\": \\"yoo\\"}"}
HHjGtC1_G	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	hulu	2023-04-18 13:08:06.191+07	\N	\N
I3og5ZaHC	5d146cbffbdf2b1d30742262	uEyz9MqaM	hule	2023-04-18 14:41:17.17+07	\N	\N
WvbZM_GYu	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	abc	2023-04-06 13:45:37.87+07	2023-04-19 10:26:16.644+07	{"{\\"time\\": \\"2023-04-06T06:45:37.870Z\\", \\"comment\\": \\"a\\"}"}
\.


--
-- Data for Name: locationcommentthreadinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationcommentthreadinfo (commentid, replycount, usefulcount) FROM stdin;
5d1d7a66c5e4f320a86ca6b2	0	1
4QkTPXfLt	4	1
WvbZM_GYu	2	0
ywurd_OaC	3	2
HHjGtC1_G	0	1
u7rf0YUD4	1	0
wzBnAmMZ5	1	0
8R2era603	3	1
2wA097XQl	3	1
lCM2iMFwk	3	1
M369VOqsD	0	0
\.


--
-- Data for Name: locationcommentthreadreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationcommentthreadreaction (commentid, author, userid, "time", reaction) FROM stdin;
4QkTPXfLt	pu65Tr6FE	pu65Tr6FE	2023-04-03 14:57:05.913+07	1
5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	uEyz9MqaM	2023-04-04 14:35:43.616+07	1
8R2era603	pu65Tr6FE	uEyz9MqaM	2023-04-10 15:18:43.034+07	1
2wA097XQl	pu65Tr6FE	uEyz9MqaM	2023-04-10 15:18:46.097+07	1
ywurd_OaC	pu65Tr6FE	pu65Tr6FE	2023-04-14 10:30:07.499+07	1
lCM2iMFwk	pu65Tr6FE	uEyz9MqaM	2023-04-14 11:05:36.41+07	1
ywurd_OaC	pu65Tr6FE	uEyz9MqaM	2023-04-19 15:57:30.763+07	1
HHjGtC1_G	uEyz9MqaM	uEyz9MqaM	2023-04-19 15:57:42.348+07	1
\.


--
-- Data for Name: locationfollower; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationfollower (id, follower) FROM stdin;
5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE
\.


--
-- Data for Name: locationfollowing; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationfollowing (id, following) FROM stdin;
pu65Tr6FE	5d1d7a66c5e4f320a86ca6b2
\.


--
-- Data for Name: locationinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, count, score) FROM stdin;
5d1d7b79c5e4f320a86ca6b4	0	0	0	0	0	0	0	0
5d1d7a18c5e4f320a86ca6b1	3.0000000000000000	0	0	1	0	0	1	3
5d1d7a85c5e4f320a86ca6b3	4.0000000000000000	0	0	0	1	0	1	4
5d1efb3796988a127077547c	3.0000000000000000	0	0	1	0	0	1	3
5d146cbffbdf2b1d30742262	3.0000000000000000	0	1	0	1	0	2	6
5d562ad357568217d0d9a2d5	5.0000000000000000	0	0	0	0	1	1	5
5d1d7a66c5e4f320a86ca6b2	5.0000000000000000	0	0	0	0	2	2	10
\.


--
-- Data for Name: locationinfomation; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationinfomation (id, followercount, followingcount) FROM stdin;
pu65Tr6FE	0	1
5d1d7a66c5e4f320a86ca6b2	1	0
uEyz9MqaM	0	0
5d146cbffbdf2b1d30742262	0	0
\.


--
-- Data for Name: locationrate; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationrate (id, author, rate, "time", review, usefulcount, replycount, anonymous, histories) FROM stdin;
5d1efb3796988a127077547c	uEyz9MqaM	3	2023-03-30 10:50:30.575	3	0	0	t	{"{\\"rate\\": 1, \\"time\\": \\"2021-09-30T17:00:00.000Z\\", \\"review\\": \\"Poor\\"}"}
5d562ad357568217d0d9a2d5	uEyz9MqaM	5	2023-03-30 11:46:50.824	yeah	0	0	f	{"{\\"rate\\": 4, \\"time\\": \\"2021-09-30T17:00:00.000Z\\", \\"review\\": \\"Good\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-03-30T04:46:35.188Z\\", \\"review\\": \\"yeah\\"}"}
5d1d7b79c5e4f320a86ca6b4	uEyz9MqaM	5	2021-10-01 00:00:00	Excellent	0	0	f	\N
5d1d7a18c5e4f320a86ca6b1	uEyz9MqaM	3	2023-03-22 16:04:19.423	poor	0	0	t	{"{\\"rate\\": 3, \\"time\\": \\"2021-09-30T17:00:00.000Z\\", \\"review\\": \\"Poor\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-03-22T09:00:16.640Z\\", \\"review\\": \\"good service\\"}"}
5d1d7a85c5e4f320a86ca6b3	uEyz9MqaM	4	2023-03-23 16:59:16.65	good	0	0	f	\N
5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	5	2023-04-17 10:59:44.957	avc	0	5	f	{"{\\"rate\\": 4, \\"time\\": \\"2023-04-04T10:30:21.097Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-04T10:30:34.002Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-17T03:40:35.674Z\\", \\"review\\": \\"a\\"}"}
5d146cbffbdf2b1d30742262	pu65Tr6FE	4	2023-04-13 16:53:46.494	123	1	5	f	{"{\\"rate\\": 4, \\"time\\": \\"2023-03-30T06:40:02.577Z\\", \\"review\\": \\"oh yes\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T09:53:43.225Z\\", \\"review\\": \\"a\\"}"}
5d146cbffbdf2b1d30742262	uEyz9MqaM	2	2023-03-22 17:08:24.089	oh no	1	10	f	{"{\\"rate\\": 3, \\"time\\": \\"2023-03-22T04:54:15.009Z\\", \\"review\\": \\"yeah\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-03-22T07:01:27.579Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-03-22T07:01:37.107Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-03-22T07:02:28.984Z\\", \\"review\\": \\"d\\\\n\\"}","{\\"rate\\": 1, \\"time\\": \\"2023-03-22T07:03:19.934Z\\", \\"review\\": \\"e\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-03-22T07:03:27.269Z\\", \\"review\\": \\"d\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-03-22T07:03:36.195Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-03-22T07:04:38.910Z\\", \\"review\\": \\"good\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-03-22T07:04:48.285Z\\", \\"review\\": \\"huhu\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-03-22T07:12:00.461Z\\", \\"review\\": \\"oh yeah\\"}"}
5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	5	2023-04-13 16:06:08.887	a	1	5	f	{"{\\"rate\\": 2, \\"time\\": \\"2023-04-04T04:20:42.232Z\\", \\"review\\": \\"rdtjdx\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-04T04:20:55.012Z\\", \\"review\\": \\"jxj\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-04T04:21:20.371Z\\", \\"review\\": \\"\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-04T04:24:14.567Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T04:25:02.478Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-04T04:35:02.366Z\\", \\"review\\": \\"3\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T04:39:29.910Z\\", \\"review\\": \\"5\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-04T04:40:09.837Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T06:07:56.926Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-04T10:30:55.661Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T10:31:23.893Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-04T10:33:49.294Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 1, \\"time\\": \\"2023-04-04T10:33:59.054Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-04T10:34:05.559Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-04T10:34:14.806Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T10:34:19.095Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 1, \\"time\\": \\"2023-04-04T10:34:23.773Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-04T10:37:32.091Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-04T10:37:56.707Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-04T10:38:46.557Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-05T02:04:14.902Z\\", \\"review\\": \\"12\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-05T02:05:41.085Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-05T02:06:42.762Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-05T02:08:58.079Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-05T02:10:02.435Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-05T02:15:40.423Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-05T02:27:03.348Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 2, \\"time\\": \\"2023-04-05T02:27:36.434Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-05T02:28:20.469Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-05T02:30:07.777Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 1, \\"time\\": \\"2023-04-05T03:44:59.668Z\\", \\"review\\": \\"1\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-05T03:48:50.537Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 1, \\"time\\": \\"2023-04-05T08:18:47.815Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-05T08:49:28.241Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T06:29:00.499Z\\", \\"review\\": \\"hi\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T06:29:12.317Z\\", \\"review\\": \\"a\\"}","{\\"rate\\": 3, \\"time\\": \\"2023-04-13T06:30:57.776Z\\", \\"review\\": \\"b\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T06:41:25.032Z\\", \\"review\\": \\"hi\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T07:23:19.339Z\\", \\"review\\": \\"asd\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T07:23:34.795Z\\", \\"review\\": \\"asd\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T07:23:45.235Z\\", \\"review\\": \\"iouqioweuioqwe\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T07:24:28.806Z\\", \\"review\\": \\"12345\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T07:24:47.270Z\\", \\"review\\": \\"asd\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T07:24:55.683Z\\", \\"review\\": \\"123123\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T07:25:05.102Z\\", \\"review\\": \\"asd\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T07:25:08.485Z\\", \\"review\\": \\"123\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T07:25:10.836Z\\", \\"review\\": \\"asd\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T09:01:44.368Z\\", \\"review\\": \\"abc\\"}","{\\"rate\\": 4, \\"time\\": \\"2023-04-13T09:01:54.411Z\\", \\"review\\": \\"123\\"}","{\\"rate\\": 5, \\"time\\": \\"2023-04-13T09:06:05.422Z\\", \\"review\\": \\"a\\"}"}
\.


--
-- Data for Name: locationratereaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationratereaction (id, author, userid, "time", reaction) FROM stdin;
5d146cbffbdf2b1d30742262	uEyz9MqaM	uEyz9MqaM	2023-04-03 17:06:54.931	1
5d146cbffbdf2b1d30742262	pu65Tr6FE	uEyz9MqaM	2023-04-04 09:06:30.261	1
5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	pu65Tr6FE	2023-04-17 11:06:15.664	1
\.


--
-- Data for Name: locationreplycomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationreplycomment (commentid, commentthreadid, id, author, comment, "time", updatedat, histories) FROM stdin;
3speDSv5z	OYBh0OCY3	5d146cbffbdf2b1d30742262	pu65Tr6FE	say oh yeah	2023-04-03 14:48:47.09+07	\N	{}
1-zYOlk9l	ywurd_OaC	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	hi	2023-04-04 13:45:39.418+07	\N	{}
2dt1uofzQ	ywurd_OaC	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	hi	2023-04-05 10:10:43.794+07	\N	{}
Md5KdWC4U	4QkTPXfLt	5d146cbffbdf2b1d30742262	uEyz9MqaM	hi	2023-04-05 13:26:33.703+07	\N	{}
TYJOHlrmG	ywurd_OaC	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	huhuha	2023-04-04 13:24:49.131+07	\N	{"{\\"time\\": \\"2023-04-04T06:24:49.131Z\\", \\"comment\\": \\"hi\\"}","{\\"time\\": \\"2023-04-04T06:24:49.131Z\\", \\"comment\\": \\"huhu\\"}"}
lHyMLJdCd	8R2era603	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	asd	2023-04-10 15:18:54.175+07	\N	\N
HkFjDqFqA	lCM2iMFwk	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	alo	2023-04-13 14:58:30.403+07	\N	\N
N8mXZwfOK	4QkTPXfLt	5d146cbffbdf2b1d30742262	pu65Tr6FE	hu	2023-04-13 17:33:23.292+07	\N	\N
Ldz_JTZ7r	4QkTPXfLt	5d146cbffbdf2b1d30742262	pu65Tr6FE	hihi	2023-04-13 17:36:43.61+07	\N	\N
AAfigbGjv	2wA097XQl	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	abc	2023-04-14 08:25:16.495+07	\N	\N
SX-Xf3LAm	2wA097XQl	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	yoo	2023-04-14 09:36:39.823+07	\N	\N
wZ3ORsY89	2wA097XQl	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	hellu	2023-04-14 09:43:56.953+07	\N	\N
-zmT5A56L	8R2era603	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	yeee	2023-04-14 10:00:02.591+07	\N	\N
jl8CDl6b3	lCM2iMFwk	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	hnuu	2023-04-14 11:05:45.184+07	\N	\N
da_aKQ1ay	lCM2iMFwk	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	yeee	2023-04-14 11:19:05.272+07	\N	\N
wDQJjOwL9	4QkTPXfLt	5d146cbffbdf2b1d30742262	uEyz9MqaM	ola	2023-04-17 16:02:49.003+07	\N	\N
Us-7Itqr2	WvbZM_GYu	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	quangta test	2023-04-17 17:44:47.368+07	\N	\N
OicUalfhk	WvbZM_GYu	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	yooye	2023-04-19 10:25:24.249+07	\N	{"{\\"time\\": \\"2023-04-19T03:25:24.249Z\\", \\"comment\\": \\"yoo\\"}"}
mlYHPKGMF	u7rf0YUD4	5d1d7a66c5e4f320a86ca6b2	pu65Tr6FE	hihu	2023-04-19 10:44:20.643+07	\N	\N
Q_Z7Z17Iz	wzBnAmMZ5	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	alo	2023-04-20 11:25:48.598+07	\N	\N
JalL_XYfm	8R2era603	5d1d7a66c5e4f320a86ca6b2	uEyz9MqaM	yolola	2023-04-20 11:55:59.23+07	\N	{"{\\"time\\": \\"2023-04-20T04:55:59.230Z\\", \\"comment\\": \\"yolo\\"}"}
\.


--
-- Data for Name: locationreplycommentinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationreplycommentinfo (commentid, replycount, usefulcount) FROM stdin;
Md5KdWC4U	0	0
lHyMLJdCd	0	0
HkFjDqFqA	0	0
jl8CDl6b3	0	0
da_aKQ1ay	0	1
wDQJjOwL9	0	0
Ldz_JTZ7r	0	0
\.


--
-- Data for Name: locationreplycommentreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.locationreplycommentreaction (commentid, author, userid, "time", reaction) FROM stdin;
da_aKQ1ay	pu65Tr6FE	pu65Tr6FE	2023-04-14 11:19:09.024+07	1
\.


--
-- Data for Name: music; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.music (id, name, author, releasedate, duration, lyric, imageurl, mp3url) FROM stdin;
1	Gió	{Jank}	\N	\N		https://photo-resize-zmp3.zmdcdn.me/w240_r1x1_webp/cover/5/3/6/d/536dc591405fc70b6f4932eeb18337e8.jpg	https://mp3-s1-zmp3.zmdcdn.me/f93972208a60633e3a71/418807123490058032?authen=exp=1681271241~acl=/f93972208a60633e3a71/*~hmac=ecf8aab8f221a3d6df3a073bf7c4634a&fs=MTY4MTA5ODQ0MTk4N3x3ZWJWNnwwfDExNy42LjQyLjE1NA
\.


--
-- Data for Name: passwordcodes; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.passwordcodes (id, code, expiredat) FROM stdin;
\.


--
-- Data for Name: passwords; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.passwords (id, password, successtime, failtime, failcount, lockeduntiltime, history) FROM stdin;
W4-SSYOad	$2b$10$RpVp81sI5zI/nDjKf5VmyeSg./i0fCNZZRZjXSXM/PrIhggKiSl6m	\N	\N	\N	\N	\N
EAt0afrot	$2b$10$HFPVKWD7YUC7MWbICbESQep8X/q1GPi858lHc0oXZmDkEmDVl0Bbe	2022-10-13 11:51:57.443+07	\N	0	\N	\N
hv5IMcgcQ	$2b$10$misYaotOkglNej8V9vk4GuCbBokIdG6eQT8ag1X0GbeiSNX.BNO.a	2022-10-13 13:57:51.42+07	\N	0	\N	\N
w7GE8z1oF	$2b$10$u7wDMhETf5PDyLPL4VsJAeb4EKCsd30Pa0dXLu3Bf6pCdG7C48M16	\N	\N	\N	\N	\N
gxLTXmdvq	$2b$10$A0fFOOzSzZzA5vJ8hwUPfOEBK0uU0VvhAmK8ss4mcO6/TeVmxohpS	\N	\N	\N	\N	\N
fmA8L1ic6	$2b$10$koIL.Iysk.uW7Krig2ayvOUFoR0Fn1eNhJz6/FpqvZ4mCFVEqjfFG	2022-10-20 14:28:40.132+07	\N	0	\N	\N
errAItrtM	$2a$10$gbzoZNf5UGIBXu4P8DKaoekqw3ajduyccM14qQGJYW2hN2W7O.4Ya	\N	\N	\N	\N	\N
h3-bIa9tp	$2a$10$Gy06IjZ463EEGKclZ8t41.wmtLPpsm5BikJxq8D0GFzHtDhOqORtS	2022-11-11 18:28:59.242767+07	\N	0	\N	\N
mPOdF3rap	$2a$10$RYOJbtG1crorHlvkRpjcO.Cf21BWnEQXisdGtqKt2NDj0bRovv0/C	\N	\N	0	\N	{$2a$10$tTDVSw3T3PRwy.heR6nKQ.KDHE1Del.U9IZqW25yOB4hcPpVp9x.6,$2a$10$y3AU6LXkjXD1ciFDHk/zqueejCi6Uhqnx7kzQBYrvwLZvXtoHOvB.,""}
1c7TAkSsA	$2b$10$OLrEW8KE4OS8xbccTS72uuqNh7GMhcrHyuZJx7q6tm0rAJk54I3oi	2022-11-10 10:08:12.467+07	\N	0	\N	\N
uEyz9MqaM	$2a$10$NS/TlMoJsvb/fHJsThDCHOSQq0XC5uDMgrf769paxRGh8DL1/5Gb2	2023-04-20 09:50:55.211+07	\N	0	\N	\N
pu65Tr6FE	$2b$10$cuUU9pZcxnrvYbZLw8echezSHZ.l44or37RuG9O9K53prUf3cvjLO	2023-04-20 13:02:09.992+07	\N	0	\N	\N
\.


--
-- Data for Name: playlist; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.playlist (id, title, userid, imageurl) FROM stdin;
7f6kqpqi7	Listen	pu65Tr6FE	\N
\.


--
-- Data for Name: reservation; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.reservation (id, startdate, enddate, guestid, totalprice, roomid) FROM stdin;
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.room (id, title, description, price, offer, location, host, guest, bedrooms, bed, bathrooms, highlight, status, region, category, typeof, property, language, imageurl) FROM stdin;
01	KHU NGHỈ DƯỠNG PIUGUS	Piugus resort tọa lạc tại một hòn đảo nhỏ tư nhân tại Anambas. Toàn bộ biệt thự được xây dựng từ gỗ tự nhiên.	500	{"Máy giặt","Sân hoặc ban công","Điều hòa nhiệt độ","Bữa sáng","Cho phép ở dài hạn","Cho phép hút thuốc"}	Anambas, Kepulauan Riau, Indonesia	Herry	5	1	2	1	{"Self check-in","Great location","Dive right in"}	A	Viet Nam	{Beach,"Tiny Home",Islands}	{"Toàn bộ nhà","Phòng riêng","Phòng chung"}	Nhà	{"Tiếng Anh","Tiếng Việt"}	{"{\\"url\\": \\"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/JSg3tgoY0_3VZT2SW8b\\", \\"type\\": \\"image\\"}","{\\"url\\": \\"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/JSg3tgoY0_oSipzWeYi\\", \\"type\\": \\"image\\"}","{\\"url\\": \\"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/JSg3tgoY0_EF7bCPZry\\", \\"type\\": \\"image\\"}"}
\.


--
-- Data for Name: saveditem; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.saveditem (id, items, createdby, createdat, updatedby, updatedat) FROM stdin;
pu65Tr6FE	{01,02,03,05}	pu65Tr6FE	2022-07-19 00:00:00	pu65Tr6FE	2022-07-20 00:00:00
\.


--
-- Data for Name: savedlocation; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.savedlocation (id, items) FROM stdin;
\.


--
-- Data for Name: signupcodes; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.signupcodes (id, code, expiredat) FROM stdin;
uEyz9MqaM	$2a$10$Tj.gVmypc66rvAeFHybtr.VJOANZIBeQBh5NvuzEiCuGHrlHkSqEG	2023-03-20 11:11:10.310384+07
W4-SSYOad	$2b$10$GLndZAVCJzEE.2CJiLCxFu3YrvFQieQm46ZGp6XXTcWcbiM1crSZ.	2022-10-12 18:07:36.779+07
fmA8L1ic6	$2b$10$IInKP2z703eg1LrQMYpCZOKblTtOtp4gIOZKLnPQFVkmYLkEF7uaC	2022-10-13 09:32:34.381+07
EAt0afrot	$2b$10$yiPAyPZjcgN7si4w0W0SgeCah7uFYd2bq3cIARLfnNz6KKzcsMny.	2022-10-13 11:29:22.179+07
hv5IMcgcQ	$2b$10$NbB36eZmmoLJQv3rncgcEO6AL58TDtOszYfpTm94Xuynj72Ju7XCa	2022-10-13 13:34:40.651+07
w7GE8z1oF	$2b$10$fUm312/OmEA.MjoS5Dk11.kNwHcxS/tnCpjNGgflg3sTA8DoO/rgS	2022-10-14 10:28:40.987+07
gxLTXmdvq	$2b$10$W3KnDnzEKslAEsmQ3yBRtOSmb0WLy/ulpwYozu7VybePiqBRb9mdu	2022-10-17 10:02:04.383+07
mJjun1i5y	$2b$10$jyc20RCzqLyjVMsD2IvoAOBEqwZDomU8xBDLdu6.85HeHEdXjEE8e	2022-10-20 14:41:05.714+07
h3-bIa9tp	$2a$10$mVm.a/owEHCsrFoo/lz.fu8N/HlUB.SvV8DMFmpAvbwKPeFu64m5W	2022-10-24 11:23:10.731694+07
errAItrtM	$2a$10$M7XWanpmMvsiVtQWCZEVjetA4bnkwouWaFbCFduVK.IQY5T3B0MBy	2022-10-24 11:27:00.943492+07
mPOdF3rap	$2a$10$CGx5zLhznCJiCb5DomIZAe9vvFU0xy64JPtTUYbQ1F5bYqbtYgP9S	2022-10-27 11:05:45.07198+07
pu65Tr6FE	$2b$10$HhkKVEx9YMC1ZkHBUfjsQeW67HMPh1Cx8SqAQ6fTSTDqfTPwZqdmi	2023-03-30 13:45:18.322+07
\.


--
-- Data for Name: usercompanies; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.usercompanies (company) FROM stdin;
tma
VN
kbtg
\.


--
-- Data for Name: usereducations; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.usereducations (school) FROM stdin;
uit
\.


--
-- Data for Name: userfollower; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userfollower (id, follower) FROM stdin;
\.


--
-- Data for Name: userfollowing; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userfollowing (id, following) FROM stdin;
\.


--
-- Data for Name: userinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userinfo (id, followercount, followingcount, rate1) FROM stdin;
pu65Tr6FE	1	1	0
\.


--
-- Data for Name: userinfomation; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userinfomation (id, appreciate, respect, admire, reactioncount) FROM stdin;
\.


--
-- Data for Name: userinterests; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userinterests (interest) FROM stdin;
game
movie
coding
football
basketball
books
money
manga
badminton
esport
food
swim
\.


--
-- Data for Name: userrate; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userrate (id, author, rate, "time", review, usefulcount, replycount, histories) FROM stdin;
\.


--
-- Data for Name: userratecomment; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userratecomment (commentid, id, author, userid, comment, "time", updatedat, histories) FROM stdin;
\.


--
-- Data for Name: userrateinfo; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userrateinfo (id, rate, rate1, rate2, rate3, rate4, rate5, rate6, rate7, rate8, rate9, rate10, count, score) FROM stdin;
\.


--
-- Data for Name: userratereaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userratereaction (id, author, userid, "time", reaction) FROM stdin;
\.


--
-- Data for Name: userreaction; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userreaction (id, author, userid, reaction, "time") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.users (id, username, email, phone, gender, displayname, givenname, familyname, middlename, alternativeemail, alternativephone, imageurl, coverurl, title, nationality, address, bio, website, occupation, company, location, maxpasswordage, dateofbirth, settings, links, gallery, skills, achievements, works, companies, educations, interests, lookingfor, status, createdby, createdat, updatedby, updatedat, social, version) FROM stdin;
AWvaYDttM	vinhtq2020	vinhtq2020@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	https://www.worldhistory.org/img/r/p/500x600/13337.jpeg?v=1654040539	https://gratisography.com/wp-content/uploads/2022/05/gratisography-heavenly-free-stock-photo-1170x775.jpg	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	AWvaYDttM	\N	AWvaYDttM	\N	\N	\N
uEyz9MqaM	quangta	quang.tx305@gmail.com	\N	\N	\N	\N	\N	\N	\N	\N	https://i1-vnexpress.vnecdn.net/2022/06/13/VNE-Khan-1457-1655098232.jpg?w=0&h=0&q=100&dpr=2&fit=crop&s=sjrVp41LWtp3zF9g39TqZA	https://gratisography.com/wp-content/uploads/2022/05/gratisography-heavenly-free-stock-photo-1170x775.jpg	\N	\N	\N	\N	\N	\N	\N	\N	90	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	A	uEyz9MqaM	2023-03-20 10:11:10.228538+07	uEyz9MqaM	2023-03-20 10:12:10.228538+07	\N	2
pu65Tr6FE	taquang	quang.tx306@gmail.com	\N	\N	quang2	Dev	Dev	\N	\N	\N	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/image/pu65Tr6FE_iyExI6wo2_326691424_1371589173612664_2476295418492007821_n.png	https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/pu65Tr6FE_98yWLi3vZ_327187306_503724738543794_1432704642271550047_n.jpg	\N	\N	\N	hi	dev.com	Dev	VN	\N	90	\N	\N	{"facebook": "facebook.com"}	{"{\\"url\\": \\"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/pu65Tr6FE_CPhDv76RF\\", \\"type\\": \\"image\\"}","{\\"url\\": \\"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/pu65Tr6FE_gVckNJn5J\\", \\"type\\": \\"image\\"}"}	{"{\\"skill\\": \\"reactjs\\", \\"hirable\\": false}"}	{"{\\"subject\\": \\"champion\\", \\"highlight\\": false, \\"description\\": \\"LoL\\"}"}	{"{\\"to\\": \\"2023-12\\", \\"from\\": \\"2023-04\\", \\"name\\": \\"dev\\", \\"position\\": \\"dev\\", \\"description\\": \\"dev\\"}"}	{"{\\"to\\": \\"2023-12\\", \\"from\\": \\"2023-01\\", \\"name\\": \\"kbtg\\", \\"position\\": \\"dev\\", \\"description\\": \\"dev\\"}"}	{"{\\"to\\": \\"2023-12\\", \\"from\\": \\"2023-01\\", \\"major\\": \\"uit\\", \\"title\\": \\"uit\\", \\"degree\\": \\"uit\\", \\"school\\": \\"uit\\"}"}	{coding}	{friend,"basketball team"}	A	pu65Tr6FE	2023-03-30 13:36:58.26+07	pu65Tr6FE	2023-03-30 13:36:58.26+07	\N	2
\.


--
-- Data for Name: usersearchs; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.usersearchs (item) FROM stdin;
friend
room mate
basketball team
\.


--
-- Data for Name: userskills; Type: TABLE DATA; Schema: public; Owner: quangta
--

COPY public.userskills (skill) FROM stdin;
java
javascripts
c++
c#
c
python
ruby
rust
reactjs
angular
vue
express
codeigniter
react native
flutter
\.


--
-- Name: appreciation appreciation_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.appreciation
    ADD CONSTRAINT appreciation_pkey PRIMARY KEY (id);


--
-- Name: appreciationcomment appreciationcomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.appreciationcomment
    ADD CONSTRAINT appreciationcomment_pkey PRIMARY KEY (commentid);


--
-- Name: appreciationreaction appreciationreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.appreciationreaction
    ADD CONSTRAINT appreciationreaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: article article_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.article
    ADD CONSTRAINT article_pkey PRIMARY KEY (id);


--
-- Name: articlecomment articlecomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlecomment
    ADD CONSTRAINT articlecomment_pkey PRIMARY KEY (commentid);


--
-- Name: articlecommentinfo articlecommentinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlecommentinfo
    ADD CONSTRAINT articlecommentinfo_pkey PRIMARY KEY (commentid);


--
-- Name: articlecommentreaction articlecommentreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlecommentreaction
    ADD CONSTRAINT articlecommentreaction_pkey PRIMARY KEY (commentid, author, userid);


--
-- Name: articlecommentthread articlecommentthread_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlecommentthread
    ADD CONSTRAINT articlecommentthread_pkey PRIMARY KEY (commentid);


--
-- Name: articlecommentthreadinfo articlecommentthreadinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlecommentthreadinfo
    ADD CONSTRAINT articlecommentthreadinfo_pkey PRIMARY KEY (commentid);


--
-- Name: articlecommentthreadreaction articlecommentthreadreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlecommentthreadreaction
    ADD CONSTRAINT articlecommentthreadreaction_pkey PRIMARY KEY (commentid, author, userid);


--
-- Name: articleinfo articleinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articleinfo
    ADD CONSTRAINT articleinfo_pkey PRIMARY KEY (id);


--
-- Name: articlerate articlerate_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articlerate
    ADD CONSTRAINT articlerate_pkey PRIMARY KEY (id, author);


--
-- Name: articleratecomment articleratecomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articleratecomment
    ADD CONSTRAINT articleratecomment_pkey PRIMARY KEY (commentid);


--
-- Name: articleratereaction articleratereaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.articleratereaction
    ADD CONSTRAINT articleratereaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: authencodes authencodes_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.authencodes
    ADD CONSTRAINT authencodes_pkey PRIMARY KEY (id);


--
-- Name: brand brand_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.brand
    ADD CONSTRAINT brand_pkey PRIMARY KEY (brand);


--
-- Name: category category_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.category
    ADD CONSTRAINT category_pkey PRIMARY KEY (categoryid);


--
-- Name: cinema cinema_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.cinema
    ADD CONSTRAINT cinema_pkey PRIMARY KEY (id);


--
-- Name: company company_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.company
    ADD CONSTRAINT company_pkey PRIMARY KEY (id);


--
-- Name: company_users company_users_pk; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.company_users
    ADD CONSTRAINT company_users_pk PRIMARY KEY (company_id, user_id);


--
-- Name: companycategory companycategory_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companycategory
    ADD CONSTRAINT companycategory_pkey PRIMARY KEY (categoryid);


--
-- Name: companycomment companycomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companycomment
    ADD CONSTRAINT companycomment_pkey PRIMARY KEY (commentid);


--
-- Name: companyrate companyrate_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyrate
    ADD CONSTRAINT companyrate_pkey PRIMARY KEY (id, author);


--
-- Name: companyratefullinfo companyratefullinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyratefullinfo
    ADD CONSTRAINT companyratefullinfo_pkey PRIMARY KEY (id);


--
-- Name: companyrateinfo01 companyrateinfo1_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyrateinfo01
    ADD CONSTRAINT companyrateinfo1_pkey PRIMARY KEY (id);


--
-- Name: companyrateinfo02 companyrateinfo2_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyrateinfo02
    ADD CONSTRAINT companyrateinfo2_pkey PRIMARY KEY (id);


--
-- Name: companyrateinfo03 companyrateinfo3_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyrateinfo03
    ADD CONSTRAINT companyrateinfo3_pkey PRIMARY KEY (id);


--
-- Name: companyrateinfo04 companyrateinfo4_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyrateinfo04
    ADD CONSTRAINT companyrateinfo4_pkey PRIMARY KEY (id);


--
-- Name: companyrateinfo05 companyrateinfo5_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyrateinfo05
    ADD CONSTRAINT companyrateinfo5_pkey PRIMARY KEY (id);


--
-- Name: companyratereaction companyratereaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.companyratereaction
    ADD CONSTRAINT companyratereaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: countries countries_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (country);


--
-- Name: usereducations educations_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.usereducations
    ADD CONSTRAINT educations_pkey PRIMARY KEY (school);


--
-- Name: film film_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.film
    ADD CONSTRAINT film_pkey PRIMARY KEY (id);


--
-- Name: filmcasts filmcasts_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmcasts
    ADD CONSTRAINT filmcasts_pkey PRIMARY KEY (actor);


--
-- Name: filmcategory filmcategory_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmcategory
    ADD CONSTRAINT filmcategory_pkey PRIMARY KEY (categoryid);


--
-- Name: filmcommentthread filmcommentthread_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmcommentthread
    ADD CONSTRAINT filmcommentthread_pkey PRIMARY KEY (commentid);


--
-- Name: filmcommentthreadinfo filmcommentthreadinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmcommentthreadinfo
    ADD CONSTRAINT filmcommentthreadinfo_pkey PRIMARY KEY (commentid);


--
-- Name: filmcommentthreadreaction filmcommentthreadreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmcommentthreadreaction
    ADD CONSTRAINT filmcommentthreadreaction_pkey PRIMARY KEY (commentid, author, userid);


--
-- Name: filmdirectors filmdirectors_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmdirectors
    ADD CONSTRAINT filmdirectors_pkey PRIMARY KEY (director);


--
-- Name: filmproductions filmproductions_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmproductions
    ADD CONSTRAINT filmproductions_pkey PRIMARY KEY (production);


--
-- Name: filmrate filmrate_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmrate
    ADD CONSTRAINT filmrate_pkey PRIMARY KEY (id, author);


--
-- Name: filmratecomment filmratecomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmratecomment
    ADD CONSTRAINT filmratecomment_pkey PRIMARY KEY (commentid);


--
-- Name: filmrateinfo filmrateinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmrateinfo
    ADD CONSTRAINT filmrateinfo_pkey PRIMARY KEY (id);


--
-- Name: filmratereaction filmratereaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmratereaction
    ADD CONSTRAINT filmratereaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: filmreplycomment filmreplycomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmreplycomment
    ADD CONSTRAINT filmreplycomment_pkey PRIMARY KEY (commentid);


--
-- Name: filmreplycommentinfo filmreplycommentinfoo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmreplycommentinfo
    ADD CONSTRAINT filmreplycommentinfoo_pkey PRIMARY KEY (commentid);


--
-- Name: filmreplycommentreaction filmreplycommentreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.filmreplycommentreaction
    ADD CONSTRAINT filmreplycommentreaction_pkey PRIMARY KEY (commentid, author, userid);


--
-- Name: history history_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.history
    ADD CONSTRAINT history_pkey PRIMARY KEY (id);


--
-- Name: userinterests interests_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userinterests
    ADD CONSTRAINT interests_pkey PRIMARY KEY (interest);


--
-- Name: item item_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.item
    ADD CONSTRAINT item_pkey PRIMARY KEY (id);


--
-- Name: itemcategory itemcategory_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.itemcategory
    ADD CONSTRAINT itemcategory_pkey PRIMARY KEY (categoryid);


--
-- Name: itemcomment itemcomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.itemcomment
    ADD CONSTRAINT itemcomment_pkey PRIMARY KEY (id);


--
-- Name: iteminfo iteminfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.iteminfo
    ADD CONSTRAINT iteminfo_pkey PRIMARY KEY (id);


--
-- Name: itemresponse itemresponse_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.itemresponse
    ADD CONSTRAINT itemresponse_pkey PRIMARY KEY (id, author);


--
-- Name: itemresponsereaction itemresponsereaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.itemresponsereaction
    ADD CONSTRAINT itemresponsereaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: job job_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.job
    ADD CONSTRAINT job_pkey PRIMARY KEY (id);


--
-- Name: location location_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.location
    ADD CONSTRAINT location_pkey PRIMARY KEY (id);


--
-- Name: locationcomment locationcomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationcomment
    ADD CONSTRAINT locationcomment_pkey PRIMARY KEY (commentid);


--
-- Name: locationcommentthread locationcommentthread_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationcommentthread
    ADD CONSTRAINT locationcommentthread_pkey PRIMARY KEY (commentid);


--
-- Name: locationcommentthreadinfo locationcommentthreadinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationcommentthreadinfo
    ADD CONSTRAINT locationcommentthreadinfo_pkey PRIMARY KEY (commentid);


--
-- Name: locationcommentthreadreaction locationcommentthreadreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationcommentthreadreaction
    ADD CONSTRAINT locationcommentthreadreaction_pkey PRIMARY KEY (commentid, author, userid);


--
-- Name: locationinfo locationinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationinfo
    ADD CONSTRAINT locationinfo_pkey PRIMARY KEY (id);


--
-- Name: locationinfomation locationinfomation_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationinfomation
    ADD CONSTRAINT locationinfomation_pkey PRIMARY KEY (id);


--
-- Name: locationrate locationrate_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationrate
    ADD CONSTRAINT locationrate_pkey PRIMARY KEY (id, author);


--
-- Name: locationratereaction locationratereaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationratereaction
    ADD CONSTRAINT locationratereaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: locationreplycomment locationreplycomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationreplycomment
    ADD CONSTRAINT locationreplycomment_pkey PRIMARY KEY (commentid);


--
-- Name: locationreplycommentinfo locationreplycommentinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationreplycommentinfo
    ADD CONSTRAINT locationreplycommentinfo_pkey PRIMARY KEY (commentid);


--
-- Name: locationreplycommentreaction locationreplycommentreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.locationreplycommentreaction
    ADD CONSTRAINT locationreplycommentreaction_pkey PRIMARY KEY (commentid, author, userid);


--
-- Name: music music_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.music
    ADD CONSTRAINT music_pkey PRIMARY KEY (id);


--
-- Name: passwordcodes passwordcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.passwordcodes
    ADD CONSTRAINT passwordcodes_pkey PRIMARY KEY (id);


--
-- Name: passwords passwords_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.passwords
    ADD CONSTRAINT passwords_pkey PRIMARY KEY (id);


--
-- Name: playlist playlist_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.playlist
    ADD CONSTRAINT playlist_pkey PRIMARY KEY (id);


--
-- Name: reservation reservation_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.reservation
    ADD CONSTRAINT reservation_pkey PRIMARY KEY (id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (id);


--
-- Name: saveditem saveditem_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.saveditem
    ADD CONSTRAINT saveditem_pkey PRIMARY KEY (id);


--
-- Name: savedlocation savedlocation_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.savedlocation
    ADD CONSTRAINT savedlocation_pkey PRIMARY KEY (id);


--
-- Name: usersearchs searchs_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.usersearchs
    ADD CONSTRAINT searchs_pkey PRIMARY KEY (item);


--
-- Name: signupcodes signupcodes_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.signupcodes
    ADD CONSTRAINT signupcodes_pkey PRIMARY KEY (id);


--
-- Name: userskills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userskills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (skill);


--
-- Name: usercompanies user_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.usercompanies
    ADD CONSTRAINT user_companies_pkey PRIMARY KEY (company);


--
-- Name: userinfo userinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userinfo
    ADD CONSTRAINT userinfo_pkey PRIMARY KEY (id);


--
-- Name: userinfomation userinfomation_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userinfomation
    ADD CONSTRAINT userinfomation_pkey PRIMARY KEY (id);


--
-- Name: userrate userrate_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userrate
    ADD CONSTRAINT userrate_pkey PRIMARY KEY (id, author);


--
-- Name: userratecomment userratecomment_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userratecomment
    ADD CONSTRAINT userratecomment_pkey PRIMARY KEY (commentid);


--
-- Name: userrateinfo userrateinfo_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userrateinfo
    ADD CONSTRAINT userrateinfo_pkey PRIMARY KEY (id);


--
-- Name: userratereaction userratereaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userratereaction
    ADD CONSTRAINT userratereaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: userreaction userreaction_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.userreaction
    ADD CONSTRAINT userreaction_pkey PRIMARY KEY (id, author, userid);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: quangta
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

