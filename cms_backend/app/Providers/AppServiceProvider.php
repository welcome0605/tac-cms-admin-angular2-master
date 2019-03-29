<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\User\Contracts\UserRepository;
use App\Services\User\Entities\User;
use App\Services\User\Repositories\EloquentUserRepository;

use App\Services\EmailTemplate\Contracts\EmailTemplateRepository;
use App\Services\EmailTemplate\Repositories\EloquentEmailTemplateRepository;
use App\Services\EmailTemplate\Entities\EmailTemplate;

use App\Services\App\Contracts\AppRepository;
use App\Services\App\Repositories\EloquentAppRepository;
use App\Services\App\Entities\App;

use App\Services\AppAssignUser\Contracts\AppAssignUserRepository;
use App\Services\AppAssignUser\Repositories\EloquentAppAssignUserRepository;
use App\Services\AppAssignUser\Entities\AppAssignUser;

use App\Services\AppMenu\Contracts\AppMenuRepository;
use App\Services\AppMenu\Repositories\EloquentAppMenuRepository;
use App\Services\AppMenu\Entities\AppMenu;

use App\Services\FitnessChallenge\Contracts\FitnessChallengeRepository;
use App\Services\FitnessChallenge\Repositories\EloquentFitnessChallengeRepository;
use App\Services\FitnessChallenge\Entities\FitnessChallenge;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }

    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind(UserRepository::class, function () {
            return new EloquentUserRepository(new User());
        });
        
        $this->app->bind(EmailTemplateRepository::class, function () {
            return new EloquentEmailTemplateRepository(new EmailTemplate());
        });

        $this->app->bind(FitnessChallengeRepository::class, function () {
            return new EloquentFitnessChallengeRepository(new FitnessChallenge());
        });

        $this->app->bind(AppRepository::class, function () {
            return new EloquentAppRepository(new App());
        });

        $this->app->bind(AppAssignUserRepository::class, function () {
            return new EloquentAppAssignUserRepository(new AppAssignUser());
        });

        $this->app->bind(AppMenuRepository::class, function () {
            return new EloquentAppMenuRepository(new AppMenu());
        });
    }
}
