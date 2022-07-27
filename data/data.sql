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

insert into articles(id, title, name, description, type, content, authorId, tags) values ('01', 'This is title 01', 'This is name 01', 'This is description 01', 'type 01', '<h2 class=\"sapo\" style=\"margin-right: 0px; margin-bottom: 12px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 22px; font-family: NotoSans-Bold; vertical-align: baseline; color: rgb(34, 34, 34); letter-spacing: -0.2px; background-color: rgba(255, 255, 255, 0.95);\">TTO - Cần nhìn lại toàn bộ hạ tầng ở các đô thị, dự báo được tính cực đoan của khí hậu thời tiết, xây dựng hệ thống huyết mạch trong việc thu nước mưa, thoát nước mưa, xử lý nước thải phải đồng bộ.</h2><div class=\"relate-container\" style=\"margin-bottom: 15px; padding-top: 10px; padding-bottom: 10px; border: 0px; font-variant-numeric: inherit; font-variant-east-asian: inherit; font-stretch: inherit; font-size: medium; line-height: inherit; font-family: Arial, Helvetica, sans-serif; vertical-align: baseline; background-color: rgb(246, 246, 246); letter-spacing: normal;\"><ul style=\"margin-right: 0px; margin-bottom: 0px; margin-left: 28px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; list-style-position: initial; list-style-image: initial;\"><li style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\"><a data-zone=\"0\" data-type=\"1\" data-newstype=\"30\" data-id=\"20220316165612959\" title=\"Bộ trưởng Trần Hồng Hà: "Lướt sóng đất đai nay mua mai bán, phải đánh thuế cao hơn"\" data-objecttype=\"1\" data-title-encode=\"QiVFMSVCQiU5OSUyMHRyJUM2JUIwJUUxJUJCJTlGbmclMjBUciVFMSVCQSVBN24lMjBIJUUxJUJCJTkzbmclMjBIJUMzJUEwJTNBJTIwJTI3TCVDNiVCMCVFMSVCQiU5QnQlMjBzJUMzJUIzbmclMjAlQzQlOTElRTElQkElQTV0JTIwJUM0JTkxYWklMjBuYXklMjBtdWElMjBtYWklMjBiJUMzJUExbiUyQyUyMHBoJUUxJUJBJUEzaSUyMCVDNCU5MSVDMyVBMW5oJTIwdGh1JUUxJUJBJUJGJTIwY2FvJTIwaCVDNiVBMW4lMjc=\" href=\"https://tuoitre.vn/bo-truong-tran-hong-ha-luot-song-dat-dai-nay-mua-mai-ban-phai-danh-thue-cao-hon-20220316165612959.htm\" style=\"margin: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 2.08; font-family: Roboto-Bold; vertical-align: baseline; display: block; color: rgb(34, 34, 34);\">Bộ trưởng Trần Hồng Hà: "Lướt sóng đất đai nay mua mai bán, phải đánh thuế cao hơn"</a></li><li style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\"><a data-zone=\"0\" data-type=\"1\" data-newstype=\"29\" data-id=\"2022052916162767\" title=\"Đường phố Hà Nội ngập sâu sau cơn mưa lớn\" data-objecttype=\"1\" data-title-encode=\"JUM0JTkwJUM2JUIwJUUxJUJCJTlEbmclMjBwaCVFMSVCQiU5MSUyMEglQzMlQTAlMjBOJUUxJUJCJTk5aSUyMG5nJUUxJUJBJUFEcCUyMHMlQzMlQTJ1JTIwc2F1JTIwYyVDNiVBMW4lMjBtJUM2JUIwYSUyMGwlRTElQkIlOUJu\" href=\"https://tuoitre.vn/duong-pho-ha-noi-ngap-sau-sau-con-mua-lon-2022052916162767.htm\" style=\"margin: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 2.08; font-family: Roboto-Bold; vertical-align: baseline; display: block; color: rgb(34, 34, 34);\">Đường phố Hà Nội ngập sâu sau cơn mưa lớn</a></li><li style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\"><a data-zone=\"0\" data-type=\"1\" data-newstype=\"29\" data-id=\"20220524131820668\" title=\"Mưa ngớt, bà con ngoại thành Hà Nội vẫn lội bì bõm trong nước ngập\" data-objecttype=\"1\" data-title-encode=\"TSVDNiVCMGElMjBuZyVFMSVCQiU5QnQlMkMlMjBiJUMzJUEwJTIwY29uJTIwbmdvJUUxJUJBJUExaSUyMHRoJUMzJUEwbmglMjBIJUMzJUEwJTIwTiVFMSVCQiU5OWklMjB2JUUxJUJBJUFCbiUyMGwlRTElQkIlOTlpJTIwYiVDMyVBQyUyMGIlQzMlQjVtJTIwdHJvbmclMjBuJUM2JUIwJUUxJUJCJTlCYyUyMG5nJUUxJUJBJUFEcA==\" href=\"https://tuoitre.vn/mua-ngot-ba-con-ngoai-thanh-ha-noi-van-loi-bi-bom-trong-nuoc-ngap-20220524131820668.htm\" style=\"margin: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 2.08; font-family: Roboto-Bold; vertical-align: baseline; display: block; color: rgb(34, 34, 34);\">Mưa ngớt, bà con ngoại thành Hà Nội vẫn lội bì bõm trong nước ngập</a></li></ul></div><div class=\"content fck\" id=\"main-detail-body\" style=\"border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: medium; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; color: rgb(34, 34, 34); letter-spacing: -0.2px; background-color: rgba(255, 255, 255, 0.95);\"><div class=\"VCSortableInPreviewMode active\" type=\"Photo\" style=\"margin: 1.3em auto 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 11px; line-height: 1.45; vertical-align: baseline; text-align: center; display: table; position: relative; z-index: 2;\"><div style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\"><a href=\"https://cdn.tuoitre.vn/2022/5/30/2848798734034629116734795425013104285785636n-16538832846551058100556.jpg\" data-fancybox-group=\"img-lightbox\" title=\"Ông Trần Hồng Hà cho rằng cần có quy hoạch giao thông đô thị đồng bộ với không gian ngầm để ứng phó với biến đổi khí hậu - Ảnh: Đ.X.\" target=\"_blank\" class=\"detail-img-lightbox\" style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; display: initial; cursor: zoom-in; color: rgb(237, 27, 47); letter-spacing: -0.2px;\"><img src=\"https://cdn.tuoitre.vn/thumb_w/586/2022/5/30/2848798734034629116734795425013104285785636n-16538832846551058100556.jpg\" id=\"img_b91de7b0-dfcc-11ec-89ce-b5d264a03ea0\" w=\"2048\" h=\"1365\" alt=\"Hà Nội ngập lụt, Bộ trưởng Trần Hồng Hà khuyến nghị biến sân vận động, cánh đồng thành bể chứa - Ảnh 1.\" title=\"Hà Nội ngập lụt, Bộ trưởng Trần Hồng Hà khuyến nghị biến sân vận động, cánh đồng thành bể chứa - Ảnh 1.\" rel=\"lightbox\" photoid=\"b91de7b0-dfcc-11ec-89ce-b5d264a03ea0\" type=\"photo\" data-original=\"https://cdn.tuoitre.vn/2022/5/30/2848798734034629116734795425013104285785636n-16538832846551058100556.jpg\" width=\"\" height=\"\" class=\"lightbox-content\" style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; max-width: 100%; color: transparent; width: 586px;\"></a></div><div class=\"PhotoCMS_Caption ck_legend caption\" style=\"margin: -5px 0px 24px; padding: 5px 8px; border: 0px; font: inherit; vertical-align: baseline; background: rgb(233, 233, 233); text-align: left;\"><p data-placeholder=\"[nhập chú thích]\" class=\"\" style=\"margin-right: 0px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 12px; line-height: 1.45; vertical-align: baseline; letter-spacing: -0.2px; opacity: 0.7; margin-bottom: 0px !important;\">Ông Trần Hồng Hà cho rằng cần có quy hoạch giao thông đô thị đồng bộ với không gian ngầm để ứng phó với biến đổi khí hậu - Ảnh: Đ.X.</p></div></div><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Trao đổi với báo chí bên hành lang Quốc hội sáng 30-5, Bộ trưởng Bộ Tài nguyên và môi trường Trần Hồng Hà cho rằng trước diễn biến thời tiết bất thường gây ra mưa lớn như những ngày qua,&nbsp;<span style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\">không chỉ ở Việt Nam mà tại các nước có hạ tầng phát triển như Mỹ, châu Âu, khó có hạ tầng nào chịu đựng được.</span></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">\"Chúng ta cần thấy rằng vấn đề dị thường của thời tiết như mưa lớn cực đoan với việc đầu tư hạ tầng thiếu đồng bộ, thiếu tầm nhìn, đều mang đến những nguy cơ như nhau\", ông Hà cảnh báo.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\"><b style=\"margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; letter-spacing: -0.2px;\"><span style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\">* Thực tế ở các thành phố lớn của ta hầu hết là các nhà cao tầng, đó có phải là nguyên nhân dẫn đến tình trạng sau một cơn mưa lớn Hà Nội biến thành sông?</span><br></b></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Hệ thống nhà cao tầng và việc ngập lụt tại thành phố chưa chắc đã có mối liên hệ với nhau. Tất nhiên là có ảnh hưởng. Hạ tầng tiêu thoát nước phải tính toán trữ được cả lượng nước con người sử dụng, cũng như lượng nước mưa trong thời tiết cực đoan. Tính toán đồng bộ cơ sở hạ tầng, số lượng người dân, nước thải cộng với nước mưa.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\"><b style=\"margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; letter-spacing: -0.2px;\">* Theo ông, có phải năng lực dự báo còn hạn chế nên không đánh giá hết được những nguy cơ ngập úng ở các thành phố khi có diễn biến thời tiết bất lợi?</b></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Tôi nghĩ rằng dự báo có thể làm được. Khi dự báo nói đến lưu lượng mưa trong một đơn vị thời gian, tính toán được trên một mét vuông lượng mưa thế nào. Vấn đề là chúng ta cần làm tiếp bài toán mô hình, khả năng của hệ thống tiêu thoát nước.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Hiện công tác dự báo cũng đã thực hiện được điều đó. Tất nhiên để dự báo trong thời gian ngắn, chính xác là điều không dễ. Đặc biệt, bài toán đặt ra là phải dự báo trong điều kiện thời tiết cực đoan, dù độ chính xác còn khác nhau.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\"><b style=\"margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; letter-spacing: -0.2px;\">* Ông có cho rằng Hà Nội nên có dự án chống ngập giống TP.HCM?</b></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Trước hết, Hà Nội cần tăng cường công tác dự báo. Hà Nội cũng cần có dự án tổng thể, trong đó đánh giá một cách căn cơ và đưa ra những số liệu lịch sử cũng như số liệu về các hiện tượng cực đoan của thời tiết với lượng mưa như thế này.</p><div id=\"zone-jnvk0c1v\" style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\"><div id=\"share-jnvk0cro\" style=\"margin: 0px auto; padding: 0px; border: 0px; font: inherit; vertical-align: baseline; max-width: 450px;\"></div></div><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Hà Nội cũng cần nghiên cứu một cách kỹ càng, cách tiếp cận khi thiết kế đô thị là hướng tới đô thị thông minh, chống chịu được các hiện tượng thời tiết cực đoan.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Còn bài toán mang tính ứng phó, tức khi đã ngập rồi thì phải sử dụng các máy bơm để thoát nước, là phương án trù bị thôi. Khi xây dựng đô thị, phải tính toán hệ thống tiêu thoát nước, đảm đương được huyết mạch của đô thị, để trở thành đô thị có khả năng chống chịu một cách thông minh, đảm bảo được tính bền vững khi thời tiết cực đoan.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Do vậy, cần có một dự án tiếp cận một cách tổng thể, xuất phát từ dự báo, quy hoạch để có một hạ tầng có thể chống chịu, thích ứng, phù hợp được. Thêm vào đó là các giải pháp kỹ thuật, sử dụng các giải pháp mang tính chủ động.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\"><b style=\"margin: 0px; padding: 0px; border: 0px; font-style: inherit; font-variant: inherit; font-weight: bold; font-stretch: inherit; font-size: inherit; line-height: inherit; font-family: inherit; vertical-align: baseline; letter-spacing: -0.2px;\">* Ông có thể nói cụ thể hơn về mô hình xây dựng đô thị thông minh bền vững gắn với thích ứng biến đổi khí hậu?</b></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Phải nhìn lại toàn bộ hạ tầng ở các đô thị. Trước hết phải dự báo được tính cực đoan của khí hậu thời tiết, xây dựng hệ thống huyết mạch trong việc&nbsp;<span style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\">thu nước mưa, thoát nước mưa, xử lý nước thải phải đồng bộ.</span></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\"><span style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\">Trong thiết kế phải tính toán được độ cao của các khu vực và khi thiết kế hệ thống thoát nước ngầm của đô thị cần có tầm nhìn để khu vực đó tự nhiên thoát được nước. Khu vực không tự thoát được nước thì phải sử dụng máy móc thiết bị để thoát nước.</span></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\"><span style=\"margin: 0px; padding: 0px; border: 0px; font: inherit; vertical-align: baseline;\">Trong trường hợp thời tiết cực đoan hơn nữa thì phải có phương án xây dựng hệ thống để trữ nước. Như Nhật Bản có khu vực ngầm được bố trí, gọi là hầm chứa lớn ở dưới, vừa giữ lượng nước, vừa dự trữ nước để khi hạn hán thì sử dụng tưới cây.</span><br></p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Hoặc tại các trường học, sân vận động, cánh đồng, nếu có thể điều chỉnh van trong hệ thống để dẫn nước vào những nơi này, trở thành nơi chứa nước tạm thời để tránh ngập cho những nơi xung yếu.</p><p style=\"margin-right: 0px; margin-bottom: 24px; margin-left: 0px; padding: 0px; border: 0px; font-variant-numeric: normal; font-variant-east-asian: normal; font-stretch: normal; font-size: 16px; line-height: 1.44; font-family: NotoSans-Regular; vertical-align: baseline; letter-spacing: -0.2px;\">Thậm chí, như tôi đã nói, dưới đường giao thông cần xây dựng hệ thống các tầng chứa nước, thùng rất lớn để chứa nước. Đó là giải pháp mà các nước làm, tất nhiên là đắt đỏ, nhưng quan trọng là tầm nhìn, thiết kế và đầu tư hạ tầng và phải đồng bộ.</p></div>', '77c35c38c3554ea6906730dbcfeca0f2', '{tag01, tag02}');
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

create table categories(
  categoryid character varying(40) primary key,
  categoryname character varying(300) not null,
  status char(1) not null,
  createdby character varying(40),
  createdat timestamp,
  updatedby character varying(40),
  updatedat timestamp
);


insert into categories (categoryid,categoryname,status) VALUES ('action','action','A');
insert into categories (categoryid,categoryname,status) VALUES ('comedy','comedy','A');
insert into categories (categoryid,categoryname,status) VALUES ('camera','camera','A');
insert into categories (categoryid,categoryname,status) VALUES ('mobiphone','mobiphone','A');
insert into categories (categoryid,categoryname,status) VALUES ('technological','technological','A');
insert into categories (categoryid,categoryname,status) VALUES ('apple','apple','A');
insert into categories (categoryid,categoryname,status) VALUES ('laptop','laptop','A');

create table items
(
    id character varying(40) primary key,
    title character varying(120) not null,
    status char(1) not null,
	price numeric(16,2) not null,
	imageurl character varying(1500),
    brand character varying(120) not null,
	publishedat timestamp with time zone,
	expiredat timestamp with time zone,
    description character varying(1000),
    categories character varying[]
);

insert into items (id, title, status, price, imageurl, brand, publishedat, expiredat, description, categories) values ('01', 'Movie tickets', 'A', 100000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png', 'Disney', '2022-07-19', '2022-08-25', 'Thor movie ticket', '{comedy,action}');
insert into items (id, title, status, price, imageurl, brand, publishedat, expiredat, description, categories) values ('02', 'Iphone 13', 'A', 20000000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png', 'Apple', '2022-07-19', '2025-07-19', 'Iphone 13 from Apple', '{mobiphone,technological,apple}');
insert into items (id, title, status, price, imageurl, brand, publishedat, expiredat, description, categories) values ('03', 'Camera', 'A', 100000000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png','Samsung', '2022-07-19', '2025-07-19', 'Camera from Samsung', '{camera,technological}');
insert into items (id, title, status, price, imageurl, brand, publishedat, expiredat, description, categories) values ('04', 'Movie tickets', 'A', 100000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png','Disney', '2022-07-19', '2022-08-25', 'Minion mooive ticket', '{comedy,action}');
insert into items (id, title, status, price, imageurl, brand, publishedat, expiredat, description, categories) values ('05', 'Macbook', 'A', 25000000, 'https://lebaostore.com/wp-content/uploads/2022/02/iphone-13-pro-family-hero.png','Apple', '2022-07-19', '2025-07-19', 'Macbook from Apple', '{laptop,technological,apple}');

select * from items where categories && '{"apple"}';

create table brands(
  brand character varying(255) primary key
);

insert into brands (brand) VALUES('Sony');
insert into brands (brand) VALUES ('Samsung');
insert into brands (brand) VALUES ('Canon');
insert into brands (brand) VALUES ('Nikon');
insert into brands (brand) VALUES ('Olypus');
insert into brands (brand) VALUES ('Xiaomi');
insert into brands (brand) VALUES ('Apple');
insert into brands (brand) VALUES ('Disney');


create table companies
(
    id character varying(40) not null primary key,
    name character varying(120),
    description character varying(1000),
    size integer,
    status char(1) not null,
    establishedAt timestamp with time zone,
    categories character varying[]
);
insert into companies (id, name, description, size, status, establishedAt, categories) values ('id1','Softwave company', 'This is description', 500,'A', '2022-07-21','{Categories1, Categories2}');
insert into companies (id, name, description, size,status, establishedAt, categories) values ('id2','Softwave company', 'This is description', 500,'A', '2022-07-21','{Categories1, Categories2}');
insert into companies (id, name, description, size,status, establishedAt, categories) values ('id3','Softwave company', 'This is description', 500,'A', '2022-07-21','{Categories1, Categories2}');
insert into companies (id, name, description, size,status, establishedAt, categories) values ('id4','Softwave company', 'This is description', 500,'I', '2022-07-21','{Categories1, Categories2}');
insert into companies (id, name, description, size,status, establishedAt, categories) values ('id5','Softwave company', 'This is description', 500,'I', '2022-07-21','{Categories1, Categories2}');

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
