; (function () {
    'use strict'

    angular.module('client.main.pages.questionnaires')
        .controller('questionnaireDetailController', QuestionnaireDetailController)

    QuestionnaireDetailController.$inject = ['questionnairesService', '$log', '$stateParams', '$state', 'uiNotificationsService']

    function QuestionnaireDetailController(questionnairesService, $log, $stateParams, $state, uiNotificationsService) {

        const vm = this

        vm.postQuestionnaireBtn = _postPutBtn
        vm.addQuestionBtn = _addQuestionBtn
        vm.addAnswerBtn = _addAnswerBtn
        vm.removeQuestionBtn = _removeQuestionBtn
        vm.removeAnswerBtn = _removeAnswerBtn
        vm.cancelBtn = _cancelBtn

        vm.$onInit = $init

        function $init() {
            vm.questionnairesData = {}
            vm.questionnairesData.questions = []

            if ($stateParams.id) {
                questionnairesService.readQuestionnaireById($stateParams.id)
                    .then(data => {
                        vm.questionnairesData = data.item
                        if (vm.questionnairesData.isDraft == true) {
                            vm.isDraft = false
                        }
                        else {
                            vm.isDraft = true
                        }
                    })
                    .catch(data => $log.log(`Error: ${data.errors}`))
            } else {
                vm.questionnairesData.isDraft = true
                vm.questionnairesData.questions.push({ answers: [] })
            }
            vm.types = [
                { name: 'Long-text', value: 'long-text' },
                { name: 'Short-text', value: 'short-text' },
                { name: 'Single', value: 'single' },
                { name: 'Multiple', value: 'multiple' },
                { name: 'Emoji', value: 'emoji' }
            ]

        }

        function _createQuestionnaire() {
            questionnairesService.createQuestionnaire(vm.questionnairesData)
                .then(data => {
                    uiNotificationsService.success("Questionnaire created successfully.")
                    $state.go('main.questionnaires.list')
                })
                .catch(data => {
                    $log.log(`Error: ${data.errors}`)
                    uiNotificationsService.error('An error occurred while attemping to create the questionnaire.')
            })
        }

        function _updateQuestionnaire() {
            questionnairesService.updateQuestionnaire(vm.questionnairesData)
                .then(data => {
                    uiNotificationsService.success("Questionnaire updated successfully.")
                    $state.go('main.questionnaires.list')
                })
                .catch(data => {
                    $log.log(`Error: ${data.errors}`)
                    uiNotificationsService.error('An error occurred while attempting to update the questionnaire')
            })
        }

        function _postPutBtn() {
            for (let i = 0; i < vm.questionnairesData.questions.length; i++) {
                if (vm.questionnairesData.questions[i].type == "emoji" || vm.questionnairesData.questions[i].type == "short-text" || vm.questionnairesData.questions[i].type == "long-text") {
                    vm.questionnairesData.questions[i].answers = []
                }
            }
            if (!vm.questionnairesForm.$valid) {
                return
            }
            else if (!$stateParams.id) {
                _createQuestionnaire()
            } else {
                _updateQuestionnaire()
            }
        }

        function _addQuestionBtn() {
            vm.questionnairesData.questions.push({ answers: [] })
        }

        function _removeQuestionBtn(index) {
            vm.questionnairesData.questions.splice(index, 1)
        }

        function _addAnswerBtn(index) {
            vm.questionnairesData.questions[index].answers.push('')
        }

        function _removeAnswerBtn(parent, index) {
            vm.questionnairesData.questions[parent].answers.splice(index, 1)
        }

        function _cancelBtn() {
            $state.go('main.questionnaires.list')
        }

    }
})();
(function () {
    'use strict'
    angular.module('client.main.pages.questionnaires').component('questionnairesDetail', {
        templateUrl: 'client/main/pages/questionnaires/detail/questionnaire.detail.html',
        controller: 'questionnaireDetailController',
        bindings: {
            traumaTypes: '<'
        }
    })
})();