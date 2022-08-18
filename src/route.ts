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

  app.get('/users/follow/:id/:target', ctx.userFollow.follow)
  app.delete('/users/unfollow/:id/:target', ctx.userFollow.unfollow)
  app.get('/users/checkfollow/:id/:target', ctx.userFollow.checkFollow)
  app.get('/users/loadfollow/:id/', ctx.userInfo.load)
  
  app.post('/appreciation/rates/comments', ctx.appreciationComment.search);
  app.get('/appreciation/rates/search', ctx.appreciationReaction.search);
  app.post('/appreciation/rates/search', ctx.appreciationReaction.search);
  app.post('/appreciation/rates/:id/:author', ctx.appreciation.reply);
  app.post('/appreciation/rates/:id/:author/useful/:userId', ctx.appreciationReaction.setUseful);
  app.delete('/appreciation/rates/:id/:author/useful/:userId', ctx.appreciationReaction.removeUseful);
  // app.get('/appreciation/rates/:id/:author/comments', ctx.appreciationReaction.getComments);
  
  app.post('/appreciation/rates/:id/:author/comments/:userId', ctx.appreciationReaction.comment);
  app.put('/appreciation/rates/:id/:author/comments/:userId/:commentId/', ctx.appreciationReaction.updateComment);
  app.delete('/appreciation/rates/:id/:author/comments/:commentId', ctx.appreciationReaction.removeComment);


  // Aticles
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
  //upload
  app.post('/backoffice/cinemas/:id/cover', parser.array('files'), ctx.backofficeCinemaUpload.uploadCover);
  app.post('/backoffice/cinemas/:id/upload', parser.array('files'), ctx.backofficeCinemaUpload.uploadImage);
  app.post('/backoffice/cinemas/:id/gallery', parser.single('file'), ctx.backofficeCinemaUpload.uploadGallery);
  app.patch('/backoffice/cinemas/:id/gallery', ctx.backofficeCinemaUpload.updateGallery);
  app.delete('/backoffice/cinemas/:id/gallery', ctx.backofficeCinemaUpload.deleteGalleryFile);
  app.post('/backoffice/cinemas/:id/external-resource', ctx.backofficeCinemaUpload.addExternalResource);
  app.delete('/backoffice/cinemas/:id/external-resource', ctx.backofficeCinemaUpload.deleteExternalResource);
  app.get('/backoffice/cinemas/:id/fetchImageGalleryUploaded',ctx.backofficeCinemaUpload.getGallery);

  app.get('/cinemas/rates/search', ctx.cinemaReaction.search);
  app.post('/cinemas/rates/search', ctx.cinemaReaction.search);
  app.post('/cinemas/rates/:id/:author', ctx.cinemaRate.rate);
  app.post('/cinemas/rates/:id/:author/useful/:userId', ctx.cinemaReaction.setUseful);
  app.delete('/cinemas/rates/:id/:author/useful/:userId', ctx.cinemaReaction.removeUseful);
  app.get('/cinemas/rates/:id/:author/comments', ctx.cinemaReaction.getComments);
  app.post('/cinemas/rates/:id/:author/comments', ctx.cinemaReaction.getComments);
  app.post('/cinemas/rates/:id/:author/comments/:userId', ctx.cinemaReaction.comment);
  app.put('/cinemas/rates/:id/:author/comments/:userId/:commentId/', ctx.cinemaReaction.updateComment);
  app.delete('/cinemas/rates/:id/:author/comments/:commentId', ctx.cinemaReaction.removeComment);

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
  app.delete('/films/unsave/:id/:itemId', ctx.saveFilm.remove);

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
    parser.single('file'),
    ctx.backOfficeFilmUpload.uploadGallery
  );
  app.get('/backoffice/films/:id/fetchImageGalleryUploaded',ctx.backOfficeFilmUpload.getGallery);

  app.get('/films/rates/search', ctx.filmReaction.search);
  app.post('/films/rates/search', ctx.filmReaction.search);
  // app.get('/films/:id/rates/:author', ctx.filmReaction.load);
  app.post('/films/rates/:id/:author', ctx.filmRate.rate);
  app.post('/films/rates/:id/:author/useful/:userId', ctx.filmReaction.setUseful);
  app.delete('/films/rates/:id/:author/useful/:userId', ctx.filmReaction.removeUseful);
  // app.get('/films/:id/rates/comment/search', ctx.filmComment.search);
  app.get('/films/rates/:id/:author/comments', ctx.filmReaction.getComments);
  app.post('/films/rates/:id/:author/comments/:userId', ctx.filmReaction.comment);
  app.put('/films/rates/:id/:author/comments/:userId/:commentId', ctx.filmReaction.updateComment);
  app.delete('/films/rates/:id/:author/comments/:commentId', ctx.filmReaction.removeComment);


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
  app.post('/saved-items/:id/:itemId', ctx.saveItem.save);
  app.delete('/saved-items/:id/:itemId', ctx.saveItem.remove);

  app.get('/items/responses/search', ctx.itemReaction.search);
  app.post('/items/responses/search', ctx.itemReaction.search);
  app.post('/items/responses/:id/:author', ctx.itemResponse.reply);
  app.post('/items/responses/:id/:author/useful/:userId', ctx.itemReaction.setUseful);
  app.delete('/items/responses/:id/:author/useful/:userId', ctx.itemReaction.removeUseful);
  app.get('/items/responses/:id/:author/comments', ctx.itemReaction.getComments);
  app.post('/items/responses/:id/:author/comments/:userId', ctx.itemReaction.comment);
  app.put('/items/responses/:id/:author/comments/:userId/:commentId', ctx.itemReaction.updateComment);
  app.delete('/items/responses/:id/:author/comments/:commentId', ctx.itemReaction.removeComment);

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

  // Comment
  app.post('/comments/search', ctx.comment.search);
  app.get('/comments/search', ctx.comment.search);
  app.get('/comments/:id', ctx.comment.load);
  app.post('/comments', ctx.comment.create);
  app.put('/comments/:id', ctx.comment.update);
  app.patch('/comments/:id', ctx.comment.patch);
  app.delete('/comments/:id', ctx.comment.delete);

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
  //upload
  app.post('/backoffice/locations/:id/cover', parser.array('files'), ctx.backofficeLocationUpload.uploadCover);
  app.post('/backoffice/locations/:id/upload', parser.array('files'), ctx.backofficeLocationUpload.uploadImage);
  app.post('/backoffice/locations/:id/gallery', parser.single('file'), ctx.backofficeLocationUpload.uploadGallery);
  app.patch('/backoffice/locations/:id/gallery', ctx.backofficeLocationUpload.updateGallery);
  app.delete('/backoffice/locations/:id/gallery', ctx.backofficeLocationUpload.deleteGalleryFile);
  app.post('/backoffice/locations/:id/external-resource', ctx.backofficeLocationUpload.addExternalResource);
  app.delete('/backoffice/locations/:id/external-resource', ctx.backofficeLocationUpload.deleteExternalResource);
  app.get('/backoffice/locations/:id/fetchImageGalleryUploaded',ctx.backofficeLocationUpload.getGallery);

  app.get('/locations/rates/search', ctx.locationReaction.search);
  app.post('/locations/rates/search', ctx.locationReaction.search);
  app.post('/locations/rates/:id/:author', ctx.locationRate.rate);
  app.post('/locations/rates/:id/:author/useful/:userId', ctx.locationReaction.setUseful);
  app.delete('/locations/rates/:id/:author/useful/:userId', ctx.locationReaction.removeUseful);
  app.get('/locations/rates/:id/:author/comments', ctx.locationReaction.getComments);
  app.post('/locations/rates/:id/:author/comments', ctx.locationReaction.getComments);
  app.post('/locations/rates/:id/:author/comments/:userId', ctx.locationReaction.comment);
  app.put('/locations/rates/:id/:author/comments/:userId/:commentId', ctx.locationReaction.updateComment);
  app.delete('/locations/rates/:id/:author/comments/:commentId', ctx.locationReaction.removeComment);

  app.get('/locations/follow/:id/:target', ctx.locationFollow.follow)
  app.delete('/locations/unfollow/:id/:target', ctx.locationFollow.unfollow)
  app.get('/locations/checkfollow/:id/:target', ctx.locationFollow.checkFollow)
  app.get('/locations/loadfollow/:id/', ctx.locationInfomation.load)


  app.get('/locations/save/:id/:itemId', ctx.saveLocation.save);
  app.get('/locations/save/:id/', ctx.saveLocation.load);
  app.delete('/locations/unsave/:id/:itemId', ctx.saveLocation.remove);


  // Company
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
  //upload
  app.post('/backoffice/companies/:id/cover', parser.array('files'), ctx.backofficeCompanyUpload.uploadCover);
  app.post('/backoffice/companies/:id/upload', parser.array('files'), ctx.backofficeCompanyUpload.uploadImage);
  app.post('/backoffice/companies/:id/gallery', parser.single('file'), ctx.backofficeCompanyUpload.uploadGallery);
  app.patch('/backoffice/companies/:id/gallery', ctx.backofficeCompanyUpload.updateGallery);
  app.delete('/backoffice/companies/:id/gallery', ctx.backofficeCompanyUpload.deleteGalleryFile);
  app.post('/backoffice/companies/:id/external-resource', ctx.backofficeCompanyUpload.addExternalResource);
  app.delete('/backoffice/companies/:id/external-resource', ctx.backofficeCompanyUpload.deleteExternalResource);
  app.get('/backoffice/companies/:id/fetchImageGalleryUploaded',ctx.backofficeCompanyUpload.getGallery);

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
}
