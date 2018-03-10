; (function () {
    'use strict'

    angular.module('client.main.pages.questionnaires')
        .controller('questionnaireListController', QuestionnaireListController)

    QuestionnaireListController.$inject = ['questionnairesService', '$log', '$state', 'uiNotificationsService']

    function QuestionnaireListController(questionnairesService, $log, $state, uiNotificationsService) {
        const vm = this

        vm.delete = _delete

        vm.$onInit = $init

        function $init() {
            vm.formData = {}
        }

        function _delete(id) {
            uiNotificationsService.confirm('Are you sure you want to delete this questionnaire?', 'Yes, delete', 'No, cancel')
                .then(response => {
                    if (!response) { return }
                    return questionnairesService.delete(id)
                        .then(data => {
                            let removeIndex = vm.questionnaires.findIndex(element => element._id == id)
                            vm.questionnaires.splice(removeIndex, 1)
                        })
                        .catch(data => {
                            $log.log(`Error: ${data.errors}`)
                            uiNotificationsService.error('An error occurred while attempting to delete this questionnaire.')
                        })
                })
        }

    }
})();
(function () {
    angular.module('client.main.pages.questionnaires').component('questionnairesList', {
        templateUrl: 'client/main/pages/questionnaires/list/questionnaire.list.html',
        controller: 'questionnaireListController',
        bindings: {
            questionnaires: '<'
        }
    })
})()