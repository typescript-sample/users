create table users
(
	id character varying(40) not null primary key,
	username character varying(120),
	email character varying(120),
	phone character varying(45),
	gender char(1),	
	displayname character varying(500),
	givenName character varying(100),
	familyName character varying(100),
	middleName character varying(100),

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
	interests character varying[],
	lookingfor character varying[],
	status char(1),
	createdby character varying(40) not null,
	createdat timestamp with time zone,
	updatedby character varying(40) not null,
	updatedat timestamp with time zone,
	version integer
);

create table passwords (
	id character varying(40) not null primary key,
	password character varying(255),
	successtime timestamp with time zone,
	failtime timestamp with time zone,
	failcount integer,
	lockeduntiltime timestamp with time zone,
	history character varying[]
);
create table history (
	id character varying(40) not null primary key,
	history character varying[]
);
create table userinfo (
  id character varying(40) not null primary key,
  followercount bigint default 0,
  followingcount bigint default 0,
  rate1 int default 0
);
create table userfollowing (
  id character varying(40) not null ,
  following character varying(40) not null 
);
create table userfollower (
  id character varying(40) not null ,
  follower character varying(40) not null 
);
create table signupcodes (
	id character varying(40) not null primary key,
	code character varying(500) not null,
	expiredat timestamp with time zone not null
);
create table authencodes (
	id character varying(40) not null primary key,
	code character varying(500) not null,
	expiredat timestamp with time zone not null
);
create table passwordcodes (
	id character varying(40) not null primary key,
	code character varying(500) not null,
	expiredat timestamp with time zone not null
);

create table skills(
	skill varchar(120) not null,
  primary key (skill)
);

create table interests(
	interest varchar(120) not null,
	primary key (interest)
);
create table searchs (
	item varchar(120) not null,
	primary key (item)
);

insert into skills(skill) values('java');
insert into skills(skill) values('javascripts');
insert into skills(skill) values('c++');
insert into skills(skill) values('c#');
insert into skills(skill) values('c');
insert into skills(skill) values('python');
insert into skills(skill) values('ruby');
insert into skills(skill) values('rust');
insert into skills(skill) values('reactjs');
insert into skills(skill) values('angular');
insert into skills(skill) values('vue');
insert into skills(skill) values('express');
insert into skills(skill) values('codeigniter');
insert into skills(skill) values('react native');
insert into skills(skill) values('flutter');

insert into interests(interest) values('game');
insert into interests(interest) values('movie');
insert into interests(interest) values('coding');
insert into interests(interest) values('football');
insert into interests(interest) values('basketball');
insert into interests(interest) values('books');
insert into interests(interest) values('money');
insert into interests(interest) values('manga');
insert into interests(interest) values('badminton');
insert into interests(interest) values('esport');
insert into interests(interest) values('food');

insert into searchs(item) values('friend');
insert into searchs(item) values('room mate');
insert into searchs(item) values('basketball team');
-- insert into skills(skill) values ('java') on conflict(skill) do nothing

--rate user-------------------------------------------
CREATE TABLE userrateinfo(
  id varchar(255),
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
  score numeric,
  primary key(id)
)
CREATE TABLE userrate(
  id varchar(255),
  author varchar(255),
  rate integer,
  time timestamp,
  review text,
  usefulcount integer default 0,
  replycount integer default 0,
  histories jsonb[],
  primary key(id, author)
)
CREATE TABLE userratereaction(
	id varchar(255),
	author varchar(255),
	userid varchar(255),
	time timestamp,
	reaction smallint,
	primary key(id, author, userid)
)
CREATE TABLE userratecomment(
  commentId varchar(255),
  id varchar(255),
  author varchar(255),
  userid varchar(255),
  comment text,
  time timestamp,
  updatedat timestamp,
  histories jsonb[],
  primary key(commentid)
)
--userreaction-----------------------------------------------
create table userreaction (
  id varchar(255),
  author varchar(255),
  reaction smallint,
  time timestamp,
  primary key(id, author, userid)
)
create table userinfomation(
  id varchar(255),
  appreciate bigint default 0,
  respect bigint default 0,
  admire bigint default 0,
  reactioncount bigint default 0,
  primary key(id)
)
-------------------------------------------------------------
create table articles (
  id character varying(40) primary key,
  title character varying(300),
  name character varying(300),
  description character varying(1000),
  type character varying(40),
  content character varying(100000),
  authorId character varying(40),
  tags character varying[]
);

insert into articles(id, title, name, description, type, content, authorId, tags) values ('01', 'This is title 01', 'This is name 01', 'This is description 01', 'type 01', '<div class="key-event__content"> 
    <p>Trong phần thủ tục, các luật sư bảo vệ người bị hại đề nghị HĐXX xác định tỷ lệ thương tích của bị hại vào các ngày 7, 10, và 12.12.2021, nhằm xem xét xử lý các bị cáo hành vi “cố ý gây thương tích. </p> 
    <p>Bên cạnh đó, các luật sư đề nghị HĐXX xem xét và xác định Thái đồng phạm tội danh "giết người" với bị cáo Trang.</p>  
    <table class="picture" align="center"> 
     <tbody> 
      <tr> 
       <td class="pic"> <img data-image-id="3910826" src="https://image.thanhnien.vn/w2048/Uploaded/2022/bahgtm/2022_07_21/thai-2-3830.jpg" data-width="2560" data-height="1697" class="cms-photo" alt="Xét xử vụ bé gái 8 tuổi bị bạo hành tử vong: Tòa cân nhắc khi trình chiếu video hành vi phạm tội  - ảnh 1" caption="Xét xử vụ bé gái 8 tuổi bị bạo hành tử vong: Tòa cân nhắc khi trình chiếu video hành vi phạm tội  - ảnh 1"> </td> 
      </tr> 
      <tr>
       <td class="caption"><p>Bị cáo Trung Thái và Quỳnh Trang tại phiên tòa sáng 21.7</p>
        <div class="source">
         <p>ngọc dương</p>
        </div></td>
      </tr> 
     </tbody>
    </table> 
   </div>', '77c35c38c3554ea6906730dbcfeca0f2', '{tag01, tag02}');
insert into articles(id, title, name, description, type, content, authorId, tags) values ('02', 'This is title 02', 'This is name 02', 'This is description 02', 'type 02', 'This is content 02', '77c35c38c3554ea6906730dbcfeca0f2', '{tag01, tag02}');
insert into articles(id, title, name, description, type, content, authorId, tags) values ('03', 'This is title 03', 'This is name 03', 'This is description 03', 'type 03', 'This is content 03', '77c35c38c3554ea6906730dbcfeca0f2', '{tag01, tag02}');
insert into articles(id, title, name, description, type, content, authorId, tags) values ('04', 'This is title 04', 'This is name 04', 'This is description 04', 'type 04', 'This is content 04', '77c35c38c3554ea6906730dbcfeca0f2', '{tag01, tag02}');
insert into articles(id, title, name, description, type, content, authorId, tags) values ('05', 'This is title 05', 'This is name 05', 'This is description 05', 'type 05', 'This is content 05', '77c35c38c3554ea6906730dbcfeca0f2', '{tag01, tag02}');
create table AppreciationItemReply (
  id varchar(20) not null,
  authorId varchar(40),
  itemId varchar(40),
  title varchar(120),
  description varchar(120),
  createdAt  date
);

insert into AppreciationItemReply(id, authorId, itemId, title, description) values ("01", "01", "w1","good!!!","interest wrestler");


create table if not exists appreciation (
  id varchar(40) not null,
  authorid varchar(40),
  title varchar(120),
  description varchar(120),
  usefulcount integer,
  replycount integer,
  createdat date,
  userid varchar(40),
  primary key (id)
);

create table if not exists appreciationreply (
  id varchar(40) not null,
  appreciationid varchar(40),
  title varchar(120),
  description varchar(120),
  createdat varchar(120),
  updateat varchar(120),
  authorid varchar(40),
  usefulcount integer,
  replycount integer,
  userid varchar(40),
  primary key (id)
);

create table if not exists usefulappreciation (
  id varchar(40) not null,
  appreciationid varchar(40),
  userid varchar(40),
  createdat date,
  updateat date,
  primary key (id)
);

create table if not exists comments (
  id varchar(255) not null,
  author varchar(255),
  comment text,
  createdat date
);

-- Item
create table item (
  id character varying(40) primary key,
  title character varying(120) not null,
  status char(1) not null,
	price numeric(16,2) not null,
	imageurl character varying(1500),
  brand character varying(120) not null,
	publishedat timestamp with time zone,
	expiredat timestamp with time zone,
  description character varying(1000),
  category character varying[],
  gallery jsonb[]
);

insert into item (id, title, status, price, imageurl, brand, publishedat, expiredat, description, category) values ('01', 'Movie tickets', 'A', 100000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png', 'Disney', '2022-07-19', '2022-08-25', 'Thor movie ticket', '{comedy,action}');
insert into item (id, title, status, price, imageurl, brand, publishedat, expiredat, description, category) values ('02', 'Iphone 13', 'A', 20000000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png', 'Apple', '2022-07-19', '2025-07-19', 'Iphone 13 from Apple', '{mobiphone,technological,apple}');
insert into item (id, title, status, price, imageurl, brand, publishedat, expiredat, description, category) values ('03', 'Camera', 'A', 100000000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png','Samsung', '2022-07-19', '2025-07-19', 'Camera from Samsung', '{camera,technological}');
insert into item (id, title, status, price, imageurl, brand, publishedat, expiredat, description, category) values ('04', 'Movie tickets', 'A', 100000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png','Disney', '2022-07-19', '2022-08-25', 'Minion mooive ticket', '{comedy,action}');
insert into item (id, title, status, price, imageurl, brand, publishedat, expiredat, description, category) values ('05', 'Macbook', 'A', 25000000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png','Apple', '2022-07-19', '2025-07-19', 'Macbook from Apple', '{laptop,technological,apple}');

select * from item where category && '{"apple"}';

create table category(
  categoryid character varying(40) primary key,
  categoryname character varying(300) not null,
  status char(1) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);

insert into category (categoryid,categoryname,status) values ('action','action','A');
insert into category (categoryid,categoryname,status) values ('comedy','comedy','A');
insert into category (categoryid,categoryname,status) values ('camera','camera','A');
insert into category (categoryid,categoryname,status) values ('mobiphone','mobiphone','A');
insert into category (categoryid,categoryname,status) values ('technological','technological','A');
insert into category (categoryid,categoryname,status) values ('apple','apple','A');
insert into category (categoryid,categoryname,status) values ('laptop','laptop','A');


create table brand (
  brand character varying(255) primary key
);

insert into brands (brand) values('Sony');
insert into brands (brand) values ('Samsung');
insert into brands (brand) values ('Canon');
insert into brands (brand) values ('Nikon');
insert into brands (brand) values ('Olypus');
insert into brands (brand) values ('Xiaomi');
insert into brands (brand) values ('Apple');
insert into brands (brand) values ('Disney');


create table itemresponse(
  id character varying(40) not null,
  author character varying(40) not null,
  description text,
  time timestamp,
  usefulcount integer default 0,
  replycount integer default 0,
  histories jsonb[],
  primary key (id, author)
);

insert into itemresponse (id,author,description,time) values ('01','77c35c38c3554ea6906730dbcfeca0f2', 'Good', '2022-07-22');
insert into itemresponse (id,author,description,time) values ('02','77c35c38c3554ea6906730dbcfeca0f2', 'Not Bad', '2022-07-22');
insert into itemresponse (id,author,description,time) values ('03','77c35c38c3554ea6906730dbcfeca0f2', 'Wow', '2022-07-22');
insert into itemresponse (id,author,description,time) values ('04','77c35c38c3554ea6906730dbcfeca0f2', 'Bad', '2022-07-22');
insert into itemresponse (id,author,description,time) values ('05','77c35c38c3554ea6906730dbcfeca0f2', 'I hate this', '2022-07-22');


create table itemcomment (
  commentId character varying(40) not null,
  id character varying(40) not null,
  author character varying(40) not null,
  userId character varying(40) not null,
  comment text,
  time timestamp,
  updatedat timestamp,
  histories jsonb[],
  primary key (commentId)
);

insert into itemcomment (id,author,userId,comment,time) values ('01','02','77c35c38c3554ea6906730dbcfeca0f2', 'Good', '2022-07-22');
insert into itemcomment (id,author,userId,comment,time) values ('02','06','77c35c38c3554ea6906730dbcfeca0f2', 'Not Bad', '2022-07-22');
insert into itemcomment (id,author,userId,comment,time) values ('03','05','77c35c38c3554ea6906730dbcfeca0f2', 'abc', '2022-07-22');
insert into itemcomment (id,author,userId,comment,time) values ('04','07','77c35c38c3554ea6906730dbcfeca0f2', 'Bad', '2022-07-22');
insert into itemcomment (id,author,userId,comment,time) values ('05','11','77c35c38c3554ea6906730dbcfeca0f2', '123', '2022-07-22');

CREATE TABLE iteminfo(
  id varchar(255),
  viewCount integer DEFAULT 0,
  primary key(id)
)

create table itemresponsereaction(
	id varchar(255),
	author varchar(255),
	userid varchar(255),
	time timestamp,
	reaction smallint,
	primary key(id, author, userid)
)

-- Location
create table location (
  id character varying(40) primary key,
  name character varying(300) not null,
  type character varying(40),
  description character varying(1000),
  status char(1) not null,
	latitude numeric(20,16) not null,
	longitude numeric(20,16) not null,
	imageURL character varying(1500),
	coverURL character varying(1500)
);

insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d146cbffbdf2b1d30742262',	
	'Highland Coffee',
	'coffee',
	'Highland Coffee',
	'A',
	106.62435293197633,
	10.852848365357607,
	'https://thumbs.dreamstime.com/z/highlands-coffee-shop-vung-tau-vietnam-jan-facade-vietnamese-chain-producer-distributor-86167986.jpg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);
insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d1d7a18c5e4f320a86ca6b1',	
	'Trung Nguyen Coffee',
	'coffee',
	'Trung Nguyen Coffee',
	'A',
	106.631039,
	10.855858,
	'https://cdn2.shopify.com/s/files/1/0065/6759/1999/files/dia-chi-trung-nguyen-legend-cafe-tai-vincom-ha-nam_grande.jpg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);
insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d1d7a66c5e4f320a86ca6b2',	
	'Highland Coffee',
	'coffee',
	'Highland Coffee',
	'A',
	106.630691,
	10.855842,
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/image/5d1d7a66c5e4f320a86ca6b2_IFc9Db9DT_c.jpg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);
insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d1d7a85c5e4f320a86ca6b3',	
	'Starbucks Coffee',
	'coffee',
	'Starbucks Coffee',
	'A',
	106.631495,
	10.854809,
	'https://ichef.bbci.co.uk/news/976/cpsprodpb/17185/production/_118879549_gettyimages-1308703596.jpg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);
insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d1d7b79c5e4f320a86ca6b4',	
	'King Coffee',
	'coffee',
	'King Coffee',
	'A',
	106.624183,
	10.855761,
	'https://www.asia-bars.com/wp-content/uploads/2015/11/cong-caphe-1.jpg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);
insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d1efb3796988a127077547c',	
	'Sumo BBQ Restaurant',
	'restaurant',
	'farthest',
	'A',
	106.624169,
	10.855769,
	'https://135525-391882-2-raikfcquaxqncofqfm.stackpathdns.com/wp-content/uploads/2021/04/Summo-BBQ-1280x960.jpeg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);
insert into location (id, name, type, description, status, latitude, longitude, imageURL, coverURL) values (
	'5d562ad357568217d0d9a2d5',	
	'CGV',
	'cinema',
	'CGV cinema',
	'A',
	106.6316112323025,
	10.85486116109013,
	'https://rapchieuphim.com/photos/9/rap-cgv-su-van-hanh/rap-CGV-Su-van-hanh-8__2_.jpg',
	'https://storage.googleapis.com/go-firestore-rest-api.appspot.com/cover/5d146cbffbdf2b1d30742262_TL4wqjvnz_4K-Art-Wallpapers.jpg'
);


create table locationinfo (
  id character varying(40) primary key,
  rate numeric DEFAULT 0,
  rate1 integer DEFAULT 0,
  rate2 integer DEFAULT 0,
  rate3 integer DEFAULT 0,
  rate4 integer DEFAULT 0,
  rate5 integer DEFAULT 0,
  viewCount integer DEFAULT 0
);

insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d146cbffbdf2b1d30742262',3.1811023622047245,22,32,15,17,41,123);
insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d1d7a18c5e4f320a86ca6b1',3.4,1,1,0,1,2,2);
insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d1d7a66c5e4f320a86ca6b2',3.857142857142857,1,0,0,4,2,4);
insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d1d7a85c5e4f320a86ca6b3',0,0,0,0,0,0,0);
insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d1d7b79c5e4f320a86ca6b4',0,0,0,0,0,0,0);
insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d1efb3796988a127077547c',0,0,0,0,0,0,0);
insert into locationinfo (id, rate, rate1, rate2, rate3, rate4, rate5, viewCount) values ('5d562ad357568217d0d9a2d5',0,0,0,0,0,0,0);


create table locationrate (
  id character varying(40) not null,
  author character varying(40) not null,
  rate integer not null,
  rateTime timestamp without time zone,
  review text,
  usefulcount integer default 0,
  replycount integer default 0,
  primary key (id, author)
);

insert into locationrate (id, author, rate, rateTime, review) values ('5d146cbffbdf2b1d30742262','77c35c38c3554ea6906730dbcfeca0f2',1,'2021-10-01','Bad');
insert into locationrate (id, author, rate, rateTime, review) values ('5d1d7a18c5e4f320a86ca6b1','77c35c38c3554ea6906730dbcfeca0f2',3,'2021-10-01','Poor');
insert into locationrate (id, author, rate, rateTime, review) values ('5d1d7b79c5e4f320a86ca6b4','77c35c38c3554ea6906730dbcfeca0f2',5,'2021-10-01','Excellent');
insert into locationrate (id, author, rate, rateTime, review) values ('5d1efb3796988a127077547c','77c35c38c3554ea6906730dbcfeca0f2',1,'2021-10-01','Poor');
insert into locationrate (id, author, rate, rateTime, review) values ('5d562ad357568217d0d9a2d5','77c35c38c3554ea6906730dbcfeca0f2',4,'2021-10-01','Good');

CREATE TABLE locationratereaction (
	id character varying(40),
	author character varying(40),
	userid character varying(40),
	time timestamp,
	reaction smallint,
	primary key(id, author, userid)
)

create table locationcomment(
  commentId character varying(40) not null,
  id character varying(40) not null,
  author character varying(40) not null,
  userId character varying(40) not null,
  comment text,
  time timestamp,
  updatedat timestamp,
  histories jsonb[],
  primary key (commentId)
);


create table locationinfomation (
  id character varying(40) not null primary key,
  followercount bigint,
  followingcount bigint
)
create table locationfollowing (
  id character varying(40) not null ,
  following character varying(40) not null 
)
create table locationfollower (
  id character varying(40) not null ,
  follower character varying(40) not null 
)

--company----
create table company
(
    id character varying(40) not null primary key,
    name character varying(120),
    description character varying(1000),
    address character varying(255) not null,
    size integer,
    status char(1) not null,
    establishedAt timestamp with time zone,
    category character varying[]
);
insert into company (id, name,address, description, size, status, establishedAt, category) values ('id1','Softwave company',' Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh', 'This is description', 500,'A', '2022-07-21','{Categories1, Categories2}');
insert into company (id, name,address, description, size,status, establishedAt, category) values ('id2','Softwave company', ' Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh','This is description', 500,'A', '2022-07-21','{Categories1, Categories2}');
insert into company (id, name,address, description, size,status, establishedAt, category) values ('id3','Softwave company',' Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh', 'This is description', 500,'A', '2022-07-21','{Categories1, Categories2}');
insert into company (id, name,address, description, size,status, establishedAt, category) values ('id4','Softwave company',' Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh', 'This is description', 500,'I', '2022-07-21','{Categories1, Categories2}');
insert into company (id, name,address, description, size,status, establishedAt, category) values ('id5','Softwave company',' Hùng Vương Plaza 126 Hùng Vương Quận 5 Tp. Hồ Chí Minh', 'This is description', 500,'I', '2022-07-21','{Categories1, Categories2}');

create table company_categories(
  categoryid character varying(40) primary key,
  categoryname character varying(300) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);


insert into company_categories (categoryid,categoryname) VALUES ('Entertainment','Entertainment');
insert into company_categories (categoryid,categoryname) VALUES ('Financial business','Financial business');
insert into company_categories (categoryid,categoryname) VALUES ('Industrial production','Industrial production');
insert into company_categories (categoryid,categoryname) VALUES ('Real estate business','Real estate business');
insert into company_categories (categoryid,categoryname) VALUES ('Business services','Business services');

CREATE TABLE review_company(
  id varchar(255),
  author varchar(255),
  time timestamp,
  review text,
  usefulcount integer default 0,
  replycount integer default 0,
  histories jsonb[],
  primary key(id, author)
)
insert into review_company (id,author,time,review,usefulcount,replycount,histories) VALUES ('id1','ra0mKfxLs','2022-07-27 10:31:04.405','test', 0,0,'{}');



create table if not exists reply_company (
  id varchar(40) not null,
  author varchar(40),
  review text,
  createdat date,
  updatedat date,
  userid varchar(40),
  primary key (id)
);

create table if not exists useful_company (
  id varchar(40) not null,
  author varchar(40),
  reviewTime date,
  userid varchar(40),
  primary key (id)
);


CREATE TABLE rates_company(
  id varchar(255),
  author varchar(255),
  rate integer,
  time timestamp,
  review text,
  usefulcount integer default 0,
  replycount integer default 0,
  histories jsonb[],
  primary key(id, author)
)
CREATE TABLE info_company(
  id varchar(255),
  rate numeric DEFAULT 0,
  rate1 integer DEFAULT 0,
  rate2 integer DEFAULT 0,
  rate3 integer DEFAULT 0,
  rate4 integer DEFAULT 0,
  rate5 integer DEFAULT 0,
  viewCount integer DEFAULT 0,
  count integer DEFAULT 0,
  score  numeric DEFAULT 0,
  primary key(id)
)
CREATE TABLE ratereaction_company(
	id varchar(255),
	author varchar(255),
	userid varchar(255),
	time timestamp,
	reaction smallint,
	primary key(id, author, userid)
)
CREATE TABLE rate_comments_company(
  commentid varchar(255),
  id varchar(255),
  author varchar(255),
  userid varchar(255),
  comment text,
  time timestamp,
  updatedat timestamp,
  histories jsonb[],
  primary key(commentid)
);

create table companyinfomation (
  id character varying(40) not null primary key,
  followercount bigint,
  followingcount bigint
)
create table companyfollowing (
  id character varying(40) not null ,
  following character varying(40) not null 
)
create table companyfollower (
  id character varying(40) not null ,
  follower character varying(40) not null 
)

--film----------------------------------------------------

create table film(
  filmid character varying(40) primary key,
  title character varying(300) not null,
  description character varying(300),
  imageurl character varying(300),
  trailerurl character varying(300),
  category character varying[],
  status char(1) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);

create table if not exists usefulfilm(
  id character varying(255) ,
  author character varying(255),
  createdat timestamp,
  updatedat timestamp,
  PRIMARY KEY (id, author)
)

--drop table category
create table filmcategory(
  categoryid character varying(40) primary key,
  categoryname character varying(300) not null,
  status char(1) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);

--drop table cinema
CREATE TABLE cinema (
  id varchar(40),
  name varchar(255) NOT NULL,
  address varchar(255) NOT NULL,
  parent varchar(40),
  status CHAR(1) NOT NULL,
  latitude  numeric,
  longitude numeric,
  imageURL text,
  createdby varchar(40),
  createdat timestamp,
  updatedby varchar(40),
  updatedat timestamp,
  gallery jsonb[],
  coverUrl text
  primary key(id)
);

CREATE TABLE filmrateinfo(
  id varchar(255),
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
  score numeric,
  primary key(id)
)

CREATE TABLE filmrate(
  id varchar(255),
  author varchar(255),
  rate integer,
  time timestamp,
  review text,
  usefulcount integer default 0,
  replycount integer default 0,
  histories jsonb[],
  primary key(id, author)
)

CREATE TABLE filmratereaction(
	id varchar(255),
	author varchar(255),
	userid varchar(255),
	time timestamp,
	reaction smallint,
	primary key(id, author, userid)
)

CREATE TABLE filmratecomment(
  commentId varchar(255),
  id varchar(255),
  author varchar(255),
  userid varchar(255),
  comment text,
  time timestamp,
  updatedat timestamp,
  histories jsonb[],
  primary key(commentid)
);


INSERT INTO filmcategory (categoryid,categoryname,status) VALUES('adventure','adventure','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('animated','animated','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('comedy','comedy','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('drama','drama','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('horror','horror','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('crime','crime','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('fantasy','fantasy','A');
INSERT INTO filmcategory (categoryid,categoryname,status) VALUES ('family','family','A');

INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00001','The Shawshank Redemption','https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg','https://www.imdb.com/video/vi3877612057?playlistId=tt0111161&ref_=tt_pr_ov_vi','{drama}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00002','Thor: Love and Thunder','https://genk.mediacdn.vn/139269124445442048/2022/4/19/2-16503255592162067496114.jpg','https://www.youtube.com/watch?v=tgB1wUcmbbw','{drama,crime}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00003','Top Gun: Maverick','https://www.cgv.vn/media/catalog/product/cache/3/image/c5f0a1eff4c394a251036189ccddaacd/t/o/top_gun_maverick_-_poster_28.03_1_.jpg','https://www.youtube.com/watch?v=yM389FbhlRQ','{action,drama}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00004','The Batman','https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/p/o/poster_batman-1.jpg','https://youtu.be/761uRaAoW00','{action,crime,drama}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00005','The Sadness','https://phimnhua.com/wp-content/uploads/2022/04/phimnhua_1650248826.jpg','https://www.youtube.com/watch?v=axjme4v-xRo','{horror}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00006','Doctor Strange in the Multiverse of Madness','https://m.media-amazon.com/images/M/MV5BMDFkYTc0MGEtZmNhMC00ZDIzLWFmNTEtODM1ZmRlYWMwMWFmXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_UY67_CR0,0,45,67_AL_.jpg','https://www.imdb.com/video/vi3877612057?playlistId=tt0111161&ref_=tt_pr_ov_vi','{action,adventure,fantasy}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00007','Fantastic Beasts: The Secrets of Dumbledore','https://i.bloganchoi.com/bloganchoi.com/wp-content/uploads/2022/04/review-phim-sinh-vat-huyen-bi-3-fantastic-beasts-3-2-696x1031.jpg?fit=700%2C20000&quality=95&ssl=1','https://youtu.be/Y9dr2zw-TXQ','{family,adventure,fantasy}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00008','The Adam Project','http://photos.q00gle.com/storage/files/images-2021/images-movies/09/622b6789e7084.jpg','https://youtu.be/IE8HIsIrq4o','{action,comedy,adventure}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00009','Spider-Man: No Way Home','https://gamek.mediacdn.vn/133514250583805952/2021/11/17/photo-1-1637118381839432740223.jpg','https://www.youtube.com/watch?v=OB3g37GTALc','{action,adventure,fantasy}','A');
INSERT INTO film (filmid,title,imageurl,trailerurl,category,status) VALUES ('00010','Dune','https://www.cgv.vn/media/catalog/product/cache/1/image/c5f0a1eff4c394a251036189ccddaacd/d/u/dune-poster-1.jpg','https://youtu.be/8g18jFHCLXk','{action,adventure,drama}','A');

-- room
create table room(
  id varchar(255)  primary key,
  title varchar(255),
  description varchar(1000),
  price integer,
  offer character varying[],
  location varchar(255),
  host varchar(255),
  guest integer,
  bedrooms integer,
  bed integer,
  bathrooms integer,
  highlight character varying[],
  status CHAR(1) ,
  region varchar(255),
  category character varying[],
  typeof character varying[],
  property varchar(255),
  language character varying[],
  imageUrl jsonb[]
);

insert into room ( id,title,description,price,offer,location,host,guest,bedrooms,bed,bathrooms,highlight,status,region,category,typeof,property,language,imageUrl) 
values (
  '01',
  'KHU NGHỈ DƯỠNG PIUGUS',
  'Piugus resort tọa lạc tại một hòn đảo nhỏ tư nhân tại Anambas. Toàn bộ biệt thự được xây dựng từ gỗ tự nhiên.',
  '500',
  '{Máy giặt,Sân hoặc ban công,Điều hòa nhiệt độ,Bữa sáng,Cho phép ở dài hạn,Cho phép hút thuốc}',
  'Anambas, Kepulauan Riau, Indonesia',
  'Herry',
  5,
  1,
  2,
  1,
  '{Self check-in,Great location,Dive right in}',
  'A',
  'Viet Nam',
  '{Beach, Tiny Home, Islands}',
  '{Toàn bộ nhà, Phòng riêng, Phòng chung}',
  'Nhà',
  '{Tiếng Anh, Tiếng Việt}',
  '{"{\"url\": \"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/JSg3tgoY0_3VZT2SW8b\", \"type\": \"image\"}","{\"url\": \"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/JSg3tgoY0_oSipzWeYi\", \"type\": \"image\"}","{\"url\": \"https://storage.googleapis.com/go-firestore-rest-api.appspot.com/gallery/JSg3tgoY0_EF7bCPZry\", \"type\": \"image\"}"}'
  );



create table music (
  id character varying(40) primary key,
  name character varying(300) not null,
  author character varying[],
	releaseDate date,
	duration time,
  lyric text,

);
INSERT INTO music (id,name,author,releaseDate,duration,lyric) VALUES ('00001','Họ trông chờ gì ở tôi','ICD','15/03/2019','Ánh đèn vàng là sợi dây trói mình lại ở bên cái ghế. Không thể đem cho những cảm xúc tiêu cực nên phải tái chế');
INSERT INTO music (id,name,author,releaseDate,duration,lyric) VALUES ('00001','Họ trông chờ gì ở tôi','ICD','15/03/2019','Ánh đèn vàng là sợi dây trói mình lại ở bên cái ghế. Không thể đem cho những cảm xúc tiêu cực nên phải tái chế');

create table reservation (
  id character varying(40) primary key,
  startdate date,
	enddate date,
  guestid varchar(255),
  totalprice integer,
  roomid varchar(255)
);
insert into reservation (id, startdate,enddate,guestid,totalprice,roomid) values ('01','2022-08-18','2022-08-25','ra0mKfxLs',500,'00001')
insert into reservation (id, startdate,enddate,guestid,totalprice,roomid) values ('02','2022-08-18','2022-08-25','ra0mKfxLs',500,'00001')
insert into reservation (id, startdate,enddate,guestid,totalprice,roomid) values ('03','2022-08-18','2022-08-25','ra0mKfxLs',500,'00001')
insert into reservation (id, startdate,enddate,guestid,totalprice,roomid) values ('04','2022-08-18','2022-08-25','ra0mKfxLs',500,'00001')
insert into reservation (id, startdate,enddate,guestid,totalprice,roomid) values ('05','2022-08-18','2022-08-25','ra0mKfxLs',500,'00001')
insert into reservation (id, startdate,enddate,guestid,totalprice,roomid) values ('06','2022-08-18','2022-08-25','ra0mKfxLs',500,'00001')


create table playlist(
  id character varying(40) primary key,
  title varchar(255),
  userid varchar(255)
);
create table listsong(
  id varchar(40),
  songs character varying[]
);

create table savedlocation(
  id varchar(40) primary key,
  items character varying[]
)
