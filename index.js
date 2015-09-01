BACKEND_IP = "http://localhost:8888"
angular.module('brierie', [])
.controller('IndexCtrl',function($scope, Refresh, ModList){
    //Note, 'query' has to be enabled in the server's server.properties. 
    $scope.mods = ModList;
    
    $scope.showServers = function(amount){
        amount = amount || $scope.serverCount || 4;
        $scope.serverCount = amount;
        
        $scope.servers = (amount)? $scope.allServers.slice(0, amount): $scope.allServers;
    }
    
    $scope.refresh = function(){
        Refresh.then(function(data){
            $scope.allServers = data['data']['servers'];

            $scope.showServers();
        })
    }
    
    $scope.refresh()
}).factory('Refresh',function($http){
    return $http.get(BACKEND_IP)
}).factory('ModList',function(){
    return [
            {
                type: "tech",
                size: "32",
                mods: [
                    'appliedenergistics2-core',
                    'EnderIO',
                    'TConstruct',
                    'IC2',
                    'ThermalFoundation'
                ]
            },
            {
                type: "magic",
                size: "32",
                mods: [
                    'AWWayofTime',
                    'Botania',
                    'Forestry',
                    'Thaumcraft',
                    'witchery'
                ]
            },
            {
                type: "minor-tech",
                size: "16",
                mods: [
                    'BigReactors',
                    'BuildCraft|Core',
                    'ComputerCraft',
                    'ExtraUtilities',
                    'rftools',
                    'OpenBlocks'
                ],
                classes: 'max-3'
            },
            {
                type: 'other',
                size: "16",
                mods: [
                    'chisel',
                    'BiblioCraft',
                    'CarpentersBlocks',
                    'BiomesOPlenty'
                ],
                classes: 'max-2'
            }
        ]
});