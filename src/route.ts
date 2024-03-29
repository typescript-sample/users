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
    ctx.myprofileUpload.getGallery
  );
  app.patch('/my-profile/:id', ctx.myprofile.saveMyProfile);
  app.patch('/my-profile/:id/settings', ctx.myprofile.saveMySettings);
  app.post(
    '/my-profile/:id/cover',
    parser.array('files'),
    ctx.myprofileUpload.uploadCover
  );
  app.post(
    '/my-profile/:id/upload',
    parser.array('files'),
    ctx.myprofileUpload.uploadImage
  );
  app.post(
    '/my-profile/:id/gallery',
    parser.single('files'),
    ctx.myprofileUpload.uploadGallery
  );
  app.patch('/my-profile/:id/gallery', ctx.myprofileUpload.updateGallery);
  app.delete('/my-profile/:id/gallery', ctx.myprofileUpload.deleteGalleryFile);
  app.post(
    '/my-profile/:id/external-resource',
    ctx.myprofileUpload.addExternalResource
  );
  app.delete(
    '/my-profile/:id/external-resource',
    ctx.myprofileUpload.deleteExternalResource
  );

  app.get('/skills', ctx.skill.query);
  app.get('/interests', ctx.interest.query);
  app.get('/looking-for', ctx.lookingFor.query);
  app.get('/user-companies', ctx.companyQuery.query);
  app.get('/educations', ctx.educationQuery.query);
  app.get('/brands/', ctx.brand.query);

  app.post('/users/search', ctx.user.search);
  app.get('/users/search', ctx.user.search);
  app.get('/users/company/:companyId', ctx.user.getUsersByCompany);
  app.get('/users/:id', ctx.user.load);

  app.get('/users/reaction/:id/:author/:reaction', ctx.authMiddleware.auth, ctx.reaction.react);
  app.delete('/users/unreaction/:id/:author/:reaction', ctx.authMiddleware.auth, ctx.reaction.unreact);
  app.get('/users/checkreaction/:id/:author', ctx.reaction.checkReaction);

  app.get('/users/follow/:id/:target', ctx.authMiddleware.auth, ctx.userFollow.follow);
  app.delete('/users/unfollow/:id/:target', ctx.authMiddleware.auth, ctx.userFollow.unfollow);
  app.get('/users/checkfollow/:id/:target', ctx.userFollow.checkFollow);
  app.get('/users/loadfollow/:id/', ctx.userInfo.load);

  app.post('/users/rates/comments', ctx.userComment.search);
  app.get('/users/rates/search', ctx.userReaction.search);
  app.post('/users/rates/search', ctx.userReaction.search);
  app.post('/users/rates/:id/:author', ctx.authMiddleware.auth, ctx.userRate.rate);
  app.post('/users/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.userReaction.setUseful);
  app.delete('/users/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.userReaction.removeUseful);
  app.get('/users/rates/:id/:author/comments', ctx.userReaction.getComments);
  app.post('/users/rates/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.userReaction.comment);
  app.put('/users/rates/:id/:author/comments/:userId/:commentId', ctx.authMiddleware.auth, ctx.userReaction.updateComment);
  app.delete('/users/rates/:id/:author/comments/:commentId', ctx.authMiddleware.auth, ctx.userReaction.removeComment);


  app.post('/appreciations/rates/comments', ctx.appreciationComment.search);
  app.get('/appreciations/rates/search', ctx.appreciationReaction.search);
  app.post('/appreciations/rates/search', ctx.appreciationReaction.search);
  app.post('/appreciations/rates/:id/:author', ctx.authMiddleware.auth, ctx.appreciation.reply);
  // app.post('/appreciations/rates/search/useful')
  app.post('/appreciations/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.appreciationReaction.setUseful);
  app.delete('/appreciations/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.appreciationReaction.removeUseful);
  app.get('/appreciations/rates/:id/:author/comments', ctx.appreciationReaction.getComments);
  app.post('/appreciations/rates/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.appreciationReaction.comment);
  app.put('/appreciations/rates/:id/:author/comments/:userId/:commentId', ctx.authMiddleware.auth, ctx.appreciationReaction.updateComment);
  // app.put('/appreciation/rates/:id/:author/comments/:userId/:commentId', ctx.appreciationReaction.updateComment);
  app.delete('/appreciations/rates/:id/:author/comments/:commentId', ctx.authMiddleware.auth, ctx.appreciationReaction.removeComment);
  // Articles
  app.post('/articles/search', ctx.article.search);
  app.get('/articles/search', ctx.article.search);
  app.get('/articles/:id', ctx.article.load);

  app.post('/articles/commentthread/search', ctx.articleCommentThread.search)
  app.post('/articles/commentthread/:commentThreadId/reply', ctx.articleCommentThread.getReplyComments)
  app.post('/articles/commentthread/:id/:author/reply/:commentThreadId', ctx.authMiddleware.auth, ctx.articleCommentThread.reply)
  app.post('/articles/commentthread/:id/:author', ctx.authMiddleware.auth, ctx.articleCommentThread.comment)
  app.delete('/articles/commentthread/:commentThreadId/reply/:commentId', ctx.articleCommentThread.removeCommentReply)
  app.delete('/articles/commentthread/:commentId', ctx.articleCommentThread.removeCommentThread)
  app.put('/articles/commentthread/reply/:commentId', ctx.articleCommentThread.updateCommentReply)
  app.put('/articles/commentthread/:commentId', ctx.articleCommentThread.updateComment)
  app.get('/articles/commentthread/search', ctx.articleCommentThread.search)
  app.post('/articles/commentthread/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.articleCommentThreadReaction.setUserful)
  app.delete('/articles/commentthread/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.articleCommentThreadReaction.removeUseful)
  app.post('/articles/commentthread/reply/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.articleCommentReaction.setUserful)
  app.delete('/articles/commentthread/reply/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.articleCommentReaction.removeUseful)

  app.post('/articles/rates/comments', ctx.articleRateComment.search);
  app.get('/articles/rates/search', ctx.articleReaction.search);
  app.post('/articles/rates/search', ctx.articleReaction.search);
  app.post('/articles/rates/:id/:author', ctx.authMiddleware.auth, ctx.articleRate.rate);
  app.post('/articles/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.articleReaction.setUseful);
  app.delete('/articles/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.articleReaction.removeUseful);
  app.get('/articles/rates/:id/:author/comments', ctx.articleReaction.getComments);
  app.post('/articles/rates/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.articleReaction.comment);
  app.put('/articles/rates/:id/:author/comments/:userId/:commentId', ctx.authMiddleware.auth, ctx.articleReaction.updateComment);
  app.delete('/articles/rates/:id/:author/comments/:commentId', ctx.authMiddleware.auth, ctx.articleReaction.removeComment);

  app.post('/my-articles/search', ctx.myarticles.search);
  app.get('/my-articles/search', ctx.myarticles.search);
  app.post('/my-articles', ctx.myarticles.create);
  app.get('/my-articles/:id', ctx.myarticles.load);
  app.put('/my-articles/:id', ctx.myarticles.update);
  app.patch('/my-articles/:id', ctx.myarticles.patch);
  app.delete('/my-articles/:id', ctx.myarticles.delete);
  // app.delete('/my-articles/userId', ctx.myarticles.delete);


  // Cinema
  app.get('/cinemas/search', ctx.cinema.search);
  app.post('/cinemas/search', ctx.cinema.search);
  app.get('/cinemas', ctx.cinema.search);
  app.get('/cinemas/:id', ctx.cinema.load);

  app.get('/backoffice/cinemas/search', ctx.backofficeCinema.search);
  app.post('/backoffice/cinemas/search', ctx.backofficeCinema.search);
  app.get('/backoffice/cinemas', ctx.backofficeCinema.search);
  app.post('/backoffice/cinemas', ctx.backofficeCinema.create);
  app.get('/backoffice/cinemas/:id', ctx.backofficeCinema.load);
  app.put('/backoffice/cinemas/:id', ctx.backofficeCinema.update);
  app.patch('/backoffice/cinemas/:id', ctx.backofficeCinema.patch);
  app.delete('/backoffice/cinemas/:id', ctx.backofficeCinema.delete);
  // upload
  app.post('/backoffice/cinemas/:id/cover', parser.array('files'), ctx.backofficeCinemaUpload.uploadCover);
  app.post('/backoffice/cinemas/:id/upload', parser.array('files'), ctx.backofficeCinemaUpload.uploadImage);
  app.post('/backoffice/cinemas/:id/gallery', parser.single('files'), ctx.backofficeCinemaUpload.uploadGallery);
  app.patch('/backoffice/cinemas/:id/gallery', ctx.authMiddleware.auth, ctx.backofficeCinemaUpload.updateGallery);
  app.delete('/backoffice/cinemas/:id/gallery', ctx.authMiddleware.auth, ctx.backofficeCinemaUpload.deleteGalleryFile);
  app.post('/backoffice/cinemas/:id/external-resource', ctx.authMiddleware.auth, ctx.backofficeCinemaUpload.addExternalResource);
  app.delete('/backoffice/cinemas/:id/external-resource', ctx.authMiddleware.auth, ctx.backofficeCinemaUpload.deleteExternalResource);
  app.get('/backoffice/cinemas/:id/fetchImageGalleryUploaded', ctx.backofficeCinemaUpload.getGallery);

  app.get('/cinemas/rates/search', ctx.cinemaReaction.search);
  app.post('/cinemas/rates/search', ctx.cinemaReaction.search);
  app.post('/cinemas/rates/:id/:author', ctx.authMiddleware.auth, ctx.cinemaRate.rate);
  app.post('/cinemas/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.cinemaReaction.setUseful);
  app.delete('/cinemas/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.cinemaReaction.removeUseful);
  app.get('/cinemas/rates/:id/:author/comments', ctx.authMiddleware.auth, ctx.cinemaReaction.getComments);
  app.post('/cinemas/rates/:id/:author/comments', ctx.authMiddleware.auth, ctx.cinemaReaction.getComments);
  app.post('/cinemas/rates/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.cinemaReaction.comment);
  app.put('/cinemas/rates/:id/:author/comments/:userId/:commentId/', ctx.authMiddleware.auth, ctx.cinemaReaction.updateComment);
  app.delete('/cinemas/rates/:id/:author/comments/:commentId', ctx.authMiddleware.auth, ctx.cinemaReaction.removeComment);

  // Film
  app.get('/films/categories/search', ctx.filmCategory.search);
  app.post('/films/categories/', ctx.filmCategory.create);
  app.get('/films/categories/:id', ctx.filmCategory.load);
  app.put('/films/categories/:id', ctx.filmCategory.update);
  app.patch('/films/categories/:id', ctx.filmCategory.patch);
  app.delete('/films/categories/:id', ctx.filmCategory.delete);

  app.get('/films/search', ctx.film.search);
  app.post('/films/search', ctx.film.search);
  app.get('/films/:id', ctx.film.load);

  app.get('/films/save/:id/:itemId', ctx.saveFilm.save);
  app.get('/films/save/:id/', ctx.saveFilm.load);
  app.delete('/films/save/:id/:itemId', ctx.saveFilm.remove);

  app.post('/backoffice/films', ctx.backOfficeFilm.create);
  app.get('/backoffice/films/search', ctx.backOfficeFilm.search);
  app.post('/backoffice/films/search', ctx.backOfficeFilm.search);
  app.get('/backoffice/films/:id', ctx.backOfficeFilm.load);
  app.put('/backoffice/films/:id', ctx.backOfficeFilm.update);
  app.patch('/backoffice/films/:id', ctx.backOfficeFilm.patch);
  app.delete('/backoffice/films/:id', ctx.backOfficeFilm.delete);
  app.post('/backoffice/films/:id/upload',
    parser.array('files'),
    ctx.backOfficeFilmUpload.uploadImage
  );
  app.post('/backoffice/films/:id/cover',
    parser.array('files'),
    ctx.backOfficeFilmUpload.uploadCover
  );
  app.post('/backoffice/films/:id/gallery',
    parser.single('files'),
    ctx.backOfficeFilmUpload.uploadGallery
  );
  app.get('/backoffice/films/:id/fetchImageGalleryUploaded', ctx.backOfficeFilmUpload.getGallery);

  app.post('/films/rates/comments', ctx.filmComment.search);
  app.get('/films/rates/search', ctx.filmReaction.search);
  app.post('/films/rates/search', ctx.filmReaction.search);
  // app.get('/films/:id/rates/:author', ctx.filmReaction.load);
  app.post('/films/rates/:id/:author', ctx.authMiddleware.auth, ctx.filmRate.rate);
  app.post('/films/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.filmReaction.setUseful);
  app.delete('/films/rates/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.filmReaction.removeUseful);
  // app.get('/films/:id/rates/comment/search', ctx.filmComment.search);
  app.get('/films/rates/:id/:author/comments', ctx.filmReaction.getComments);
  app.post('/films/rates/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.filmReaction.comment);
  app.put('/films/rates/:id/:author/comments/:userId/:commentId', ctx.authMiddleware.auth, ctx.filmReaction.updateComment);
  app.delete('/films/rates/:id/:author/comments/:commentId', ctx.authMiddleware.auth, ctx.filmReaction.removeComment);

  app.post('/films/commentthread/search', ctx.filmCommentThread.search)
  app.post('/films/commentthread/:commentThreadId/reply', ctx.filmCommentThread.getReplyComments)
  app.post('/films/commentthread/:id/:author/reply/:commentThreadId', ctx.authMiddleware.auth, ctx.filmCommentThread.reply)
  app.post('/films/commentthread/:id/:author', ctx.authMiddleware.auth, ctx.filmCommentThread.comment)
  app.delete('/films/commentthread/:commentThreadId/reply/:commentId', ctx.filmCommentThread.removeCommentReply)
  app.delete('/films/commentthread/:commentId', ctx.filmCommentThread.removeCommentThread)
  app.put('/films/commentthread/reply/:commentId', ctx.filmCommentThread.updateCommentReply)
  app.put('/films/commentthread/:commentId', ctx.filmCommentThread.updateComment)
  app.get('/films/commentthread/search', ctx.filmCommentThread.search)
  app.post('/films/commentthread/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.filmCommentThreadReaction.setUserful)
  app.delete('/films/commentthread/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.filmCommentThreadReaction.removeUseful)
  app.post('/films/commentthread/reply/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.filmCommentReplyReaction.setUserful)
  app.delete('/films/commentthread/reply/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.filmCommentReplyReaction.removeUseful)


  app.get('/items/categories/search', ctx.itemCategory.search);
  app.get('/items/categories/:id', ctx.itemCategory.load);
  app.post('/items/categories/', ctx.itemCategory.create);
  app.put('/items/categories/:id', ctx.itemCategory.update);
  app.patch('/items/categories/:id', ctx.itemCategory.patch);
  app.delete('/items/categories/:id', ctx.itemCategory.delete);

  app.post('/items/search', ctx.items.search);
  app.get('/items/search', ctx.items.search);
  app.get('/items/:id', ctx.items.load);

  app.get('/saved-items/:id/', ctx.saveItem.load);
  app.get('/saved-items/:id/:itemId', ctx.saveItem.save);
  app.delete('/saved-items/:id/:itemId', ctx.saveItem.remove);

  app.get('/items/responses/search', ctx.itemReaction.search);
  app.post('/items/responses/search', ctx.itemReaction.search);
  app.post('/items/responses/:id/:author', ctx.authMiddleware.auth, ctx.itemResponse.reply);
  app.post('/items/responses/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.itemReaction.setUseful);
  app.delete('/items/responses/:id/:author/useful/:userId', ctx.authMiddleware.auth, ctx.itemReaction.removeUseful);
  app.get('/items/responses/:id/:author/comments', ctx.authMiddleware.auth, ctx.itemReaction.getComments);
  app.post('/items/responses/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.itemReaction.comment);
  app.put('/items/responses/:id/:author/comments/:userId/:commentId', ctx.authMiddleware.auth, ctx.itemReaction.updateComment);
  app.delete('/items/responses/:id/:author/comments/:commentId', ctx.authMiddleware.auth, ctx.itemReaction.removeComment);

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
    parser.single('files'),
    ctx.myitemsUpload.uploadGallery
  );
  app.patch('/my-items/:id/gallery', ctx.myitemsUpload.updateGallery);
  app.delete('/my-items/:id/gallery', ctx.myitemsUpload.deleteGalleryFile);

  // Comment
  app.post('/comments/search', ctx.authMiddleware.auth, ctx.comment.search);
  app.get('/comments/search', ctx.authMiddleware.auth, ctx.comment.search);
  app.get('/comments/:id', ctx.authMiddleware.auth, ctx.comment.load);
  app.post('/comments', ctx.authMiddleware.auth, ctx.comment.create);
  app.put('/comments/:id', ctx.authMiddleware.auth, ctx.comment.update);
  app.patch('/comments/:id', ctx.authMiddleware.auth, ctx.comment.patch);
  app.delete('/comments/:id', ctx.authMiddleware.auth, ctx.comment.delete);

  // Location
  app.post('/locations/search', ctx.location.search);
  app.get('/locations/search', ctx.location.search);
  app.get('/locations/:id', ctx.location.load);

  app.post('/backoffice/locations/search', ctx.backofficeLocation.search);
  app.get('/backoffice/locations/search', ctx.backofficeLocation.search);
  app.get('/backoffice/locations/:id', ctx.backofficeLocation.load);
  app.post('/backoffice/locations', ctx.backofficeLocation.create);
  app.put('/backoffice/locations/:id', ctx.backofficeLocation.update);
  app.patch('/backoffice/locations/:id', ctx.backofficeLocation.patch);
  app.delete('/backoffice/locations/:id', ctx.backofficeLocation.delete);
  // upload
  app.post('/backoffice/locations/:id/cover', parser.array('files'), ctx.backofficeLocationUpload.uploadCover);
  app.post('/backoffice/locations/:id/upload', parser.array('files'), ctx.backofficeLocationUpload.uploadImage);
  app.post('/backoffice/locations/:id/gallery', parser.single('files'), ctx.backofficeLocationUpload.uploadGallery);
  app.patch('/backoffice/locations/:id/gallery', ctx.backofficeLocationUpload.updateGallery);
  app.delete('/backoffice/locations/:id/gallery', ctx.backofficeLocationUpload.deleteGalleryFile);
  app.post('/backoffice/locations/:id/external-resource', ctx.backofficeLocationUpload.addExternalResource);
  app.delete('/backoffice/locations/:id/external-resource', ctx.backofficeLocationUpload.deleteExternalResource);
  app.get('/backoffice/locations/:id/fetchImageGalleryUploaded', ctx.backofficeLocationUpload.getGallery);

  app.post('/locations/rates/comments', ctx.locationComment.search);
  app.get('/locations/rates/search', ctx.locationReaction.search);
  app.post('/locations/rates/search', ctx.locationReaction.search);
  app.post('/locations/rates/:id/:author', ctx.locationRate.rate);
  app.post('/locations/rates/:id/:author/useful/:userId', ctx.locationReaction.setUseful);
  app.delete('/locations/rates/:id/:author/useful/:userId', ctx.locationReaction.removeUseful);
  app.get('/locations/rates/:id/:author/comments', ctx.locationReaction.getComments);
  app.post('/locations/rates/:id/:author/comments', ctx.locationReaction.getComments);
  app.post('/locations/rates/:id/:author/comments/:userId', ctx.authMiddleware.auth, ctx.locationReaction.comment);
  app.put('/locations/rates/:id/:author/comments/:userId/:commentId', ctx.locationReaction.updateComment);
  app.delete('/locations/rates/:id/:author/comments/:commentId', ctx.locationReaction.removeComment);

  app.post('/locations/commentthread/search', ctx.locationCommentThread.search)
  app.post('/locations/commentthread/:commentThreadId/reply', ctx.locationCommentThread.getReplyComments)
  app.post('/locations/commentthread/:id/:author/reply/:commentThreadId', ctx.authMiddleware.auth, ctx.locationCommentThread.reply)
  app.post('/locations/commentthread/:id/:author', ctx.authMiddleware.auth, ctx.locationCommentThread.comment)
  app.delete('/locations/commentthread/:commentThreadId/reply/:commentId', ctx.locationCommentThread.removeCommentReply)
  app.delete('/locations/commentthread/:commentId', ctx.locationCommentThread.removeCommentThread)
  app.put('/locations/commentthread/reply/:commentId', ctx.locationCommentThread.updateCommentReply)
  app.put('/locations/commentthread/:commentId', ctx.locationCommentThread.updateComment)
  app.get('/locations/commentthread/search', ctx.locationCommentThread.search)
  app.post('/locations/commentthread/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.locationCommentThreadReaction.setUserful)
  app.delete('/locations/commentthread/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.locationCommentThreadReaction.removeUseful)
  app.post('/locations/commentthread/reply/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.locationCommentReaction.setUserful)
  app.delete('/locations/commentthread/reply/:commentId/:author/useful/:userId', ctx.authMiddleware.auth, ctx.locationCommentReaction.removeUseful)

  app.get('/locations/follow/:id/:target', ctx.locationFollow.follow);
  app.delete('/locations/unfollow/:id/:target', ctx.locationFollow.unfollow);
  app.get('/locations/checkfollow/:id/:target', ctx.locationFollow.checkFollow);
  app.get('/locations/loadfollow/:id', ctx.locationInfomation.load);


  app.get('/locations/save/:id/:itemId', ctx.saveLocation.save);
  app.get('/locations/save/:id/', ctx.saveLocation.load);
  app.delete('/locations/save/:id/:itemId', ctx.saveLocation.remove);

  const companies = '/companies'
  app.post(`${companies}/search`, ctx.company.search)
  app.get(`${companies}/search`, ctx.company.search)
  app.get(`${companies}/:id`, ctx.company.load)
  app.get(`${companies}/user/:id`, ctx.company.getAllByUser)

  app.post('/companies/rates/search', ctx.criteriaReaction.search);
  app.get('/companies/rates/search', ctx.criteriaReaction.search);
  app.post('/companies/rates/:id/:author', ctx.criteriaRate.rate);
  app.post('/companies/rates/:id/:author/useful/:userId', ctx.criteriaReaction.setUseful);
  app.delete('/companies/rates/:id/:author/useful/:userId', ctx.criteriaReaction.removeUseful);
  app.get('/companies/rates/:id/:author/comments', ctx.criteriaReaction.getComments);
  app.post('/companies/rates/:id/:author/comments/:userId', ctx.criteriaReaction.comment);
  app.put('/companies/rates/:id/:author/comments/:userId/:commentId', ctx.criteriaReaction.updateComment);
  app.delete('/companies/rates/:id/:author/comments/:commentId', ctx.criteriaReaction.removeComment);

  app.post('/backoffice/companies/search', ctx.backofficeCompany.search);
  app.get('/backoffice/companies/search', ctx.backofficeCompany.search);
  app.get('/backoffice/companies/:id', ctx.backofficeCompany.load);
  app.post('/backoffice/companies/', ctx.backofficeCompany.create);
  app.put('/backoffice/companies/:id', ctx.backofficeCompany.update);
  app.patch('/backoffice/companies/:id', ctx.backofficeCompany.patch);
  app.delete('/backoffice/companies/:id', ctx.backofficeCompany.delete);
  app.patch('/backoffice/companies/:id/assign-users', ctx.backofficeCompany.assignUsers);
  app.patch('/backoffice/companies/:id/deassign-users', ctx.backofficeCompany.deassignUsers);

  // upload
  app.post('/backoffice/companies/:id/cover', parser.array('files'), ctx.backofficeCompanyUpload.uploadCover);
  app.post('/backoffice/companies/:id/upload', parser.array('files'), ctx.backofficeCompanyUpload.uploadImage);
  app.post('/backoffice/companies/:id/gallery', parser.single('files'), ctx.backofficeCompanyUpload.uploadGallery);
  app.patch('/backoffice/companies/:id/gallery', ctx.backofficeCompanyUpload.updateGallery);
  app.delete('/backoffice/companies/:id/gallery', ctx.backofficeCompanyUpload.deleteGalleryFile);
  app.post('/backoffice/companies/:id/external-resource', ctx.backofficeCompanyUpload.addExternalResource);
  app.delete('/backoffice/companies/:id/external-resource', ctx.backofficeCompanyUpload.deleteExternalResource);
  app.get('/backoffice/companies/:id/fetchImageGalleryUploaded', ctx.backofficeCompanyUpload.getGallery);

  app.get('/companies/categories/search', ctx.companyCategory.search);
  app.get('/companies/categories/:id', ctx.companyCategory.load);
  app.post('/companies/categories/', ctx.companyCategory.create);
  app.put('/companies/categories/:id', ctx.companyCategory.update);
  app.patch('/companies/categories/:id', ctx.companyCategory.patch);
  app.delete('/companies/categories/:id', ctx.companyCategory.delete);

  // app.post('/companies/rates', ctx.companyRate.rate);
  // app.get('/companies/rates/search', ctx.companyReaction.search);
  // app.post('/companies/rates/search', ctx.companyReaction.search);
  // app.get('/companies/rates/comment/search', ctx.companyComment.search);
  // app.post('/companies/rates/comment/search', ctx.companyComment.search);
  // app.get('/companies/rates/:id/:author', ctx.companyReaction.load);
  // app.post('/companies/rates/useful/:id/:author/:userId', ctx.companyReaction.setUseful);
  // app.delete('/companies/rates/useful/:id/:author/:userId', ctx.companyReaction.removeUseful);
  // app.post('/companies/rates/comment/:id/:author/:userId', ctx.companyReaction.comment);
  // app.delete('/companies/rates/comment/:commentId/:author', ctx.companyReaction.removeComment);
  // app.put('/companies/rates/comment/:commentId/:id/:author/:userId', ctx.companyReaction.updateComment);

  // Job
  app.get('/jobs/search', ctx.jobs.search);
  app.post('/jobs/search', ctx.jobs.search);
  app.get('/jobs/:id', ctx.jobs.load);

  app.get('/backoffice/jobs/search', ctx.backofficeJob.search);
  app.post('/backoffice/jobs/search', ctx.backofficeJob.search);
  app.get('/backoffice/jobs/:id', ctx.backofficeJob.load);
  app.post('/backoffice/jobs/', ctx.backofficeJob.create);
  app.put('/backoffice/jobs/:id', ctx.backofficeJob.update);
  app.patch('/backoffice/jobs/:id', ctx.backofficeJob.patch);
  app.delete('/backoffice/jobs/:id', ctx.backofficeJob.delete);

  app.post('/backoffice/rooms/search', ctx.backofficeRoom.search);
  app.get('/backoffice/rooms/search', ctx.backofficeRoom.search);
  app.get('/backoffice/rooms/:id', ctx.backofficeRoom.load);
  app.post('/backoffice/rooms/', ctx.backofficeRoom.create);
  app.put('/backoffice/rooms/:id', ctx.backofficeRoom.update);
  app.patch('/backoffice/rooms/:id', ctx.backofficeRoom.patch);
  app.delete('/backoffice/rooms/:id', ctx.backofficeRoom.delete);
  app.get('/rooms/search', ctx.room.search);
  app.post('/rooms/search', ctx.room.search);
  app.get('/rooms/:id', ctx.room.load);
  app.post('/rooms/reserve', ctx.room.saveReservation);

  // Music
  app.get('/musics/search', ctx.music.search);
  app.post('/musics/search', ctx.music.search);
  app.get('/musics/:id', ctx.music.load);

  app.get('/backoffice/musics/search', ctx.backofficeMusic.search);
  app.post('/backoffice/musics/search', ctx.backofficeMusic.search);
  app.get('/backoffice/musics/:id', ctx.backofficeMusic.load);
  app.post('/backoffice/musics/', ctx.backofficeMusic.create);
  app.put('/backoffice/musics/:id', ctx.backofficeMusic.update);
  app.patch('/backoffice/musics/:id', ctx.backofficeMusic.patch);
  app.delete('/backoffice/musics/:id', ctx.backofficeMusic.delete);

  app.get('/saved-musics/:id/', ctx.saveMusic.load);
  app.get('/saved-musics/:id/:itemId', ctx.saveMusic.save);
  app.delete('/saved-musics/:id/:itemId', ctx.saveMusic.remove);

  app.get('/musics/playlist/search', ctx.playlist.search);
  app.post('/musics/playlist/search', ctx.playlist.search);
  app.get('/musics/playlist/:id', ctx.playlist.load);
  app.post('/musics/playlist/', ctx.playlist.create);
  app.put('/musics/playlist/:id', ctx.playlist.update);
  app.patch('/musics/playlist/:id', ctx.playlist.patch);
  app.delete('/musics/playlist/:id', ctx.playlist.delete);

  app.get('/saved-listsong/:id/', ctx.saveListsong.load);
  app.post('/saved-listsong/:id/:itemId', ctx.saveListsong.save);
  app.delete('/saved-listsong/:id/:itemId', ctx.saveListsong.remove);
}
