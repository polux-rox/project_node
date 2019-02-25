'use strict';


const UserSchema = require('../schemas/schemaUser');
const Joi = require('joi');

module.exports = [
    {
        method  : 'PUT',
        path    : '/users/changeIdentifier/{id}',
        options : {
            tags : ['api'],
            validate : {
                params : {
                    id : Joi.number().integer().required()
                    
                },
                query : Joi.object({
                    login: Joi.string().token(),
                    password: Joi.string().min(8)
                }).or('login', 'password')
            }
        },
        
        async handler(request, h) {

            const { userService } = request.services();
            const { mailService } = request.services();

            const oldUser = await userService.getUserById(request.params.id);
            const change  = {};
            let password;

            if (request.query.login && oldUser.login !== request.query.login) {
                change.login = request.query.login;
            }

            if (request.query.password && oldUser.password !== request.query.password) {
                change.password = request.query.password;
                password = request.query.password;
            }

            if (change.login || change.password){
                const savedUser = await userService.changeIdentifiants(request.params.id, change);
                if (change.password) {
                    change.password = password;
                }

                console.log(change);
                await mailService.sendMailsChange(savedUser, change);

                return h.response('mail envoyé').code(201);
            }

            return 'ok';
        }
    },
    {
        method  : 'GET',
        path    : '/users',
        options : {
            tags : ['api']
        },
        async handler(request, h) {

            const { userService } = request.services();

            return await userService.getAll();
        }
    },
    {
        method  : 'POST',
        path    : '/users',
        options : {
            tags : ['api'],
            validate : {
                payload : UserSchema
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            const { mailService } = request.services();

            await mailService.sendMails(request.payload);

            return await userService.add(request.payload);
        }
    },
    {
        method  : 'GET',
        path    : '/users/{id}',
        options : {
            tags : ['api'],
            validate : {
                params : {
                    id : Joi.number().integer().required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();

            return await userService.getUserById(request.params.id);
        }
    },
    {
        method  : 'DELETE',
        path    : '/users/{id}',
        options : {
            tags : ['api'],
            validate : {
                params : {
                    id : Joi.number().required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            return await userService.deleteUser(request.params.id);
        }
    },
    {
        method : 'PUT',
        path    : '/users/{id}',
        options : {
            tags : ['api'],
            validate : {
                payload : UserSchema,
                params : {
                    id : Joi.number().required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            return await userService.updateUser(request.params.id, request.payload);
        }
    },
    {
        method : 'POST',
        path    : '/users/generate',
        options : {
            tags : ['api']
        },
        async handler(request, h) {

            const { userService } = request.services();
            const tabUser = userService.generation();
            return await userService.insertGeneration(tabUser);
        }
    },
    {
        method: 'POST',
        path: '/auth/{login}/{password}',
        options: {
            tags: ['api'],
            validate : {
                params: {
                    login: Joi.string().required(),
                    password: Joi.string().min(8).required()
                }
            }
        },
        async handler(request, h) {

            const { userService } = request.services();
            const results = await userService.checkUser(request.params.login, request.params.password);
            if (results.length === 0) {
                return h.response('{ msg : \'ko\' }').code(404);
            }

            return h.response('{ msg : \'ok\' }').code(204);
            
                
        }
    }
];
