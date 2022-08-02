import { Application } from 'express';
import multer from 'multer';
import { ApplicationContext } from './context';

export function route(app: Application, ctx: ApplicationContext): void {
  const parser = multer();
  app.get('/health', ctx.health.check);
  app.patch('/log', ctx.log.config);
  app.patch('/middleware', ctx.middleware.config);

  app.post('/authenticate', parser.none(), ctx.authentication.authenticate);
  app.post('/signup/signup', ctx.signup.signup);
  app.post('/signup/verify/:userId/:code', ctx.signup.verify);
  app.get('/signup/verify/:userId/:code', ctx.signup.verify);

  app.get('/password/forgot/:contact', ctx.password.forgot);
  app.post('/password/forgot', ctx.password.forgot);
  app.post('/password/reset', ctx.password.reset);
  app.post('/password/change', ctx.password.change);
  app.put('/password/change', ctx.password.change);

  app.get('/my-profile/:id', ctx.myprofile.getMyProfile);
  app.get('/my-profile/:id/settings', ctx.myprofile.getMySettings);
  app.get(
    '/my-profile/:id/fetchImageGalleryUploaded',
    ctx.myprofile.getGallery
  );
  app.patch('/my-profile/:id', ctx.myprofile.saveMyProfile);
  app.patch('/my-profile/:id/settings', ctx.myprofile.saveMySettings);
  app.post(
    '/my-profile/:id/cover',
    parser.array('files'),
    ctx.myprofile.uploadCover
  );
  app.post(
    '/my-profile/:id/upload',
    parser.array('files'),
    ctx.myprofile.uploadImage
  );
  app.post(
    '/my-profile/:id/gallery',
    parser.single('file'),
    ctx.myprofile.uploadGallery
  );
  app.patch('/my-profile/:id/gallery', ctx.myprofile.updateGallery);
  app.delete('/my-profile/:id/gallery', ctx.myprofile.deleteGalleryFile);
  app.post(
    '/my-profile/:id/external-resource',
    ctx.myprofile.addExternalResource
  );
  app.delete(
    '/my-profile/:id/external-resource',
    ctx.myprofile.deleteExternalResource
  );

  app.get('/skills', ctx.skill.query);
  app.get('/interests', ctx.interest.query);
  app.get('/looking-for', ctx.lookingFor.query);
  app.get('/companies', ctx.companyQuery.query);
  app.get('/educations', ctx.educationQuery.query);
  app.get('/brands/', ctx.brand.query);

  app.post('/users/search', ctx.user.search);
  app.get('/users/search', ctx.user.search);
  app.get('/users/:id', ctx.user.load);
  

  app.get('/appreciation/search', ctx.appreciation.search);
  app.post('/appreciation/search', ctx.appreciation.search);
  app.post('/appreciation/reply/search', ctx.comment.search);
  app.post('/appreciation', ctx.appreciation.create);
  app.put('/appreciation/:id/:author', ctx.appreciation.update);
  app.delete('/appreciation/:id/:author', ctx.appreciation.delete);
  app.post('/appreciation/:id/:author', ctx.appreciation.load);
  app.put('/appreciation/:id/:author', ctx.appreciation.update);
  app.patch('/appreciation/:id/:author', ctx.appreciation.patch);
  app.get('/appreciation/reply/:id/:author', ctx.appreciation.getReplys);
  app.post('/appreciation/reply/:id/:author/:userid', ctx.appreciation.reply);
  app.delete('/appreciation/reply/:id/:author/:userid', ctx.appreciation.removeReply);
  app.put('/appreciation/reply/:id/:author/:userid', ctx.appreciation.updateReply);
  // appreciation reply
  // app.get('/appreciation-reply', ctx.appreciationReply.search);
  // app.post('/appreciation-reply/search', ctx.appreciationReply.search);
  // app.get('/appreciation-reply/search', ctx.appreciationReply.search);
  // app.get('/appreciation-reply/:id', ctx.appreciationReply.load);
  // app.post('/appreciation-reply', ctx.appreciationReply.insert);
  // app.put('/appreciation-reply/:id', ctx.appreciationReply.update);
  // app.patch('/appreciation-reply/:id', ctx.appreciationReply.patch);
  // app.delete('/appreciation-reply/:id', ctx.appreciationReply.delete);
  // app.post(
  //   '/appreciation-reply/useful',
  //   ctx.appreciationReply.usefulAppreciation
  // );

  app.post('/articles/search', ctx.article.search);
  app.get('/articles/search', ctx.article.search);
  app.get('/articles/:id', ctx.article.load);

  app.post('/my-articles/search', ctx.myarticles.search);
  app.get('/my-articles/search', ctx.myarticles.search);
  app.post('/my-articles', ctx.myarticles.create);
  app.get('/my-articles/:id', ctx.myarticles.load);
  app.put('/my-articles/:id', ctx.myarticles.update);
  app.patch('/my-articles/:id', ctx.myarticles.patch);
  app.delete('/my-articles/:id', ctx.myarticles.delete);
  app.delete('/my-articles/userId', ctx.myarticles.delete);


  app.get('/cinema/search', ctx.cinema.search);
  app.post('/cinema/search', ctx.cinema.search);
  app.get('/cinema', ctx.cinema.search);
  app.post('/cinema', ctx.cinema.create);

  app.get('/cinema/:id', ctx.cinema.load);
  app.put('/cinema/:id', ctx.cinema.update);
  app.patch('/cinema/:id', ctx.cinema.patch);
  app.delete('/cinema/:id', ctx.cinema.delete);

  app.get('/cinema/rates/search/:id/:author', ctx.cinemaRate.search);
  app.post('/cinema/rates/search/:id/:author', ctx.cinemaRate.search);
  app.get('/cinema/rates/comment/search', ctx.cinemaComment.search);
  app.post('/cinema/rates/comment/search', ctx.cinemaComment.search);
  app.post('/cinema/rates/:id/:author', ctx.cinemaRate.rate);
  app.get('/cinema/rates/:id/:author', ctx.cinemaRate.load);
  app.post('/cinema/rates/useful/:id/:author/:userId', ctx.cinemaRate.setUseful);
  app.delete('/cinema/rates/useful/:id/:author/:userId', ctx.cinemaRate.removeUseful);
  app.post('/cinema/rates/comment/:id/:author/:userId', ctx.cinemaRate.comment);
  app.delete('/cinema/rates/comment/:commentId/:author', ctx.cinemaRate.removeComment);
  app.put('/cinema/rates/comment/:commentId/:id/:author/:userId', ctx.cinemaRate.updateComment);
  

  app.get('/films/categories/search', ctx.filmCategory.search);
  app.post('/films/categories/', ctx.filmCategory.create);
  app.get('/films/categories/:id', ctx.filmCategory.load);
  app.put('/films/categories/:id', ctx.filmCategory.update);
  app.patch('/films/categories/:id', ctx.filmCategory.patch);
  app.delete('/films/categories/:id', ctx.filmCategory.delete);

  app.get('/films', ctx.film.search);
  app.post('/films', ctx.film.create);
  app.get('/films/search', ctx.film.search);
  app.post('/films/search', ctx.film.search);
  app.get('/films/:id', ctx.film.load);
  app.put('/films/:id', ctx.film.update);
  app.patch('/films/:id', ctx.film.patch);
  app.delete('/films/:id', ctx.film.delete);

  app.get('/films/rates/search', ctx.filmRate.search);
  app.post('/films/rates/search', ctx.filmRate.search);
  app.get('/films/rates/comment/search', ctx.filmComment.search);
  app.post('/films/rates/comment/search', ctx.filmComment.search);
  app.post('/films/rates/:id/:author', ctx.filmRate.rate);
  app.post('/films/rates/useful/:id/:author/:userId', ctx.filmRate.setUseful);
  app.delete('/films/rates/useful/:id/:author/:userId', ctx.filmRate.removeUseful);
  app.post('/films/rates/comment/:id/:author/:userId', ctx.filmRate.comment);
  app.put('/films/rates/comment/:commentId/:id/:author/:userId', ctx.filmRate.updateComment);
  app.delete('/films/rates/comment/:commentId/:author', ctx.filmRate.removeComment);


  app.get('/items/categories/search', ctx.itemCategory.search);
  app.get('/items/categories/:id', ctx.itemCategory.load);
  app.post('/items/categories/', ctx.itemCategory.create);
  app.put('/items/categories/:id', ctx.itemCategory.update);
  app.patch('/items/categories/:id', ctx.itemCategory.patch);
  app.delete('/items/categories/:id', ctx.itemCategory.delete);

  app.post('/items/search', ctx.items.search);
  app.get('/items/search', ctx.items.search);
  app.get('/items/:id', ctx.items.load);

  app.post('/my-items/search', ctx.myitems.search);
  app.get('/my-items/search', ctx.myitems.search);
  app.get('/my-items/:id', ctx.myitems.load);
  app.get(
    '/my-items/:id/fetchImageGalleryUploaded',
    ctx.myitemsUpload.getGallery
  );
  app.post('/my-items', ctx.myitems.create);
  app.put('/my-items/:id', ctx.myitems.update);
  app.patch('/my-items/:id', ctx.myitems.patch);
  app.delete('/my-items/:id', ctx.myitems.delete);
  app.post(
    '/my-items/:id/upload',
    parser.array('files'),
    ctx.myitemsUpload.uploadImage
  );
  app.post(
    '/my-items/:id/gallery',
    parser.single('file'),
    ctx.myitemsUpload.uploadGallery
  );
  app.patch('/my-items/:id/gallery', ctx.myitemsUpload.updateGallery);
  app.delete('/my-items/:id/gallery', ctx.myitemsUpload.deleteGalleryFile);

  app.get('/items/response/search', ctx.response.search);
  app.post('/items/response/search', ctx.response.search);
  app.get('/items/response/comment/search', ctx.response.getComments);
  app.post('/items/response/comment/search', ctx.response.getComments);
  app.post('/items/response', ctx.response.response);
  app.put('/items/response/:id/:author', ctx.response.updateResponse);
  app.get('/items/response/:id/:author', ctx.response.load);
  app.post('/items/response/useful/:id/:author/:userid', ctx.response.setUseful);
  app.delete('/items/response/useful/:id/:author/:userid', ctx.response.removeUseful);
  app.post('/items/response/comment/:id/:author/:userid', ctx.response.comment);
  app.put('/items/response/comment/:commentid/:id/:author/:userid', ctx.response.updateComment);
  app.delete('/items/response/comment/:commentid/:author', ctx.response.removeComment);

  app.post('/comment/search', ctx.comment.search);
  app.get('/comment/search', ctx.comment.search);
  app.get('/comment/:id', ctx.comment.load);
  app.post('/comment', ctx.comment.create);
  app.put('/comment/:id', ctx.comment.update);
  app.patch('/comment/:id', ctx.comment.patch);
  app.delete('/comment/:id', ctx.comment.delete);


  app.post("/locations/search", ctx.location.search);
  app.get("/locations/search", ctx.location.search);
  app.get("/locations/:id", ctx.location.load);

  app.get('/locations/rates/search', ctx.locationRate.search);
  app.post('/locations/rates/:id/:author', ctx.locationRate.rate);
  app.get('/locations/rates/search/:id/:author', ctx.locationRate.search);
  app.post('/locations/rates/search/:id/:author', ctx.locationRate.search);
  app.get('/locations/rates/comment/search', ctx.locationComment.search);
  app.post('/locations/rates/comment/search', ctx.locationComment.search);
  app.get('/locations/rates/:id/:author', ctx.locationRate.load);
  app.post('/locations/rates/useful/:id/:author/:userId', ctx.locationRate.setUseful);
  app.delete('/locations/rates/useful/:id/:author/:userId', ctx.locationRate.removeUseful);
  app.post('/locations/rates/comment/:id/:author/:userId', ctx.locationRate.comment);
  app.delete('/locations/rates/comment/:commentId/:author', ctx.locationRate.removeComment);
  app.put('/locations/rates/comment/:commentId/:id/:author/:userId', ctx.locationRate.updateComment);


  app.post('/companies/search', ctx.company.search);
  app.get('/companies/search', ctx.company.search);
  app.get('/companies/:id', ctx.company.load);
  app.post('/companies/', ctx.company.create);
  app.put('/companies/:id', ctx.company.update);
  app.patch('/companies/:id', ctx.company.patch);
  app.delete('/companies/:id', ctx.company.delete);

  app.get('/companies/categories/search', ctx.companyCategory.search);
  app.get('/companies/categories/:id', ctx.companyCategory.load);
  app.post('/companies/categories/', ctx.companyCategory.create);
  app.put('/companies/categories/:id', ctx.companyCategory.update);
  app.patch('/companies/categories/:id', ctx.companyCategory.patch);
  app.delete('/companies/categories/:id', ctx.companyCategory.delete);

  app.post('/companies/rates', ctx.companyRate.rate);
  app.get('/companies/rates/search', ctx.companyRate.search);
  app.post('/companies/rates/search', ctx.companyRate.search);
  app.get('/companies/rates/comment/search', ctx.companyComment.search);
  app.post('/companies/rates/comment/search', ctx.companyComment.search);
  app.get('/companies/rates/:id/:author', ctx.companyRate.load);
  app.post('/companies/rates/useful/:id/:author/:userId', ctx.companyRate.setUseful);
  app.delete('/companies/rates/useful/:id/:author/:userId', ctx.companyRate.removeUseful);
  app.post('/companies/rates/comment/:id/:author/:userId', ctx.companyRate.comment);
  app.delete('/companies/rates/comment/:commentId/:author', ctx.companyRate.removeComment);
  app.put('/companies/rates/comment/:commentId/:id/:author/:userId', ctx.companyRate.updateComment);
}
