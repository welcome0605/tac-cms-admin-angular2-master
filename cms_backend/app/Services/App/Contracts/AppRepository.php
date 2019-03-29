<?php

namespace App\Services\App\Contracts;
use App\Services\Repositories\BaseRepository;
use App\Services\App\Entities\App;

interface AppRepository extends BaseRepository
{  
   public function saveAppData($appData);
   public function getAllAppData($appArray,$userRole,$status);
   public function getBlockAppData($appArray,$userRole,$status,$paginum);
   public function getAppForAssignUser();
   public function getAppForNotAssignedUser();
   public function getAppSectionData($slug);
   public function saveAppBasicDetailData($appBasicDetailData);
   public function saveNotificationData($insertData);
   public function saveHomeScreenData($insertData);
   public function saveMenuConfigurationData($insertData);
   public function saveAutoupgradeData($insertData);
   public function getAllAppSection();
   public function getAppBasicDetailData($id);
   public function getSingleAppData($id);
   public function getAllAppCssData();
   public function saveCssData($request);
   public function getCssData($body);
   public function getMenuData($body);
   public function getSubMenuCssData($body);
   public function updateFinalJsonData($data,$finalJSON);
   public function getAppVersionData($uniqueId);
   public function generateNewJsonVersion($newData,$basicData,$menuData);
   public function publishVersion($body);
   public function getAppBasicDataUsingVersion($body);
   public function saveRatepopupData($insertData); 
   public function getBasicData();
   public function getFontData();
   public function getLangData();
   public function saveDataAdmin($body);
   public function getDataAdmin($body);
   public function saveSuperAdminData($body);
   public function getSuperAdminSettingData();
   public function getMenuIconDataFun();
   public function getTraData();

}
