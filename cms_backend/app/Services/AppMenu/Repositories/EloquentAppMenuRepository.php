<?php

namespace App\Services\AppMenu\Repositories;

use DB;
use Config;
use App\Services\AppMenu\Contracts\AppMenuRepository;
use App\AppMenu;
use App\AppMenuType;
use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentAppMenuRepository extends EloquentBaseRepository implements AppMenuRepository {

    public function __construct() 
    {
        $this->objAppMenu = new AppMenu();
        $this->objAppMenuType = new AppMenuType();
    }

    public function saveAppMenuData($AppMenuData)
    {
        return $this->objAppMenu->saveData($AppMenuData);
    }
    
    public function getAllAppMenuData($appId)
    {
        return $this->objAppMenu->getAppMenuData($appId);
    }
    
    public function getAllAppMenuTypeData() 
    {
        return $this->objAppMenuType->getMenuTypeData();
    }

    public function getIndividualMenuTypeData($id)
    {
        return $this->objAppMenu->getMenuDataById($id);
    }
    
    public function getParentMenuTypeData($parentId) 
    {
        return $this->objAppMenu->getParentMenuData($parentId);
    }

    public function deleteAppMenu($id)
    {
        return $this->objAppMenu->deleteAppMenu($id);
    }

    public function getOrder($app_basic_id,$is_parent)
    {
        return $this->objAppMenu->getOrder($app_basic_id,$is_parent);
    }

    public function updateOrder($app_basic_id,$is_parent,$order)
    {
        return $this->objAppMenu->updateOrder($app_basic_id,$is_parent,$order);
    }

    public function saveOrderedData($menuData,$subMenuData)
    {
        return $this->objAppMenu->getAllMenuData($menuData,$subMenuData);
    }
    
    public function getSubMenuForParent($parentId,$newCreatedId,$basicId) 
    {
        return $this->objAppMenu->getSubMenuForParent($parentId,$newCreatedId,$basicId);
    }

}
