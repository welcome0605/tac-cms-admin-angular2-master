<?php

namespace App\Services\APP\Repositories;

use DB;
use Config;
use App\Services\APP\Contracts\AppRepository;
use App\AppBasic;
use App\AppSection;
use App\AppBasicDetail;
use App\AppCss;
use App\AppIndustryType;
use App\AppFontFamily;
use App\AppLang;
use App\SettingData;
use App\superAdminSettingData;
use App\AppMenuIcon;
use App\StripeTransaction;
use App\StripeSubscription;
use App\Services\Repositories\Eloquent\EloquentBaseRepository;

class EloquentAppRepository extends EloquentBaseRepository implements AppRepository {

    public function __construct() 
    {
        $this->objAppBasic = new AppBasic();
        $this->objAppSection = new AppSection();
        $this->objAppBasicDetail = new AppBasicDetail();
        $this->objIndustryType = new AppIndustryType();
        $this->objAppCss = new AppCss();
        $this->objAppFontFamily = new AppFontFamily(); 
        $this->objAppLang = new AppLang(); 
        $this->objSettingData = new SettingData();
        $this->objSuperAdminSettingData = new superAdminSettingData();
        $this->objAppMenuIcon = new AppMenuIcon();
        $this->objStrData = new StripeTransaction();
        $this->objStrsubData = new StripeSubscription();
    }

    public function saveAppData($appData)
    {
        return $this->objAppBasic->saveData($appData);
    }

    public function getAllAppData($appArray,$userRole,$status)
    {
        return $this->objAppBasic->getAllAppData($appArray,$userRole,$status);
    }

    public function getBlockAppData($appArray,$userRole,$status,$paginum)
    {
        return $this->objAppBasic->getBlockAppData($appArray,$userRole,$status,$paginum);
    }

    public function getSingleAppData($id)
    {
        return $this->objAppBasic->getSingleAppData($id);
    }

    public function getAppSectionData($slug)
    {
        return $this->objAppSection->getSectionData($slug);
    }

    public function saveAppBasicDetailData($appBasicDetailData)
    {
        return $this->objAppBasicDetail->saveData($appBasicDetailData);
    }
    
    public function saveAutoupgradeData($insertData) 
    {
        return $this->objAppBasicDetail->saveData($insertData);
    }
    
    public function saveNotificationData($insertData) 
    {
        return $this->objAppBasicDetail->saveData($insertData);
    }
    
    public function saveRatepopupData($insertData)
    {
        return $this->objAppBasicDetail->saveData($insertData);
    }
    public function saveHomeScreenData($insertData)
    {
       return $this->objAppBasicDetail->saveData($insertData);
    }
    public function saveMenuConfigurationData($insertData)
    {
       return $this->objAppBasicDetail->saveData($insertData);
    }
    public function getAppBasicDetailData($id)
    {
        return $this->objAppBasicDetail->getData($id);
    }

    public function getAllAppSection()
    {
       return $this->objAppSection->getAllAppSection(); 
    }

    public function getAppForAssignUser()
    {
        return $this->objAppBasic->getAppForAssignUser();
    }
    
    public function getAppForNotAssignedUser()
    {
        return $this->objAppBasic->getAppForNotAssignedUser();
    }

    public function getAllAppCssData()
    {
        return $this->objAppCss->getAllCssData();
    }

    public function saveCssData($request)
    {
        return $this->objAppBasic->saveModuleCssData($request);   
    }

    public function getCssData($body)
    {
        return $this->objAppBasic->getDataCss($body);   
    }
    
    public function getSubMenuCssData($body) 
    {
        return $this->objAppBasic->getSubMenuCss($body);
    }

    public function updateFinalJsonData($body,$finalJSON)
    {
        return $this->objAppBasic->updateFinalJsonData($body,$finalJSON);   
    }

    public function getMenuData($body)
    {
        return $this->objAppBasic->getMenuData($body);      
    }    

    public function getAppVersionData($uniqueId)
    {
        return $this->objAppBasic->getAppDataUsingUniqueId($uniqueId); 
    }
    
    public function generateNewJsonVersion($newData,$basicData,$menuData)
    {
        return $this->objAppBasic->generateNewJsonVersion($newData,$basicData,$menuData); 
    }
    
    public function publishVersion($body)
    {
        return $this->objAppBasic->publishVersion($body); 
    }
    
    public function getAppBasicDataUsingVersion($body)
    {
        return $this->objAppBasic->getAppBasicDataUsingVersion($body); 
    }

    public function getBasicData()
    {
        return $this->objIndustryType->getIndustryType(); 
    }

    public function getFontData()
    {
        return $this->objAppFontFamily->getFontTypeData(); 
    }

    public function getLangData()
    {
        return $this->objAppLang->getLangData(); 
    }

    public function saveDataAdmin($body)
    {
        return $this->objSettingData->saveSettingDataFun($body);
    }
    
    public function getDataAdmin($body)
    {
        return $this->objSettingData->getSettingDataFun($body);
    }
    
    public function saveSuperAdminData($body)
    {
        return $this->objSuperAdminSettingData->saveSuperAdminSettingDataFun($body);
    }

    public function getSuperAdminSettingData()
    {
        return $this->objSuperAdminSettingData->getSuperAdminSettingDataFun();   
    }

    public function getMenuIconDataFun()
    {
        return $this->objAppMenuIcon->getMenuIconDataFun();
    }

    public function getTraData()
    {
        return $this->objStrData->getTraData();
    }

    public function getSubscriptionData()
    {
        return $this->objStrsubData->getSubscriptionData();
    }
}
