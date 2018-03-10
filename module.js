// /* global angular */
// /* https://github.com/johnpapa/angular-styleguide/blob/master/a1/README.md#application-structure */

; (function () {
    'use strict'
    angular.module('client.main.pages.questionnaires', ['ui.router'])

    angular.module('client.main.pages.questionnaires').config(RouteConfig) //RouteConfig is name you give function

    RouteConfig.$inject = ['$stateProvider']

    function RouteConfig($stateProvider) {
        $stateProvider
            .state('main.questionnaires', {
                url: '/admin/questionnaires',
                abstract: true,
                views: {
                    'body@main': {
                        templateUrl: 'client/main/pages/questionnaires/main.questionnaires.html',
                    }
                }
            })
            .state('main.questionnaires.details', {
                url: '/details/:id',
                views: {
                    'questionnaires@main.questionnaires': { component: 'questionnairesDetail' }
                },
                resolve: {
                    traumaTypes: getTraumaTypes
                }
            })
            .state('main.questionnaires.list', {
                url: '/list',
                views: {
                    'questionnaires@main.questionnaires': { component: 'questionnairesList' }
                },
                resolve: {
                    questionnaires: getQuestionnaires
                }
            })
    }
    getQuestionnaires.$inject = ['questionnairesService']
    function getQuestionnaires(questionnairesService) {
        return questionnairesService.read()
            .then(data => data.items)
    }
    getTraumaTypes.$inject = ['traumaTypesService']
    function getTraumaTypes(traumaTypesService) {
        return traumaTypesService.readPublished()
            .then(data => data.items)
    }
})();
