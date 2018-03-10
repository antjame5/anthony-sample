; (function () {
    "use strict"

    angular.module("client.main.pages.clientProfiles")
        .controller("profilesListController", ProfilesListController)

    ProfilesListController.$inject = ['clientProfileServices', '$log', '$state', 'uiNotificationsService']

    function ProfilesListController(clientProfileServices, $log, $state, uiNotificationsService) {
        const vm = this
        vm.formData = null
        vm.$onInit = $init
        vm.edit = _edit
        vm.delete = _delete

        function $init() {
            vm.formData = vm.clientProfilesListComponent
        }
        function _edit(id) {
            $state.go('main.clientProfiles.create', { "id": id })
        }
        function _delete(id, index) {
            uiNotificationsService.confirm('Are you sure you want to delete this client profile?', 'Yes, delete', 'No, cancel')
            if (confirm("Are you sure?")) {
                clientProfileServices.delete(id, vm.formData)
                    .then(data => {
                        uiNotificationsService.confirm('User successfully deleted.')
                        $state.go('main.clientProfiles.list')
                        vm.formData.splice(index, 1)
                    })
                    .catch(data => {
                        $log.log(`Error: ${data}`),
                        uiNotificationsService.error('An error occurred while attempting to delete the client profile.')
                    })
            }
        }
    }
    angular.module('client.main.pages.clientProfiles')
        .component('clientProfilesListComponent', {
            templateUrl: 'client/main/pages/client.profiles/list/client.profiles.list.html',
            controller: 'profilesListController as $ctrl',
            bindings: {
                clientProfilesListComponent: '<'
            }
        })
})()