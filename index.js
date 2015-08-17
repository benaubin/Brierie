angular.module('brierie', [])
.controller('IndexCtrl',function($scope, MinecraftServer){
    //Note, 'query' has to be enabled in the server's server.properties. 

    $scope.allServers = [
        new MinecraftServer("Infinity", "inf.brierie.co"),
        new MinecraftServer("Direwolf20", "dw20.brierie.co"),
        new MinecraftServer("Horizons 2", "horizons.brierie.co"), 
        new MinecraftServer("Departed", "departed.brierie.net"),
        new MinecraftServer('Cloud9', "cloud9.brierie.co"),
        new MinecraftServer("Unleashed", "u.brierie.co:20000"),
        new MinecraftServer('Vanilla', "mc.brierie.co"),
        new MinecraftServer('Monster', "monster.brierie.co"),
        new MinecraftServer('FTB Lite 3', "lite3.brierie.net"),
        new MinecraftServer("Ultimate", "ultimate.brierie.co"), 
        new MinecraftServer("Horizons", "horizons.brierie.net"),
        new MinecraftServer('Tech World 2', "tw2.brierie.co"),
        new MinecraftServer("Regrowth", "regrowth.brierie.net"),
        new MinecraftServer("SkyFactory2", "sf2.brierie.net"),
        new MinecraftServer('SkyBlock', "skyblock.brierie.co"),
        new MinecraftServer('TPPI', "tppi.brierie.co"),
    ]
    $scope.mods = [
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
    
    $scope.showServers = function(amount){
        $scope.servers = (amount)? $scope.allServers.slice(0, amount): $scope.allServers;
    }
    
    $scope.showServers(4)
    
    $scope.allServers.forEach(function(server, i){
        server.refresh();
    })
}).factory('MinecraftServer',function($http){
    function MinecraftServer(name, ip) {
        this.name = name;
        this.ip = ip;
        this.loaded = false;
    }
    
    MinecraftServer.prototype.acceptData = function(data){
        data = data.data;

        if(data.error == undefined){
            if(data.protocol){
                this.onlinePlayers = data.online;
                this.online = true;
                this.max = data.max;
                this.ping = data.latency;
                this.mcVersion = data.version;
                this.mods = data.modinfo.modList.map(function(mod){
                                return mod.modid;
                            });
                this.modsCount = this.mods.length;
                this.favicon = data.favicon;
                this.vanilla = data.server === "BungeeCord";
            } else {
                this.online = false;
                this.error = "Cannot query online server."
            }
        } else {
            this.online = false;
            this.error = "Offline"
        }
        
        this.loaded = true;
    }
    MinecraftServer.prototype.refresh = function(){return $http.get("http://mcping.net/api/" + this.ip).then(this.acceptData.bind(this));}
    MinecraftServer.prototype.hasMod = function(modid){
        return (this.mods)? this.mods.indexOf(modid) != -1 : false;
    }
    
    return MinecraftServer;
});