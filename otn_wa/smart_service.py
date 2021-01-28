#! /usr/bin/env python3

import os
import threading
import time
import logging
from util.litchi import Litchi

class SmartService():
    def __init__(self, topo=None):
        self.ne_list = []
        self.ne_number = 0
        self.link_list = []
        self.__init_topo__(topo)
        self.db = Litchi("smart_service")

    def compute_route_4(self, param):
        '''
        Only for 4 NEs, full-mesh
        param is an json object as 
        {
            "srcNe": "site1",
            "dstNe": "site3",
        }
        '''
        if self.ne_number < 2:
            logging.warning(f"NE number is {self.ne_number}")
            return -101
        if 'srcNe' not in param:
            logging.warning("Key 'srcNe' was not found in parameters")
            return -102
        if 'dstNe' not in param:
            logging.warning("Key 'dstNe' was not found in parameters")
            return -103
        if 'algorithm' not in param:
            logging.warning("Key algorith was not found in parameters, using default")
            param["algorithm"] = 0
        
        src_ne = param["srcNe"].lower()
        dst_ne = param["dstNe"].lower()

        if src_ne not in self.ne_list:
            logging.warning("srcNe was not found in NE list")
            return -201
        if dst_ne not in self.ne_list:
            logging.warning("dstNe was not found in NE list")
            return -202

    def find_all_routes(self, src_ne, dst_ne):
        # re-order the ne_list in a copy. the first is src ne, the last is the dst ne
        ne_list = [src_ne]
        for ne in self.ne_list:
            if ne == src_ne or ne == dst_ne:
                continue
            ne_list.append(ne)
        ne_list.append(dst_ne)
        # generate all possible pathes
        routes = [
            { 'path': [ne_list[0], ne_list[3]], 'weight': 0 },
            { 'path': [ne_list[0], ne_list[2], ne_list[3]], 'weight': 0 },
            { 'path': [ne_list[0], ne_list[1], ne_list[3]], 'weight': 0 },
            { 'path': [ne_list[0], ne_list[1], ne_list[2], ne_list[3]], 'weight': 0 },
            { 'path': [ne_list[0], ne_list[2], ne_list[1], ne_list[3]], 'weight': 0 },
        ]
        # calculate weights
        return routes

    def route_validation(self, route, avoid_ne_list=[], must_ne_list=[], avoid_link_list=[], must_link_list=[]):
        '''
        NE-list is like ["Site1", "Site2", ...]
        link-list is like [["Site1", "Site2"], ["Site2", "Site3"], ...]
        '''
        path = route["path"]
        # exclude avoid ne
        if avoid_ne_list is not None:
            for ne in avoid_ne_list:
                if ne in path:
                    return False
        # exclude path without must NE
        if must_ne_list is not None:
            for ne in must_ne_list:
                if ne not in path:
                    return False
        # exclude avoid path
        if avoid_link_list is not None:
            for index in range(len(path) - 1):
                step = [path[index], path[index+1]]
                for link in avoid_link_list:
                    if (link[0].lower() == step[0].lower and link[1].lower() == step[1].lower) \
                    or (link[1].lower() == step[0].lower and link[0].lower() == step[1].lower):
                        return False
        # exclude path without must link
        if must_link_list is not None:
            isMustPresent = False
            for link in must_link_list:
                for index in range(len(path) - 1):
                    step = [path[index], path[index+1]]
                    if (link[0].lower() == step[0].lower and link[1].lower() == step[1].lower) \
                    or (link[1].lower() == step[0].lower and link[0].lower() == step[1].lower):
                        break
                else:
                    return False
        # all check passed
        return True

    def __init_topo__(self, input):
        if input is None:
            self.ne_list = ["Site1", "Site2", "Site3", "Site4"]
            self.ne_number = len(self.ne_list)
            self.link_list = [
                {"from": "Site1", "to": "Site2", "cost": 222, "delay": 833, "jump": 1},
                {"from": "Site1", "to": "Site3", "cost": 212, "delay": 733, "jump": 1},
                {"from": "Site1", "to": "Site4", "cost": 232, "delay": 683, "jump": 1},
                {"from": "Site2", "to": "Site3", "cost": 242, "delay": 533, "jump": 1},
                {"from": "Site2", "to": "Site4", "cost": 252, "delay": 433, "jump": 1},
                {"from": "Site3", "to": "Site4", "cost": 262, "delay": 9333, "jump": 1}
            ]

    def __weight_calculate__(self, route, algorithm=1):
        if algorithm == 1: key = "jump"
        elif algorithm == 2: key = "delay"
        else: key = "cost"
        path = route['path']
        weight = 0
        for index in range(len(path) - 1):
            step = [path[index], path[index+1]]
            for link in self.link_list:
                if (link["from"] == step[0] and link["to"] == step[1]) \
                or (link["from"] == step[1] and link["to"] == step[0]):
                    weight = weight + link[key]
                    break
        return weight

    def get_edges(self):
        return self.link_list

    def update_link(self, new_link):
        '''
        new_link = {
            "from": "Site1",
            "to": "site2",
            "cost": 2,
            "delay": 2,
            "jump": 1
        }
        '''
        for index in range(len(self.link_list)):
            link = self.link_list[index]
            link_name = link["from"] + link["to"]
            if (new_link["from"].lower() == link["from"] and new_link["to"].lower() == link["to"]) \
            or (new_link["from"].lower() == link["to"] and new_link["to"].lower() == link["from"]) :
                if "cost" in new_link:
                    link["cost"] = new_link["cost"]
                if "delay" in new_link:
                    link["delay"] = new_link["delay"]
                if "jump" in new_link:
                    link["jump"] = new_link["jump"]
                break
        else:
            new_link["from"] = new_link["from"].lower()
            new_link["to"] = new_link["to"].lower()
            self.link_list.append(new_link)
        
    def get_service_routes(self, parameters):
        '''
        parameters: {
            name: "xxxx",
            isAuto: 1,    // 1 | 0
            aNe: "Site1",
            aPort: "xxx",
            zNe: "Site3",
            zPort: "yyy",
            algorithm: 1,       // 1: 最小跳数； 2: 最小延迟； 3: 最小代价
            protection: 1,      // 1: 无保护； 2：1+1保护； 3：1+1重路由； 4：无保护重路由
            priority: 1,        // 1-5
            rate: "ODU0",       // ODU0-ODU4 | OCH
            direction: 1,       // 1 = single direction; 2 = bi-direction
            must_nes: ["Site1", "Site2"],
            avoid_nes: ["Site3"]
        }
        '''
        must_ne_list = None
        must_link_list = None
        avoid_ne_list = None
        avoid_link_list = None
        algorithm = 1
        protection = 1
        if "must_nes" in parameters: 
            must_ne_list = parameters["must_nes"]
        if "must_links" in parameters:
            must_link_list = parameters["must_links"]
        if "avoid_nes" in parameters: 
            avoid_ne_list = parameters["avoid_nes"]
        if "avoid_links" in parameters:
            avoid_link_list = parameters["avoid_links"]
        if "algorithm" in parameters:
            algorithm = parameters["algorithm"]
        if "protection" in parameters:
            protection = parameters["protection"]
        # find all possible routes
        routes = self.find_all_routes(parameters["aNe"], parameters["zNe"])
        # remove the routes do not meet requirement
        for route in routes[:]:
            if not self.route_validation(
                route, 
                must_ne_list=must_ne_list, 
                avoid_ne_list=avoid_ne_list,
                must_link_list=must_link_list,
                avoid_link_list=avoid_link_list):
                routes.remove(route)
        # weigt
        for route in routes:
            route["weight"] = self.__weight_calculate__(route, algorithm=algorithm)
        # sort
        routes.sort(key = lambda route: route["weight"])
        # protection
        if protection == 1 or protection == 4:
            routes = routes[0:1]
        else:
            routes = routes[0:2]
        return routes

    def setup_service(self, parameters):
        if "name" not in parameters or "aNe" not in parameters or "zNe" not in parameters:
            return -1, "parameter must have name, aNe, zNe"
        routes = self.get_service_routes(parameters)
        if len(routes) <= 0:
            return 2, "Can not find routes under given condition"
        result = parameters
        result.update({
            "routes": routes,
            "name": parameters["name"],
            "status": 0
        })
        r = self.db.add_update_item(result)
        return 1, {"id": r}

    def get_all_service(self):
        return self.db.get_all_items()

    def update_service(self, id, parameters):
        item = self.db.get_item_by_id(id)
        item.update(parameters)
        self.db.update_item(item)
        return 1, item

if __name__ == "__main__":
    logging.basicConfig(level=logging.DEBUG, format="[%(asctime)s] %(filename)s[:%(lineno)d] %(message)s")
    instance = SmartService()
    r = instance.get_service_routes({
        "name": "testing1",
        "isAuto": 0,
        "aNe": "Site4",
        "zNe": "Site3",
        "algorithm": 1,
        "protection": 2,
        "must_nes": ["Site2"],
        "avoid_nes": ["Site1"]
    }) # expected: [{'path': ['Site4', 'Site2', 'Site3'], 'weight': 2}]
    logging.info(r)

    r = instance.setup_service({
        "name": "testing1",
        "isAuto": 0,
        "aNe": "Site4",
        "zNe": "Site3",
        "algorithm": 3,
        "protection": 2
    })
    logging.debug(r)
