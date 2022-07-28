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
  app.get('/my-articles/:id', ctx.myarticles.load);
  app.post('/my-articles', ctx.myarticles.create);
  app.put('/my-articles/:id', ctx.myarticles.update);
  app.patch('/my-articles/:id', ctx.myarticles.patch);
  app.delete('/my-articles/:id', ctx.myarticles.delete);
  app.delete('/my-articles/userId', ctx.myarticles.delete);

  app.post('/items/search', ctx.items.search);
  app.get('/items/search', ctx.items.search);
  app.get('/items/:id', ctx.items.load);
  // app.post('/items/', ctx.items.create);
  // app.put('/items/:id', ctx.items.update);
  // app.patch('/items/:id', ctx.items.patch);
  // app.delete('/items/:id', ctx.items.delete);

  app.post('/item-appreciation/search', ctx.items.search);
  app.get('/item-appreciation/search', ctx.items.search);
  app.get('/item-appreciation/:id', ctx.items.load);

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


  app.get('/item-comment/search', ctx.itemComment.search);
  app.post('/item-comment/search', ctx.itemComment.search);
  app.post('/item-response', ctx.response.response);
  app.get('/item-response/search', ctx.response.search);
  app.post('/item-response/search', ctx.response.search);
  app.get('/item-response/comment/search', ctx.itemComment.search);
  app.post('/item-response/comment/search', ctx.itemComment.search);
  app.put('/item-response/:id/:author', ctx.response.updateResponse);
  app.get('/item-response/:id/:author', ctx.response.load);
  app.post('/item-response/useful/:id/:author/:userid', ctx.response.setUseful);
  app.delete('/item-response/useful/:id/:author/:userid', ctx.response.removeUseful);
  app.post('/item-response/comment/:id/:author/:userid', ctx.response.comment);
  app.delete('/item-response/comment/:commentid/:author', ctx.response.removeComment);
  app.put('/item-response/comment/:commentid/:id/:author/:userid', ctx.response.updateComment);

  app.post('/comment/search', ctx.comment.search);
  app.get('/comment/search', ctx.comment.search);
  app.get('/comment/:id', ctx.comment.load);
  app.post('/comment', ctx.comment.create);
  app.put('/comment/:id', ctx.comment.update);
  app.patch('/comment/:id', ctx.comment.patch);
  app.delete('/comment/:id', ctx.comment.delete);

  app.post('/categories/search', ctx.category.search);
  app.get('/categories/search', ctx.category.search);
  app.get('/categories/:id', ctx.category.load);
  app.post('/categories/', ctx.category.create);
  app.put('/categories/:id', ctx.category.update);
  app.patch('/categories/:id', ctx.category.patch);
  app.delete('/categories/:id', ctx.category.delete);

  app.post("/locations/search", ctx.location.search);
  app.get("/locations/search", ctx.location.search);
  app.get("/locations/:id", ctx.location.load);

  app.get("/location-rate/search", ctx.locationRate.search);
  app.post("/location-rate/search", ctx.locationRate.search);
  app.get("/location-rate/:id", ctx.locationRate.load);

  app.post('/companies/search', ctx.company.search);
  app.get('/companies/search', ctx.company.search);
  app.get('/companies/:id', ctx.company.load);
  app.post('/companies/', ctx.company.create);
  app.put('/companies/:id', ctx.company.update);
  app.patch('/companies/:id', ctx.company.patch);
  app.delete('/companies/:id', ctx.company.delete);
  
  app.get('/company-categories/search', ctx.companyCategories.search);
  app.get('/company-categories/:id', ctx.companyCategories.load);
  app.post('/company-categories/', ctx.companyCategories.create);
  app.put('/company-categories/:id', ctx.companyCategories.update);
  app.patch('/company-categories/:id', ctx.companyCategories.patch);
  app.delete('/company-categories/:id', ctx.companyCategories.delete);

}
