; (function () {
    "use strict"

    angular.module("client.main.pages.clientProfiles")
        .controller("profilesCreateController", ProfilesCreateController)

    ProfilesCreateController.$inject = ['clientProfileServices', 'usersService', '$log', '$state', '$stateParams', 'uiNotificationsService']

    function ProfilesCreateController(clientProfileServices, usersService, $log, $state, $stateParams, uiNotificationsService) {
        const vm = this
        vm.formData = null
        vm.$onInit = $init
        vm.validationMessage = _validationMessage
        vm.validation = _validation
        vm.validationForm = _validationForm
        vm.submit = _submit
        vm.create = _create
        vm.update = _update
        vm.button = "Submit Profile"


        function $init() {
            vm.formData = {}
            vm.formData.bioViewerIds = []
            vm.dropdownArray = []
            vm.formData.isBioPublic = false

            for (let supporter of vm.supporters) {
                vm.dropdownArray.push(supporter)
            }

            for (let therapist of vm.therapists) {
                vm.dropdownArray.push(therapist)
            }

            for (let client of vm.clients) {
                vm.dropdownArray.push(client)
            }

            if ($stateParams.id) {
                readById($stateParams.id)
            }
        }

        function readById(id) {

            clientProfileServices.readById(id)
                .then(data => {
                    vm.formData = data.item
                    switch (data.item.gender) {
                        case 'Male':
                            vm.formData.gender = "m"
                            break;
                        case 'Female':
                            vm.formData.gender = "f"
                            break;
                        default:
                            vm.formData.genderOther = data.item.gender
                            vm.formData.gender = "o"
                    }

                    vm.button = "Update Profile"

                })
                .catch(data => $log.log(`Error: ${data}`))
        }

        function _validationMessage(formFields) {
            return (vm.form.$submitted && vm.form[formFields].$error.required) || (vm.form.$submitted && vm.form[formFields].$error.pattern)
        }

        function _validation(formFields) {
            return vm.form.$submitted && vm.form[formFields].$invalid
        }

        function _validationForm(isValid) {
            if (vm.form.$invalid) {
                return
            } else {
                _submit()
            }
        }

        function _submit() {
            if (vm.formData.isBioPublic == true) {
                vm.formData.bioViewerIds = []
            }
            if (vm.formData._id) {
                _update()
            } else {
                _create()

            }
        }
        function _create() {
            switch (vm.formData.gender) {
                case 'm':
                    vm.formData.gender = "Male"
                    break;
                case 'f':
                    vm.formData.gender = "Female"
                    break;
                default:
                    vm.formData.gender = vm.formData.genderOther
            }
            vm.formData.genderOther = vm.formData.gender
            clientProfileServices.create(vm.formData)
                .then(function (data) {
                    vm.formData = {}
                    $state.go('main.clientProfiles.list')
                    uiNotificationsService.success('Client profile successfully created.')

                })
                .catch(data => {
                    $log.log(`Error: ${data}`),
                        uiNotificationsService.error('An error occurred while attempting to create the client profile.')
                })
        }
        function _update() {
            switch (vm.formData.gender) {
                case 'm': vm.formData.gender = "Male"
                    break;
                case 'f': vm.formData.gender = "Female"
                    break;
                default: vm.formData.gender = vm.formData.genderOther
            }
            clientProfileServices.update(vm.formData, vm.formData._id)
                .then(function (data) {
                    $state.go('main.clientProfiles.list')
                    uiNotificationsService.success('Client profile successfully updated.')
                })
                .catch(data => {
                    $log.log(`Error: ${data}`)
                    uiNotificationsService.error('An error occurred while attempting to update the client profile.')
                })
        }
    }
    angular.module('client.main.pages.clientProfiles')
        .component('clientProfilesDetailComponent', {
            templateUrl: 'client/main/pages/client.profiles/detail/client.profiles.detail.html',
            controller: 'profilesCreateController as $ctrl',
            bindings: {
                therapists: '<',
                supporters: '<',
                clients: '<'
            }
        })
})()



