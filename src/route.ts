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
  app.get('/user-companies', ctx.companyQuery.query);
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

  app.get('/cinema/rates/search', ctx.cinemaReaction.search);
  app.post('/cinema/rates/search', ctx.cinemaReaction.search);
  app.get('/cinema/rates/comment/search', ctx.cinemaComment.search);
  app.post('/cinema/rates/comment/search', ctx.cinemaComment.search);
  app.post('/cinema/rates/:id/:author', ctx.cinemaRate.rate);
  app.get('/cinema/rates/:id/:author', ctx.cinemaReaction.load);
  app.post('/cinema/rates/useful/:id/:author/:userId', ctx.cinemaReaction.setUseful);
  app.delete('/cinema/rates/useful/:id/:author/:userId', ctx.cinemaReaction.removeUseful);
  app.post('/cinema/rates/comment/:id/:author/:userId', ctx.cinemaReaction.comment);
  app.delete('/cinema/rates/comment/:commentId/:author', ctx.cinemaReaction.removeComment);
  app.put('/cinema/rates/comment/:commentId/:id/:author/:userId', ctx.cinemaReaction.updateComment);
  

  app.get('/films/categories/search', ctx.filmCategory.search);
  app.post('/films/categories/', ctx.filmCategory.create);
  app.get('/films/categories/:id', ctx.filmCategory.load);
  app.put('/films/categories/:id', ctx.filmCategory.update);
  app.patch('/films/categories/:id', ctx.filmCategory.patch);
  app.delete('/films/categories/:id', ctx.filmCategory.delete);

  // app.post('/films', ctx.film.create);
  app.get('/films/search', ctx.film.search);
  app.post('/films/search', ctx.film.search);
  app.get('/films/:id', ctx.film.load);

  // app.put('/films/:id', ctx.film.update);
  // app.patch('/films/:id', ctx.film.patch);
  // app.delete('/films/:id', ctx.film.delete);


  app.get('/films/:id/rates/search', ctx.filmReaction.search);
  app.post('/films/:id/rates/search', ctx.filmReaction.search);
  // app.get('/films/:id/rates/:author', ctx.filmReaction.load);
  app.post('/films/:id/rates/:author', ctx.filmRate.rate);
  app.post('/films/:id/rates/:author/useful/:userId', ctx.filmReaction.setUseful);
  app.delete('/films/:id/rates/:author/useful/:userId', ctx.filmReaction.removeUseful);
  // app.get('/films/:id/rates/comment/search', ctx.filmComment.search);
  app.get('/films/:id/rates/:author/comment', ctx.filmReaction.getComments);
  app.post('/films/:id/rates/:author/comment/:userId', ctx.filmReaction.comment);
  app.put('/films/:id/rates/:author/comment/:userId/:commentId', ctx.filmReaction.updateComment);
  app.delete('/films/:id/rates/:author/comment/:commentId', ctx.filmReaction.removeComment);


  app.get('/items/categories/search', ctx.itemCategory.search);
  app.get('/items/categories/:id', ctx.itemCategory.load);
  app.post('/items/categories/', ctx.itemCategory.create);
  app.put('/items/categories/:id', ctx.itemCategory.update);
  app.patch('/items/categories/:id', ctx.itemCategory.patch);
  app.delete('/items/categories/:id', ctx.itemCategory.delete);

  app.post('/items/search', ctx.items.search);
  app.get('/items/search', ctx.items.search);
  app.get('/items/:id', ctx.items.load);

  app.get('/items/:id/response/search', ctx.itemReaction.search);
  app.post('/items/:id/response/search', ctx.itemReaction.search);
  // app.get('/items/:id/response/:author', ctx.itemReaction.load);
  app.post('/items/:id/response/:author', ctx.itemResponse.reply);
  app.put('/items/:id/response/:author', ctx.itemResponse.updateReply);
  app.post('/items/:id/response/:author/useful/:userId', ctx.itemReaction.setUseful);
  app.delete('/items/:id/response/:author/useful/:userId', ctx.itemReaction.removeUseful);
  app.get('/items/:id/response/:author/comment', ctx.itemReaction.getComments);
  app.post('/items/:id/response/:author/comment/:userId', ctx.itemReaction.comment);
  app.put('/items/:id/response/:author/comment/:userId/:commentId', ctx.itemReaction.updateComment);
  app.delete('/items/:id/response/:author/comment/:commentId', ctx.itemReaction.removeComment);

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


  app.post("/backoffice/locations/search", ctx.backofficeLocation.search);
  app.get("/backoffice/locations/search", ctx.backofficeLocation.search);
  app.get("/backoffice/locations/:id", ctx.backofficeLocation.load);
  app.post('/backoffice/locations', ctx.backofficeLocation.create);
  app.put('/backoffice/locations/:id', ctx.backofficeLocation.update);
  app.patch('/backoffice/locations/:id', ctx.backofficeLocation.patch);
  app.delete('/backoffice/locations/:id', ctx.backofficeLocation.delete);

  

  app.get('/locations/rates/search', ctx.locationReaction.search);
  app.get('/locations/rates/search/:id/:author', ctx.locationReaction.search);
  app.post('/locations/rates/search/:id/:author', ctx.locationReaction.search);
  app.get('/locations/rates/comment/search', ctx.locationComment.search);
  app.post('/locations/rates/comment/search', ctx.locationComment.search);
  app.post('/locations/rates/:id/:author', ctx.locationRate.rate);
  app.get('/locations/rates/:id/:author', ctx.locationReaction.load);
  app.post('/locations/rates/useful/:id/:author/:userId', ctx.locationReaction.setUseful);
  app.delete('/locations/rates/useful/:id/:author/:userId', ctx.locationReaction.removeUseful);
  app.post('/locations/rates/comment/:id/:author/:userId', ctx.locationReaction.comment);
  app.delete('/locations/rates/comment/:commentId/:author', ctx.locationReaction.removeComment);
  app.put('/locations/rates/comment/:commentId/:id/:author/:userId', ctx.locationReaction.updateComment);


  app.post('/companies/search', ctx.company.search);
  app.get('/companies/search', ctx.company.search);
  app.get('/companies/:id', ctx.company.load);
  


  app.post('/backoffice/companies/search', ctx.backofficeCompany.search);
  app.get('/backoffice/companies/search', ctx.backofficeCompany.search);
  app.get('/backoffice/companies/:id', ctx.backofficeCompany.load);
  app.post('/backoffice/companies/', ctx.backofficeCompany.create);
  app.put('/backoffice/companies/:id', ctx.backofficeCompany.update);
  app.patch('/backoffice/companies/:id', ctx.backofficeCompany.patch);
  app.delete('/backoffice/companies/:id', ctx.backofficeCompany.delete);

  app.get('/companies/categories/search', ctx.companyCategory.search);
  app.get('/companies/categories/:id', ctx.companyCategory.load);
  app.post('/companies/categories/', ctx.companyCategory.create);
  app.put('/companies/categories/:id', ctx.companyCategory.update);
  app.patch('/companies/categories/:id', ctx.companyCategory.patch);
  app.delete('/companies/categories/:id', ctx.companyCategory.delete);

  app.post('/companies/rates', ctx.companyRate.rate);
  app.get('/companies/rates/search', ctx.companyReaction.search);
  app.post('/companies/rates/search', ctx.companyReaction.search);
  app.get('/companies/rates/comment/search', ctx.companyComment.search);
  app.post('/companies/rates/comment/search', ctx.companyComment.search);
  app.get('/companies/rates/:id/:author', ctx.companyReaction.load);
  app.post('/companies/rates/useful/:id/:author/:userId', ctx.companyReaction.setUseful);
  app.delete('/companies/rates/useful/:id/:author/:userId', ctx.companyReaction.removeUseful);
  app.post('/companies/rates/comment/:id/:author/:userId', ctx.companyReaction.comment);
  app.delete('/companies/rates/comment/:commentId/:author', ctx.companyReaction.removeComment);
  app.put('/companies/rates/comment/:commentId/:id/:author/:userId', ctx.companyReaction.updateComment);


  app.get('/item/save-item/:id/:itemId', ctx.items.savedItems);
  app.get('/item/save-item/:id/', ctx.items.getSavedItems);

  app.get('/jobs/search', ctx.jobs.search);
  app.post('/jobs/search', ctx.jobs.search);
  app.get('/jobs/:id', ctx.jobs.load);
  // app.post('/jobs/', ctx.jobs.create);
  // app.put('/jobs/:id', ctx.jobs.update);
  // app.patch('/jobs/:id', ctx.jobs.patch);
  // app.delete('/jobs/:id', ctx.jobs.delete);

  app.post('/company/rate-criteria/search', ctx.rateCriteria.search);
  app.post('/company/rate-criteria/search/:id/:author', ctx.rateCriteria.search);
  app.post('/company/rate-criteria/:id/:author', ctx.rateCriteria.load);
  // app.post('/company/rate-criteria/rate/:id/:author', ctx.rateCriteria.rate);

  app.post('/backoffice/film', ctx.backOfficeFilm.create);
  app.get('/backoffice/film/search', ctx.backOfficeFilm.search);
  app.post('/backoffice/film/search', ctx.backOfficeFilm.search);
  app.get('/backoffice/film/:id', ctx.backOfficeFilm.load);
  app.put('/backoffice/film/:id', ctx.backOfficeFilm.update);
  app.patch('/backoffice/film/:id', ctx.backOfficeFilm.patch);
  app.delete('/backoffice/film/:id', ctx.backOfficeFilm.delete);



  app.get('/backoffice/job/search', ctx.jobs.search);
  app.post('/backoffice/job/search', ctx.jobs.search);
  app.get('/backoffice/job/:id', ctx.jobs.load);
  app.post('/backoffice/job/', ctx.jobs.create);
  app.put('/backoffice/job/:id', ctx.jobs.update);
  app.patch('/backoffice/job/:id', ctx.jobs.patch);
  app.delete('/backoffice/job/:id', ctx.jobs.delete);
}
