<?php

namespace App\Services\AppMenu\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\AppMenu\Entities\App;

interface AppMenuRepository extends BaseRepository
{  
   public function saveAppMenuData($appData);
   public function getAllAppMenuData($appId);
   public function deleteAppMenu($id);
   public function getOrder($app_basic_id,$is_parent);
   public function updateOrder($app_basic_id,$is_parent,$order);
   public function getAllAppMenuTypeData();
   public function getIndividualMenuTypeData($id);
   public function saveOrderedData($menuData,$subMenuData);
   public function getSubMenuForParent($parentId,$newCreatedId,$basicId);
   public function getParentMenuTypeData($parentId);
   
}
