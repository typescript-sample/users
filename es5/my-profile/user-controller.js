"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyProfileController = void 0;
var express_ext_1 = require("express-ext");
var MyProfileController = /** @class */ (function () {
    function MyProfileController(log, service, saveSkills, saveInterests, saveLookingFor, saveEducation, saveCompany) {
        this.log = log;
        this.service = service;
        this.saveSkills = saveSkills;
        this.saveInterests = saveInterests;
        this.saveLookingFor = saveLookingFor;
        this.saveEducation = saveEducation;
        this.saveCompany = saveCompany;
    }
    MyProfileController.prototype.getMyProfile = function (req, res) {
        var _this = this;
        var id = (0, express_ext_1.buildAndCheckId)(req, res);
        if (id) {
            this.service
                .getMyProfile(id)
                .then(function (user) { return (0, express_ext_1.respondModel)((0, express_ext_1.minimize)(user), res); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    MyProfileController.prototype.getMySettings = function (req, res) {
        var _this = this;
        var id = req.params['id'];
        if (!id || id.length === 0) {
            res.status(400).send('id cannot be empty');
        }
        else {
            this.service
                .getMySettings(id)
                .then(function (settings) { return (0, express_ext_1.respondModel)((0, express_ext_1.minimize)(settings), res); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    MyProfileController.prototype.saveMyProfile = function (req, res) {
        var _this = this;
        var user = req.body;
        var id = req.params['id'];
        if (!id || id.length === 0) {
            res.status(400).send('id cannot be empty');
        }
        else {
            if (!user) {
                res.status(400).send('data cannot be empty');
                return;
            }
            if (!user.id) {
                user.id = id;
            }
            else if (id !== user.id) {
                res.status(400).send('body and url are not matched');
                return;
            }
            if (this.saveSkills && user.skills) {
                var skills = user.skills.map(function (i) { return i.skill; });
                this.saveSkills(skills);
            }
            if (this.saveInterests && user.interests) {
                this.saveInterests(user.interests);
            }
            if (this.saveLookingFor && user.lookingFor) {
                this.saveLookingFor(user.lookingFor);
            }
            if (this.saveEducation && user.educations) {
                var listSchool = user.educations.map(function (e) { return e.school; });
                this.saveEducation(listSchool);
            }
            if (this.saveCompany && user.companies) {
                var listCompanyName = user.companies.map(function (c) { return c.name; });
                this.saveCompany(listCompanyName);
            }
            this.service
                .saveMyProfile(user)
                .then(function (result) { return res.status(200).json(result).send(); })
                .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
        }
    };
    MyProfileController.prototype.saveMySettings = function (req, res) {
        var _this = this;
        var id = req.params['id'];
        if (!id || id.length === 0) {
            res.status(400).send('id cannot be empty');
        }
        else {
            var settings = req.body;
            if (!settings) {
                res.status(400).send('data cannot be empty');
            }
            else {
                this.service
                    .saveMySettings(id, settings)
                    .then(function (result) { return res.status(200).json(result).send(); })
                    .catch(function (err) { return (0, express_ext_1.handleError)(err, res, _this.log); });
            }
        }
    };
    return MyProfileController;
}());
exports.MyProfileController = MyProfileController;
//# sourceMappingURL=user-controller.js.map