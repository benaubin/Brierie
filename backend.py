import tornado.ioloop
import tornado.web
import tornado.escape
import threading
from mcstatus import MinecraftServer
     
brierie_status = {
    "error": "status_not_checked",
    "error_message": "The backend is still starting up. Please wait."
}

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write((brierie_status))

application = tornado.web.Application(
    [
        (r"/", MainHandler),
    ],
    debug=True
)

def check_status(server):
    print("   - " + server['ip'])
    Server = MinecraftServer.lookup(server['ip'])
    
    try:
        status = vars(Server.status())
        status['players'] = vars(Server.query().players)
    except: 
        try:
            status = vars(Server.status())
            status['players'] = vars(status['players'])
            print("'query' is not enabled on {0}.".format(server['ip']))
        except: 
            server['status'] = {
                "error": True,
                "reason": "Cannot connect to server for unknown reasons."
            }
            return server
    
    status['version'] = vars(status['version'])
    status['mods'] = map(lambda mod: mod['modid'], status['raw']['modinfo']['modList']) if status['raw']['modinfo'] else false
    del status['raw'], status['description']
    
    server['status'] = status
    
    return server

def check_all_servers():
    print("Updating Servers...")
    global brierie_status
    
    servers = map(check_status, [
            {
                "name": "Infinity",
                "ip": "inf.brierie.co"
            },
            {
                "name": "Direwolf20",
                "ip": "dw20.brierie.co"
            },
            {
                "name": "Horizons 2",
                "ip": "horizons.brierie.co"
            }, 
            {
                "name": "Departed",
                "ip": "departed.brierie.net"
            },
            {
                "name": "Cloud9",
                "ip": "cloud9.brierie.co"
            },
            {
                "name": "Unleashed",
                "ip": "u.brierie.co:20000"
            },
            {
                "name": "Vanilla",
                "ip": "mc.brierie.co"
            },
            {
                "name": "Monster",
                "ip": "monster.brierie.co"
            },
            {
                "name": "FTB Lite 3",
                "ip": "lite3.brierie.net"
            },
            {
                "name": "Ultimate",
                "ip": "ultimate.brierie.co"
            }, 
            {
                "name": "Horizons",
                "ip": "horizons.brierie.net"
            },
            {
                "name": "Tech World 2",
                "ip": "tw2.brierie.co"
            },
            {
                "name": "Regrowth",
                "ip": "regrowth.brierie.net"
            },
            {
                "name": "SkyFactory2",
                "ip": "sf2.brierie.net"
            },
            {
                "name": "SkyBlock",
                "ip": "skyblock.brierie.co"
            },
            {
                "name": "TPPI",
                "ip": "tppi.brierie.co"
            },
        ])
    
    
    brierie_status = {
        "servers": servers
    }
    
    print("Updated Servers.")
    threading.Timer(30, check_all_servers).start()

threading.Timer(1, check_all_servers).start()

def start_server(port):
    try:
        application.listen(port)
        print("Starting server on ", port)
    except:
        start_server(port+1)

if __name__ == "__main__":
    start_server(8888)
    tornado.ioloop.IOLoop.current().start()