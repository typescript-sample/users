import { StorageRepository } from 'google-storage';
import { ModelConf, StorageConf, StorageService, UploadInfo } from 'one-storage';
import { BuildUrl, Delete, Generate, Log } from 'onecore';
import { DB, Repository } from 'query-core';
import { clone } from 'reflectx';
import { MyProfileService, User, userModel, UserRepository, UserSettings } from './user';
import { MyProfileController, Save } from './user-controller';
import { UploadController } from './upload';
export * from './user';
export { MyProfileController };

export function useMyProfileController(log: Log,repository: Repository<User, string>, settings: UserSettings, saveSkills: Save | undefined, saveInterests: Save | undefined, saveLookingFor: Save | undefined, saveEducation: Save | undefined, saveCompany: Save | undefined,
): MyProfileController {
  const service = new MyProfileManager(repository, settings);

  return new MyProfileController(log, service, saveSkills, saveInterests, saveLookingFor, saveEducation, saveCompany);
}

export function useMyProfileUploadController(log: Log,repository:  Repository<User, string>, storage: StorageRepository, deleteFile: Delete, generateId: Generate, buildUrl: BuildUrl ,sizesCover: number[],
  sizesImage: number[], config?: StorageConf, model?: ModelConf): UploadController {
  const service = new StorageService(repository.load, repository.patch, storage, deleteFile, generateId, buildUrl, sizesCover, sizesImage, config, model);
  return new UploadController(log, service, generateId, sizesCover, sizesImage);
}


export class MyProfileManager implements MyProfileService {
  constructor(
    private repository: UserRepository,
    private settings: UserSettings
  ) {
  }
  getMyProfile(id: string): Promise<User | null> {
    return this.repository.load(id).then((user) => {
      let rs = null;
      if (user) {
        delete user.settings;
        rs = user;
      }
      return rs;
    });
  }
  getMySettings(id: string): Promise<UserSettings | null> {
    return this.repository.load(id)
      .then((user) =>
        user && user.settings ? user.settings : clone(this.settings)
      );
  }
  saveMyProfile(user: User): Promise<number> {
    return this.repository.patch(user);
  }
  saveMySettings(id: string, settings: UserSettings): Promise<number> {
    return this.repository.patch({ id, settings });
  }
}
