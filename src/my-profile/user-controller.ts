import { Request, Response } from 'express';
import { buildAndCheckId, handleError, minimize, respondModel } from 'express-ext';
import { Log } from 'onecore';
import { UploadController } from 'upload-express';
import { UserSettings } from '../my-profile';
import { MyProfileService, User } from './user';

export type Save = (values: string[]) => Promise<number>;
export class MyProfileController {
  constructor(
    private log: Log,
    private service: MyProfileService,
    public saveSkills?: Save,
    public saveInterests?: Save,
    public saveLookingFor?: Save,
    public saveEducation?: Save,
    public saveCompany?: Save,
  ) {
    this.getMyProfile = this.getMyProfile.bind(this)
    this.getMySettings = this.getMySettings.bind(this)
    this.saveMyProfile = this.saveMyProfile.bind(this)
    this.saveMyProfile = this.saveMyProfile.bind(this)

  }
  getMyProfile(req: Request, res: Response) {
    const id = buildAndCheckId<string>(req, res);
    if (id) {
      this.service
        .getMyProfile(id)
        .then((user) => respondModel(minimize(user), res))
        .catch((err) => handleError(err, res, this.log));
    }
  }
  getMySettings(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      res.status(400).send('id cannot be empty');
    } else {
      this.service
        .getMySettings(id)
        .then((settings) => respondModel(minimize(settings), res))
        .catch((err) => handleError(err, res, this.log));
    }
  }
  saveMyProfile(req: Request, res: Response) {
    const user: User = req.body;
    const id = req.params['id'];
    if (!id || id.length === 0) {
      res.status(400).send('id cannot be empty');
    } else {
      if (!user) {
        res.status(400).send('data cannot be empty');
        return;
      }
      if (!user.id) {
        user.id = id;
      } else if (id !== user.id) {
        res.status(400).send('body and url are not matched');
        return;
      }
      if (this.saveSkills && user.skills) {
        const skills = user.skills.map(i => i.skill);
        this.saveSkills(skills);
      }
      if (this.saveInterests && user.interests) {
        this.saveInterests(user.interests);
      }
      if (this.saveLookingFor && user.lookingFor) {
        this.saveLookingFor(user.lookingFor);
      }
      if (this.saveEducation && user.educations) {
        const listSchool = user.educations.map(e => e.school);
        this.saveEducation(listSchool);
      }
      if (this.saveCompany && user.companies) {
        const listCompanyName = user.companies.map(c => c.name);
        this.saveCompany(listCompanyName);
      }
      return this.service
        .saveMyProfile(user)
        .then((result) => res.status(200).json(result).send())
        .catch((err) => handleError(err, res, this.log));
    }
  }
  saveMySettings(req: Request, res: Response) {
    const id = req.params['id'];
    if (!id || id.length === 0) {
      res.status(400).send('id cannot be empty');
    } else {
      const settings: UserSettings = req.body;
      if (!settings) {
        res.status(400).send('data cannot be empty');
      } else {
        this.service
          .saveMySettings(id, settings)
          .then((result) => res.status(200).json(result).send())
          .catch((err) => handleError(err, res, this.log));
      }
    }
  }
}
